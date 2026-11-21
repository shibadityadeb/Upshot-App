import type { Event } from '@upshot/types';

/**
 * Rule-based recommendation scorer for the home "All Events" feed.
 *
 * This is the first, deterministic version of the recommendation engine: a
 * weighted sum over the signals we already have in the schema. It needs no new
 * tables and no model, and it is the baseline a learned ranker would later be
 * measured against. Every weight is a plain number here on purpose — tuning the
 * feed is editing this file, not retraining anything.
 *
 * Location is the one factor we cannot fully serve yet: `Profile` has no city,
 * so `userCity` is undefined for now and that term is skipped. When the profile
 * gains a city the term switches on with no other change.
 */
export interface RankContext {
  /** The viewer's city. Undefined until Profile gains a location field. */
  userCity?: string | null;
  /** category -> affinity in [0,1], derived from the viewer's past applications. */
  appliedCategoryWeights?: Record<string, number>;
  /** Injectable clock for tests. */
  now?: number;
}

type RankableEvent = Event & { application_count?: number };

export function scoreEvent(event: RankableEvent, ctx: RankContext = {}): number {
  const now = ctx.now ?? Date.now();
  let score = 0;

  // Urgency — sooner events rank higher, tapering to 0 past a 30-day horizon.
  const days = (new Date(event.event_date).getTime() - now) / 86_400_000;
  if (days >= 0) score += Math.max(0, 30 - days) * 1.5; // up to ~45

  // Popularity — real heads coming, plus how fast it's filling. A FULL event is
  // pushed down hard: the viewer can't actually register for it (they'd only be
  // waitlisted), so it shouldn't top a feed of events they can join.
  const heads = event.application_count ?? event.current_attendees ?? 0;
  score += Math.min(heads, 50) * 0.8; // social proof, up to 40
  if (event.max_attendees && event.max_attendees > 0) {
    const fill = heads / event.max_attendees;
    if (fill >= 1) score -= 60;   // full — deprioritise
    else score += fill * 20;      // still filling = hot
  }

  // Incentive — the coin reward is a built-in pull most feeds don't have.
  score += Math.min(event.coin_reward ?? 0, 500) / 10; // up to 50

  // Personal fit — categories the viewer has applied to before.
  if (ctx.appliedCategoryWeights && event.category) {
    score += (ctx.appliedCategoryWeights[event.category] ?? 0) * 40;
  }

  // Location — events in the viewer's city float up. Dormant until Profile.city.
  if (ctx.userCity && event.location) {
    if (event.location.toLowerCase().includes(ctx.userCity.toLowerCase())) score += 60;
  }

  // A real banner simply reads better in the feed.
  if (event.banner_url) score += 5;

  return score;
}

/** Returns a new array ordered by descending recommendation score. */
export function rankEvents<T extends RankableEvent>(events: T[], ctx: RankContext = {}): T[] {
  return events
    .map((event) => ({ event, score: scoreEvent(event, ctx) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.event);
}

/** Turns a list of a viewer's applied-event categories into [0,1] affinity weights. */
export function categoryWeightsFromApplications(categories: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of categories) {
    if (!c) continue;
    counts[c] = (counts[c] ?? 0) + 1;
  }
  const values = Object.values(counts);
  if (values.length === 0) return {};
  const max = Math.max(...values);
  const weights: Record<string, number> = {};
  for (const [k, v] of Object.entries(counts)) weights[k] = v / max;
  return weights;
}
