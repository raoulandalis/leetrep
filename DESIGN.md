---
name: LeetRep
description: Journal Board — desk/notebook field, off-white clipboard rail, emerald accents.
colors:
  asphalt: "#0f1720"
  rail: "#f4f1ec"
  lane: "#36d9a0"
  signal: "#ff5a1f"
  cobalt: "#3d7eff"
  lane-pit: "#1a2330"
  lane-board: "#121a24"
  steel-seam: "#2a3544"
  track-mist: "#9aa3ad"
  field-input: "#d9d4cc"
  destructive: "oklch(0.6 0.22 25)"
typography:
  display:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.025em"
  body:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Barlow Condensed, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.16em"
rounded:
  none: "0px"
  sm: "0.21rem"
  md: "0.28rem"
  lg: "0.35rem"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.lane}"
    textColor: "{colors.asphalt}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "#2bc48e"
    textColor: "{colors.asphalt}"
    rounded: "{rounded.none}"
  button-tab-active:
    backgroundColor: "{colors.asphalt}"
    textColor: "{colors.rail}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "40px"
  button-tab-idle:
    backgroundColor: "transparent"
    textColor: "#0f1720a6"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "40px"
  input-field:
    backgroundColor: "#ffffff"
    textColor: "{colors.asphalt}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 12px 0 40px"
    height: "44px"
  chip-rep-lane:
    backgroundColor: "#36d9a026"
    textColor: "{colors.lane}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  chip-rep-signal:
    backgroundColor: "#ff5a1f26"
    textColor: "{colors.signal}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  chip-rep-cobalt:
    backgroundColor: "#3d7eff26"
    textColor: "{colors.cobalt}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  card-reps-strip:
    backgroundColor: "#0f1720bf"
    textColor: "{colors.rail}"
    rounded: "{rounded.none}"
    padding: "16px"
  surface-rail:
    backgroundColor: "{colors.rail}"
    textColor: "{colors.asphalt}"
    rounded: "{rounded.none}"
---

# Design System: LeetRep

## Overview

**Creative North Star: "Journal Board"**

LeetRep’s visual system is a study desk / journal board beside a clipboard rail: quiet charcoal field with soft depth (no ruled/grid wallpaper), off-white auth panel, and emerald / orange / cobalt accents. Type is condensed and uppercase where the program speaks — headlines, step titles, labels, CTAs — while body copy stays in a readable sans for explanation. Edges stay sharp; hairline seams do the structure work — no track paint, asphalt photos, or starting-block chrome.

The palette is high-contrast and sleek without looking like LeetCode: electric emerald is the primary action/signal, orange and cobalt are secondary markers, never a purple glow theme or highlighter-yellow neon. Depth comes from tonal layering and light borders — not floating cards or multi-layer glows.

**Key Characteristics:**
- Notebook field + clipboard rail split; auth lives on the rail
- Quiet charcoal depth only — no ruled lines or grid wallpaper
- Wordmark: `Leet` in rail / white, `Rep` in emerald italic
- Condensed program type for display, titles, labels, CTAs
- Sharp edges (`0` radius) on signature surfaces
- Three-accent cycle: emerald → orange → cobalt
- Loop steps as a straight vertical stamped list; Today's Reps shown as a framed browser/dashboard screenshot preview (labeled synthetic) beside the steps on desktop

## Colors

Athletic charcoal notebook field with an off-white clipboard rail and three accent signals; accents stay rare and coded to meaning.

### Primary
- **Lane Emerald** (`{colors.lane}`): Primary action, ring, wordmark “Rep,” display emphasis, and checklist accents. Ink on emerald is asphalt.

### Secondary
- **Signal Orange** (`{colors.signal}`): Alternating loop-step fill and Re-solve chip accent. White ink on solid fills.

### Tertiary
- **Cobalt Lane** (`{colors.cobalt}`): Third lane accent for Recall/step variety; white ink on solid fills.

### Neutral
- **Asphalt Charcoal** (`{colors.asphalt}`): Desk/notebook field background, dark text on rail, active tab fill.
- **Rail Off-White** (`{colors.rail}`): Auth clipboard column, light text on field, wordmark “Leet.”
- **Lane Pit** (`{colors.lane-pit}`): Raised mute / secondary surface on the field.
- **Lane Board** (`{colors.lane-board}`): Checklist well behind Today's Reps.
- **Steel Seam** (`{colors.steel-seam}`): Borders and structural seams on dark surfaces.
- **Track Mist** (`{colors.track-mist}`): Muted foreground / tertiary labels on the field.
- **Field Input** (`{colors.field-input}`): Token for form field borders/inputs in the theme map.
- **Destructive** (`{colors.destructive}`): Form error text only.

### Named Rules
**The Three-Lane Rule.** Emerald, orange, and cobalt rotate as lane markers (steps, chips, chart roles). Do not invent a fourth accent hue for status.

**The Rail Ink Rule.** On asphalt, text is rail (or rail at opacity). On rail, text is asphalt. Emerald never becomes body copy color.

## Typography

**Display Font:** Barlow Condensed (with ui-sans-serif / system-ui)
**Body Font:** Barlow (with ui-sans-serif / system-ui)

**Character:** Meet-program condensed for the board voice — tight tracking, extrabold, often uppercase — paired with a straight athletic sans for sentences.

### Hierarchy
- **Display** (800, `clamp(2.5rem, 7vw, 4.75rem)`, line-height `0.92`, uppercase): Hero thesis on the journal field.
- **Headline** (800, `1.875rem` / `text-3xl`, tight tracking, uppercase): Auth titles and compact board headings.
- **Title** (700, `1.125rem`, wide tracking, uppercase): Loop step names and checklist headers.
- **Body** (400, `1rem`–`1.125rem`, relaxed): Supporting sentences; keep ~`max-w-md` / ~`max-w-xl` on the field.
- **Label** (700, `0.75rem`, `0.16em` tracking, uppercase): Field labels, chips, meta tags, CTA lettering (CTA bumps size to `1rem` with `0.12em` tracking).

### Named Rules
**The Lane Board Wordmark Rule.** Product mark is always `Leet` + `Rep`: rail/off-white upright for Leet, emerald italic for Rep, both extrabold condensed. Never recolor, never stack as a logo lockup with a glyph.

**The Program Case Rule.** Display, titles, labels, and primary CTAs speak in uppercase condensed. Body sentences stay sentence case in Barlow.

## Layout

Desktop is a Meet Program split: journal column ~`1.15fr` with ruled notebook field; auth clipboard rail ~`0.85fr` with `min` width ~`22rem`, full viewport height. Field padding steps `24px` → `40px` → `56px` horizontally and `32px` → `40px` → `48px` vertically. Vertical rhythm stacks wordmark → thesis → stamped loop → Today’s Reps checklist with `40px` gaps. Auth form centers in the rail at `max-w-sm` with `24px` field stack gaps. Below `lg`, columns stack: journal then rail.

## Elevation & Depth

Tonal layering first (ruled notebook field, checklist well `#121a24`), with light hairline borders — not card stacks, steel strips, or photo asphalt.

### Shadow Vocabulary
- **Strip settle** (optional soft shadow on checklist): restrained; prefer borders over lift.
- **Start-block CTA** (`box-shadow: 0 10px 24px rgb(15 23 32 / 28%)`): Primary emerald submit.

### Named Rules
**The Steel-Not-Float Rule.** Depth is seams and tonal wells. No multi-layer neon glows, glassmorphism stacks, hard offset sticker shadows, or track/asphalt chrome.

## Shapes

Form language is sharp: signature controls use `0` radius. Base theme `--radius` (`0.35rem`) remains for generic shadcn shells not yet restyled. Borders are hairline seams. Recurring silhouettes: square ~`2.5rem` stamp markers, empty checkbox ticks on the due list, dashed checklist dividers.

### Named Rules
**The Sharp Start Rule.** Primary CTAs, tabs, inputs, chips, and checklist rows are square (`rounded-none`). Soft corners are scaffolding debt, not the world.

## Components

### Buttons
- **Shape:** Sharp (`0`)
- **Primary:** Full-width — lane fill, asphalt ink, condensed uppercase, height `48px`, soft CTA shadow; hover lane at ~90% opacity; active `translateY(1px)`
- **Hover / Focus:** Soften lane fill; focus rings use lane at reduced alpha on fields (`ring-lane/60`)
- **Tab pair:** Two-up mode switch in a pit (`asphalt/5` well, `asphalt/15` border); active tab asphalt fill + rail text

### Chips
- **Style:** Condensed uppercase kind tags — tinted lane/signal/cobalt at ~15% fill + solid accent text; no border radius
- **State:** Meaning-coded (Recall ↔ lane or cobalt; Re-solve ↔ signal)

### Cards / Containers
- **Corner Style:** Sharp
- **Today's Reps demo:** Framed as an in-app / browser screenshot beside the step list on desktop (stacks under steps on mobile). Caption: “Dashboard preview · synthetic.” Chrome: window dots + URL (`leetrep.app/dashboard`). Inner pane shows Today's Reps with demo data. Soft low-opacity emerald/rail back-glow (blurred spotlight) behind the frame only — product-shot depth, not neon UI chrome. Slight desktop tilt optional for “preview” read; not live UI.
- **Landing containers:** Open stamped steps + one framed product preview — avoid extra widgets.

### Inputs / Fields
- **Style:** White field, asphalt text, `asphalt/20` border, height `44px`, square; optional leading glyph slot with `40px` left padding
- **Focus:** Border asphalt + `2px` lane ring at 60%
- **Error / Disabled:** Destructive text for errors; disabled CTA at 50% opacity

### Navigation
- Landing has no global nav — the wordmark is identity only. Auth mode tabs are the only local navigation pattern.

### Wordmark
Condensed extrabold mark at `text-3xl`–`text-4xl`: upright rail “Leet” + italic lane “Rep.” Appears once at the top of the journal column.

### Loop Step Stamp
Square icon stamps in a straight vertical list (no staircase indent); fill cycles lane → signal → cobalt → lane → signal. No ruled wallpaper, vertical spine, or track markers.

## Do's and Don'ts

### Do:
- **Do** keep the Meet Program split: journal field (loop + checklist) beside a full-height clipboard rail for auth.
- **Do** use Barlow Condensed uppercase for program voice and Barlow for body sentences.
- **Do** cycle only emerald / orange / cobalt for accent meaning.
- **Do** keep signature controls sharp (`0` radius) with hairline seams.

### Don't:
- **Don't** mimic LeetCode’s brand colors, logo treatment, or problem-list chrome.
- **Don't** introduce purple glows, soft pill clusters, or rounded marketing cards on the field.
- **Don't** replace the wordmark with a glyph logo or monochrome lockup.
- **Don't** use track paint, asphalt photography, starting-block steel edges, race-lane labels, or ruled/grid notebook wallpaper.
- **Don't** put secondary marketing blocks (stats strips, promo chips) into the first viewport beyond the step list and one Today's Reps demo panel.
