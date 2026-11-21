// Daily event ingestion worker (Supabase Edge Function, Deno).
//
// Pulls events from the free sources enabled in `event_sources`, normalises them
// and keeps the `events` table in sync:
//   • new events       → inserted (status 'approved', is_external, source_url)
//   • changed events   → updated (date/venue/title/banner) — status is NEVER
//                        touched, so an admin's hide/star is respected
//   • dropped events   → retired (approved → cancelled) after a 2-day grace
//
// Registration always redirects to `source_url`; we never take it on Upshot.
//
// Secrets (set with `supabase secrets set …`):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (provided automatically on deploy)
//   TICKETMASTER_API_KEY                      (your free Discovery API key)
//
// Invoke daily via pg_cron (see the deploy notes), or manually from the admin
// "Event Sources" screen.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

type Incoming = {
  external_id: string;
  title: string;
  description: string | null;
  event_date: string;        // YYYY-MM-DD
  event_time: string | null; // HH:MM
  location: string;
  category: string;
  banner_url: string | null;
  source_url: string;
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const TM_KEY = Deno.env.get("TICKETMASTER_API_KEY") ?? "";

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const today = () => new Date().toISOString().slice(0, 10);

// ─── Ticketmaster Discovery API ───────────────────────────────────────────────
async function fetchTicketmaster(cities: string[]): Promise<Incoming[]> {
  if (!TM_KEY) throw new Error("TICKETMASTER_API_KEY not set");
  const out: Incoming[] = [];
  const targets = cities.length ? cities : [""]; // no city = country-wide
  for (const city of targets) {
    const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
    url.searchParams.set("apikey", TM_KEY);
    url.searchParams.set("countryCode", "IN");
    url.searchParams.set("size", "100");
    url.searchParams.set("sort", "date,asc");
    if (city) url.searchParams.set("city", city);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Ticketmaster ${res.status}`);
    const json = await res.json();
    const events = json?._embedded?.events ?? [];
    for (const ev of events) {
      const date = ev?.dates?.start?.localDate;
      if (!date) continue;
      const venue = ev?._embedded?.venues?.[0];
      const cityName = venue?.city?.name;
      const location = [venue?.name, cityName].filter(Boolean).join(", ") || cityName || "";
      const img = (ev?.images ?? [])
        .filter((i: any) => i.width >= 600)
        .sort((a: any, b: any) => b.width - a.width)[0];
      out.push({
        external_id: ev.id,
        title: ev.name ?? "Event",
        description: (ev.info ?? ev.pleaseNote ?? "")?.slice(0, 600) || null,
        event_date: date,
        event_time: ev?.dates?.start?.localTime?.slice(0, 5) ?? null,
        location,
        category: ev?.classifications?.[0]?.segment?.name ?? "Event",
        banner_url: img?.url ?? null,
        source_url: ev.url, // official registration page
      });
    }
  }
  return out;
}

// ─── schema.org / JSON-LD feeds ───────────────────────────────────────────────
// Point this at ToS-permissive pages (config.urls) that publish schema.org
// Event data. Parses <script type="application/ld+json"> blocks for @type Event.
async function fetchSchemaOrg(urls: string[]): Promise<Incoming[]> {
  const out: Incoming[] = [];
  for (const pageUrl of urls) {
    try {
      const res = await fetch(pageUrl, { headers: { "user-agent": "UpshotBot/1.0" } });
      if (!res.ok) continue;
      const html = await res.text();
      const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
      for (const b of blocks) {
        let parsed: any;
        try { parsed = JSON.parse(b[1].trim()); } catch { continue; }
        const items = Array.isArray(parsed) ? parsed : parsed["@graph"] ?? [parsed];
        for (const it of items) {
          const type = Array.isArray(it["@type"]) ? it["@type"] : [it["@type"]];
          if (!type.some((t: string) => String(t).toLowerCase().includes("event"))) continue;
          const start = it.startDate ? String(it.startDate) : null;
          if (!start) continue;
          const loc = it.location?.name ??
            [it.location?.address?.addressLocality, it.location?.address?.addressRegion].filter(Boolean).join(", ") ??
            "";
          out.push({
            external_id: String(it.url ?? it["@id"] ?? `${it.name}-${start}`),
            title: it.name ?? "Event",
            description: (typeof it.description === "string" ? it.description : "")?.slice(0, 600) || null,
            event_date: start.slice(0, 10),
            event_time: start.length > 10 ? start.slice(11, 16) : null,
            location: loc,
            category: "Event",
            banner_url: typeof it.image === "string" ? it.image : (it.image?.url ?? null),
            source_url: it.url ?? pageUrl,
          });
        }
      }
    } catch {
      /* skip a bad page, keep going */
    }
  }
  return out;
}

// ─── Upsert one source's events, respecting admin hides ───────────────────────
async function syncSource(source: { key: string; name: string; cities: string[]; config: any }, items: Incoming[], runStart: string) {
  // Existing external rows for this source → know what to update vs insert.
  const { data: existing } = await admin
    .from("events")
    .select("id, external_id")
    .eq("source", source.key)
    .eq("is_external", true);
  const byExt = new Map((existing ?? []).map((e: any) => [e.external_id, e.id]));

  let inserted = 0, updated = 0;
  for (const it of items) {
    const common = {
      title: it.title,
      description: it.description,
      event_date: it.event_date,
      event_time: it.event_time,
      location: it.location,
      category: it.category,
      banner_url: it.banner_url,
      source_url: it.source_url,
      last_seen_at: runStart,
    };
    const id = byExt.get(it.external_id);
    if (id) {
      // Update mutable fields only — never `status` (respect admin hide) or is_featured.
      await admin.from("events").update(common).eq("id", id);
      updated++;
    } else {
      await admin.from("events").insert({
        ...common,
        source: source.key,
        source_name: source.name,
        external_id: it.external_id,
        is_external: true,
        status: "approved",
        coin_reward: 0,
        current_attendees: 0,
        company_id: null,
      });
      inserted++;
    }
  }

  // Retire events that dropped off the source (not seen in 2 days), only if still
  // publicly approved — leaves admin-hidden/past rows alone.
  const cutoff = new Date(Date.now() - 2 * 86400000).toISOString();
  const { count: retired } = await admin
    .from("events")
    .update({ status: "cancelled" }, { count: "exact" })
    .eq("source", source.key)
    .eq("is_external", true)
    .eq("status", "approved")
    .gte("event_date", today())
    .lt("last_seen_at", cutoff)
    .select("id", { count: "exact", head: true });

  return { inserted, updated, retired: retired ?? 0 };
}

Deno.serve(async (req) => {
  const runStart = new Date().toISOString();
  // Allowed callers:
  //   • the daily cron — sends header `x-cron-secret` matching the CRON_SECRET secret
  //   • a signed-in admin — sends their JWT (validated against profiles.role)
  //   • (fallback) the service-role key as a bearer
  const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
  const cronHeader = req.headers.get("x-cron-secret") ?? "";
  const token = (req.headers.get("authorization") ?? "").replace("Bearer ", "").trim();
  let allowed = (!!CRON_SECRET && cronHeader === CRON_SECRET) || token === SERVICE_KEY;
  if (!allowed && token) {
    const { data: { user } } = await admin.auth.getUser(token);
    if (user) {
      const { data: prof } = await admin.from("profiles").select("role").eq("id", user.id).single();
      allowed = prof?.role === "admin";
    }
  }
  if (!allowed) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  const { data: sources } = await admin.from("event_sources").select("*").eq("enabled", true);
  const summary: Record<string, unknown> = {};

  for (const src of sources ?? []) {
    try {
      let items: Incoming[] = [];
      if (src.key === "ticketmaster") items = await fetchTicketmaster(src.cities ?? []);
      else if (src.key === "schema_org") items = await fetchSchemaOrg(src.config?.urls ?? []);
      else continue;

      const result = await syncSource(src, items, runStart);
      summary[src.key] = { fetched: items.length, ...result };
      await admin.from("event_sources").update({
        last_synced_at: runStart,
        last_result: `${items.length} fetched · ${result.inserted} new · ${result.updated} updated · ${result.retired} retired`,
      }).eq("id", src.id);
    } catch (e) {
      summary[src.key] = { error: String(e) };
      await admin.from("event_sources").update({
        last_synced_at: runStart,
        last_result: `error: ${String(e).slice(0, 200)}`,
      }).eq("id", src.id);
    }
  }

  return new Response(JSON.stringify({ ok: true, ran_at: runStart, summary }), {
    headers: { "content-type": "application/json" },
  });
});
