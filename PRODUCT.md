# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Software developers who solve LeetCode problems and want to retain what they learned. Primary situations are **both equally**: interview prep (finite window, high pressure) and ongoing skill maintenance after grinding.

## Product Purpose

LeetRep helps developers keep LeetCode knowledge durable through structured repetition and active recall. A developer solves a problem once, documents how they solved it and what they learned, and LeetRep brings that problem back at spaced intervals so they can recall or re-solve it. Success means problems return as intentional “reps,” not as a passive archive of completed problems.

## Positioning

Not another completed-problem list or LeetCode clone. The mechanism is own-words journaling plus deterministic spaced review with two rep types — **Recall** (explain the approach before revealing notes) and **Re-solve** (return to the original LeetCode problem). V1 is fully functional without any LLM integration; AI is a later enhancement, not the product.

## Operating Context

Core loop: solve on LeetCode → add the problem to LeetRep → write a journal → time passes → complete today’s reps (recall or re-solve) → next review is scheduled. Primary authenticated surfaces: Dashboard (“Today’s Reps”), Problems library, Progress, Settings. Users open original LeetCode URLs from the app; V1 does not scrape LeetCode or verify that a re-solve actually happened on LeetCode.

## Capabilities and Constraints

- Stack: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui with Base UI, Supabase (Postgres, Auth, RLS), Google OAuth, Vercel deploy.
- Auth: Google sign-in; users only access their own data.
- Problems are user-entered (URL, title, difficulty, patterns, date completed) — no LeetCode API/scraping in V1.
- Journals capture approach, insight, why it works, complexity, struggles, notes — in the user’s own words.
- Spaced schedule (V1): Day 0 entry, then reviews at Day 1, 3, 7, 14, 30.
- Progress: simple counts/streaks by difficulty and pattern; no complex charts required for V1.
- Undecided: accessibility standard (none specified yet).

## Brand Commitments

- Product name: **LeetRep**.
- Must not look like LeetCode.
- Prefer a sleek interface with some popping colors (binding preference; visual system still to be designed separately).

## Evidence on Hand

Product and build specs in `docs/v1-prd.md` and `docs/prds/`. No customer testimonials, press, or marketing proof assets yet — future work must not fabricate them.

## Product Principles

1. **Reps over archives** — “Today’s Reps” is the center of gravity, not a backlog of completed problems.
2. **Own words before answers** — journals and recall force explanation; storing solutions alone is failure.
3. **Deterministic V1** — simple, trustworthy scheduling beats opaque AI until the loop is proven.
4. **LeetCode is the gym; LeetRep is the coach** — deep-link out for solving; own the retention loop in-app.
5. **Distinct from LeetCode’s brand** — familiar to developers, visually its own product.
