---
version: 1
slug: "app-app-problems-id-page-tsx"
primary_target: "app/(app)/problems/[id]/page.tsx"
related_targets: ["components/journals/journal-form.tsx","components/problems/problem-form.tsx"]
---

# Problem detail

## Scope & mode
Operate. Route: `/problems/[id]` (`app/(app)/problems/[id]/page.tsx`, `components/journals/journal-form.tsx`, problem form as used here). Confirm which problem this is, then write or revise the own-words journal.

## Audience & job
A signed-in developer opening a logged problem. Success: I know the problem, then I write. The journal is the learning resource; metadata is admin.

## Direction
Journal Board on this page: clipboard is the problem, notebook is the journal. Always stacked, every breakpoint: rail clipboard (identity + collapsed Edit problem) → lane-board notebook (optional solution paste above own-words fields, complexity as a pair, Save Journal as a trailing stamp — not a twin of Save changes) → delete.

## Must keep
- Journal fields including optional My Solution code paste above My Approach, labels, save/upsert, no autosave
- Existing ProblemForm inside a collapsed disclosure
- App shell, list, add-problem form
- Sharp seams, Barlow pair, three-lane accents, Rail Ink Rule

## Must not ship
- Twin rail cards for journal and edit
- Tabs, second route, LeetCode mimic, ruled-notebook wallpaper
- Cloning the problem form onto the journal
- Autosave

## Memorable moment
Clipboard vs notebook: problem identity on rail, writing on the charcoal well.
