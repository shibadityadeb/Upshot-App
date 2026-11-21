# External Event Aggregation — Platform Research & Feasibility

**Prepared for:** Upshot product/leadership review
**Scope:** Which external event platforms can feed events into Upshot, what each legally and technically allows, and what we can do **for free** today.
**Model:** List public events natively in Upshot, then **redirect out** to the official host to register — Upshot never takes the registration or payment.

> This is product/legal research, **not legal advice**. Indian scraping/deep-linking case law is thin, and several platform ToS pages are bot-blocked. Have an Indian IP/tech lawyer validate before launch, and re-verify the load-bearing items (APIs/ToS change often) near build time.

---

## 1. The one-line answer

**There is no single API that returns "all events."** The major event platforms deliberately do **not** expose their listings to code — they monetise through their own apps and **ban scraping** in their terms. So for most of the big names, the only legal path is a **business/partnership deal**, not a technical integration.

What *is* possible splits into four buckets:

1. **Free & open — connect today** (Devpost, Kaggle; Ticketmaster/SeatGeek but US-centric)
2. **Free but needs a key/approval** (Ticketmaster key, Bandsintown written consent)
3. **Paid** (Meetup Pro)
4. **Partnership-only** (AllEvents, BookMyShow, District, Townscript, KonfHub, 10times, Explara, Luma)

Plus a **generic method** — schema.org / JSON-LD parsing — which works on *any* permissive page that embeds Event markup, but requires us to supply the page URLs (there is no master directory).

---

## 2. The real gating factor — App Store compliance (the make-or-break)

Before data sourcing, the bigger risk is **Apple Guideline 4.2.2**: apps that are "primarily… content aggregators, or a collection of links" get rejected. A "list event → tap → bounce out" app is exactly that pattern.

**Good news:** it passes **if built as a native discovery product**, which is how Upshot is built. Redirect-to-pay is explicitly fine (Apple *requires* non-IAP under 3.1.3(e) for services consumed outside the app — event tickets qualify).

To stay approvable, Upshot must keep being:

- **Native search across all sources at once** + rich **filters** (city, date, category, price, free/paid, online/offline) ✓
- **Personalization** (interests, "near me" via city, recommendations) ✓ (Profile.city + ranking engine)
- **Saved / applied events, reminders, notifications** — partly (Applied); add saved/reminders
- **One de-duplicated, normalized catalog** across sources — the cross-platform value no single site gives
- **Native event detail pages** with our own metadata ✓
- The outbound link is the **last action**, not the whole app ✓

**Apple 5.2.2 (the sleeper):** if you show third-party content you must be permitted under their terms, and "authorization must be provided upon request." → prefer **official APIs / partnerships**, and keep proof of permission per source.

**IP hygiene (Apple 5.2.1 / Play IP & Impersonation):** third-party brand names as **plain factual text only** ("Register on BookMyShow"); **no third-party logos/images**; no brand names in Upshot's app name/icon/keywords; never imply partnership. A disclaimer does **not** cure impersonation.

**Google Play:** lower bar than Apple (a data-rich interactive catalog clears min-functionality), but acts on logo/brand-name IP complaints.

---

## 3. Platform-by-platform matrix

**Access legend:** 🟢 free open API · 🔑 free but needs key/approval · 💰 paid · 🤝 partnership-only (no public API) · ⚠️ unofficial/ToS-risk · 🧩 generic method (schema.org)

### General / entertainment / ticketing

| Platform | Access | India coverage | Notes |
|---|---|---|---|
| **Ticketmaster** | 🔑 free Discovery API (5k calls/day) | ⚠️ thin — must test | Engine already built; just needs the key. Covers concerts/sports/theatre, incl. TicketWeb/Universe. |
| **SeatGeek** | 🔑 free `client_id` | ❌ US/Canada focus | Near-useless for India; good only if you want US inventory. Redirect-to-book only. |
| **Eventbrite** | 🤝 own-org only | — | Public event-search API **retired** (2019–2020). API now only returns *your own* org's events. |
| **BookMyShow** | 🤝 none (affiliate via EarnKaro) | ✓ strong | Partnership for a feed. |
| **District** (Zomato; absorbed Paytm Insider) | 🤝 none, restrictive | ✓ strong | No public API; feed is **IP-restricted to India**; scraping banned. Business-team deal. |
| **AllEvents.in** | 🤝 none, **ToS bans scraping** | ✓ very strong | Closest model match → **partnership/affiliate target (do NOT scrape).** |
| **10times** | 🤝 none | ✓ trade shows | Partnership. |

### Students / hackathons (our strongest free segment)

| Platform | Access | Notes |
|---|---|---|
| **Devpost** | 🟢 public JSON (`devpost.com/api/hackathons`) | Global + some India hackathons. **Free, connectable today.** |
| **Kaggle** | 🟢 free token API | Online data-science competitions. **Free, connectable today.** |
| **Unstop** (ex-Dare2Compete) | ⚠️ undocumented public JSON endpoint | India's biggest student/hackathon platform (~20M+ users). Works, but ToS/robots unconfirmed — don't make it load-bearing; email to legitimize. |
| **MLH / Devfolio / HackerEarth / Commudle / Hack2Skill** | 🤝 / ⚠️ | No official public API; only unofficial scrapers. Partnerships or risk. |

### Professional / community

| Platform | Access | Notes |
|---|---|---|
| **Meetup** | 💰 GraphQL, **Pro-gated (~$55/group/mo)** | Good India community + women/hobby coverage; OAuth 2.0; no free tier anymore. |
| **Luma (lu.ma)** | 🤝 no public search API | Organiser-calendars only. |
| **KonfHub / Explara / Townscript** | 🤝 own-events APIs / none | Via organiser partnerships. |

### Music

| Platform | Access | Notes |
|---|---|---|
| **Bandsintown** | 🔑 gated — **written consent required** | Read-only event data; per-artist keys; companies submit an access request. No public/self-serve key. |
| **Songkick** | ⚠️ API key, status unverified | Concert listings. |

### Homemaker / hobby / women

Fragmented; mostly *courses*, not datable events (Hunar Online, Alippo, Madcap Workshops, BitClass). The only machine-readable sources here are **Meetup groups** (paid), **AllEvents categories** (partnership), and **city/community calendars** that embed schema.org markup. **No dedicated API exists for this segment.**

### Generic method — schema.org / JSON-LD / sitemaps

- 🧩 Works on **any** page that publishes `<script type="application/ld+json">` with `@type: Event` (common, because sites add it for Google's event search / SEO).
- **It is a reader, not a source** — it parses whatever URLs we point it at. There is no master list, so we curate a shortlist of permissive India event pages (or crawl a site's sitemap for event pages). This is why it returns nothing until URLs are configured.
- Reference implementation: open-source "JSON-LD Events Radar" does exactly this from a hand-curated target list.
- Must: validate each page has `Event` markup (Google Rich Results Test), exclude ToS-banning sites, paraphrase descriptions, no logos/images.

---

## 4. What we can do **for free** right now

| Action | Needs | Segment it fills |
|---|---|---|
| **Devpost adapter** | nothing (public JSON) | Hackathons (students/tech) |
| **Kaggle adapter** | free API token | Data-science competitions |
| **Ticketmaster** | free key (pending account approval) | Concerts/sports — *test India coverage first* |
| **schema.org feeds** | a shortlist of permissive India event-page URLs | Any — depends on the pages chosen |
| **Unstop** (optional) | nothing, but ToS-risk | Students/hackathons (India) — add with caveat |

Everything else (the broad India consumer-event breadth) requires **partnerships** or **Meetup Pro (paid)**.

---

## 5. Legal summary (India) — the safe pattern

- **Facts aren't copyrightable** (*EBC v. Modak* killed "sweat of the brow"); copying organiser **prose verbatim is infringement** → **paraphrase into our own factual summary.**
- **No sui-generis database right in India** (unlike EU) — listing unoriginal facts has no DB-right claim.
- **IT Act s.43/66 + DPDP 2023**: unsettled for open pages; **circumventing blocks / IP-rotation is the risky pattern** (note District IP-restricts to India).
- **Deep-linking out is defensible; framing/embedding is risky.** ToS that ban scraping are an **independent contract claim** regardless of copyright. Confirmed scraping bans: **Eventbrite, AllEvents.in (strongest), Luma, Ticketmaster, District.**
- **Safe pattern:** thin facts only · paraphrase, never copy descriptions · no logos/images · attribute source · prefer official APIs · redirect out, don't frame · honour robots.txt, never circumvent blocks · provide a takedown flow. **Residual risk it does NOT cure: ToS/contract breach on no-automated-access platforms → need an API or a deal.**

---

## 6. What's built today

- **Ingestion Edge Function** (`supabase/functions/ingest-events`) deployed to production, secured (cron-secret + admin-JWT), with a **daily cron** (03:00) active. Two adapters: **Ticketmaster Discovery API** and a generic **schema.org JSON-LD** parser.
- **Admin "Event Sources" screen** — enable/disable a source, set cities, "Sync now".
- **Data model** — external events stored as normal rows (`is_external`, `source`, `source_url`), flow through the same ranking + admin tools; registration redirects to `source_url`.
- **Status:** both sources seeded **disabled**; Ticketmaster has **no key yet**; schema.org has **no URLs yet** → the daily run is a safe no-op until a source is turned on. (Verified end-to-end with a test feed: the parser and app rendering both work.)

---

## 7. Recommended roadmap

- **Phase 1 — free MVP (now):** add **Devpost + Kaggle** adapters (connect today); enable **Ticketmaster** when the key lands (test India coverage); optionally **Unstop** with a caveat; wire **schema.org** to a shortlist of permissive India event pages.
- **Phase 2 — partnerships (the real India breadth):** email **AllEvents.in, BookMyShow, District, Townscript, 10times, Unstop** for official feeds/affiliate; consider **Meetup Pro** if community/women/hobby events matter.
- **Phase 3 — harden for compliance:** paraphrase/shorten external descriptions, no third-party logos/images, admin takedown on external events, "saved events" + reminders, standing App Review Notes doc. Indian IP/tech lawyer reviews each source's ToS.

### Needs a decision / external action
- **Partnership:** AllEvents.in, BookMyShow, District, Townscript, 10times, Unstop, Explara.
- **Paid:** Meetup Pro, Bandsintown (consent).
- **Free (token/approval):** Ticketmaster (key), Kaggle (token), Devpost (none).

### Key uncertainties to re-verify near build
JSON-LD presence per target page · Ticketmaster India coverage · Unstop endpoint ToS/robots · exact ToS wording for BMS/District/10times · DPDP "publicly available" exemption · store policies (change fast).

---

## 8. Sources

- Ticketmaster Discovery (free API): https://freeapihub.com/apis/ticketmaster-discovery
- Eventbrite public search retired: https://github.com/Automattic/eventbrite-api/issues/83
- SeatGeek API (free client_id, US/Canada): https://seatgeek.github.io/
- Bandsintown API terms (written consent): https://corp.bandsintown.com/termsprivacy
- Meetup GraphQL (Pro-gated): https://github.com/api-evangelist/meetup
- India aggregators / District & AllEvents no public API: https://github.com/championswimmer/india-aggregator-list/blob/master/AGGREGATORS.md
- EventLayer (aggregates Luma/Meetup/Devfolio/Unstop/Devpost): https://github.com/RudraMalvankar/EventLayer
- JSON-LD Events Radar (schema.org reader reference): https://github.com/nursatechstudio/jsonld-events-radar
