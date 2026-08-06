# CENG

> UI/UX design portfolio for Roblox experiences — one long scrolling page, dark by default.

## Brand Identity

- **Personality:** Refined and minimal. Quiet confidence rather than loud. The site should feel like it was made by someone who cares about spacing.
- **Colours:** Monochrome only — there is deliberately **no accent colour**. Emphasis comes from contrast instead (a white button on black, a black button on white). Dark mode is near-black `#0a0a0a`, light mode is off-white `#fbfbfa`. Pure black and pure white are avoided because they feel harsh.
- **Fonts:** **Geist** for everything you read, **Geist Mono** for the small uppercase labels (the `01`, `SELECTED WORK`, `ROLE` type). Both load from Google Fonts.
- **Texture:** A very faint film grain sits over the whole page, and a faint square grid sits behind the hero. These replace the usual glowing gradient blobs.

## Where Everything Lives

This project was rebuilt on **Next.js**, so the file names changed. Only these four are live:

| What it is | The live file | Old name (no longer used) |
|---|---|---|
| The page content | `app/page.tsx` | ~~`index.html`~~ |
| All the styling | `app/globals.css` | ~~`styles.css`~~ |
| All the movement | `public/script.js` | ~~`script.js`~~ (root) |
| Your images | `public/images/` | ~~`images/`~~ (deleted) |

**This matters.** There are still old copies of `index.html`, `styles.css` and `script.js` sitting in the main project folder. They are leftovers from the first version of the site and **nothing reads them** — editing them changes nothing. If something you edit has no effect, check you're in the right file.

## Pages

- **Main page** (`app/page.tsx`) — the whole site. In order top to bottom:
  1. **Top bar** — your name, the menu, the dark/light switch, and a "Start a project" button
  2. **Opening** — the big headline, your intro, two buttons, and a strip of quick facts
  3. **Selected work** — six projects, filterable by type (All / HUD / Menus / Shop / Systems)
  4. **About** — your photo and three paragraphs, plus a list of what you do
  5. **Process** — four numbered steps from brief to handoff
  6. **Toolkit** — the slow-scrolling row of tool names
  7. **Questions** — six expandable FAQs
  8. **Contact** — your Discord and X links
  9. **Footer**

## What Still Needs Your Input

Three things are placeholders right now. Nothing is broken — they're just clearly marked so you know what to swap.

1. **Your contact links.** In `app/page.tsx`, search for `data-placeholder`. There are two link rows near the bottom — Discord and X. Replace `add-your-username` / `@add-your-handle` with the real thing, put the real URL in the `href="#"`, and delete the `data-placeholder="..."` bit. Deleting that attribute removes the little grey "PLACEHOLDER" tag next to it.

2. **Your work images.** The seven files in **`public/images/`** are hand-drawn wireframe placeholders. Replace them with screenshots of your real work — **drop new files straight into `public/images/`**. Keep the same filenames (`work-01.svg` … `work-06.svg`, `portrait.svg`) or update the `src="..."` in `app/page.tsx` if you use `.png` or `.jpg` instead. Sizes that fit: `work-01` is widescreen (16:9), the rest are 4:3, the portrait is tall (4:5).

   **Formats:** PNG for UI screenshots (keeps text crisp), JPG for photos, SVG for logos. Watch the file size — exports straight out of Figma or Photoshop are often 5–10MB each, which makes the site genuinely slow for real visitors. Anything over about 500KB is worth compressing.

3. **Your project names.** The six projects (Nightfall, Ember, Tidebreak, Ironworks, Aviary, Relay) are stand-ins. Rename them in `app/page.tsx`. If you change a project's category, update two things so the filter counts stay honest: the `data-cat="..."` on the project, and the number inside the matching filter button.

## Motion

All the movement is controlled from one place: the `MOTION` block at the top of `public/script.js`. Change a number, save, refresh.

```js
smoothScroll: true,   // eased page scrolling
parallax:     true,   // images and headings drift as you scroll
magnetic:     true,   // buttons lean toward your cursor
scrollEase:   0.22,   // higher = snappier, lower = floatier
staggerStep:  85,     // gap between items in a group
wordStep:     55      // gap between words in a heading
```

**What actually moves:**

- **Smooth scrolling** — the page eases toward where you scrolled instead of jumping. It moves the real scroll position, so the sticky bar, the progress line and browser find-on-page all still behave. Off automatically on phones and tablets, where native scrolling is better.
- **Word-by-word headings** — headings marked `data-split` get chopped into words that rise out from behind a mask, 55ms apart. To animate a new heading, add `data-split` to it.
- **Staggered groups** — a container marked `data-stagger="90"` deals out increasing delays to its children, so lists cascade rather than landing as a slab. The number is the gap in milliseconds.
- **Parallax** — anything marked `data-parallax="0.07"` drifts as it crosses the screen. Bigger number = more drift; a negative number sends it the other way. The project images alternate direction, which is why the grid feels less rigid.
- **Magnetic buttons** — anything with `class="magnetic"` leans toward your cursor and springs back.
- **De-blur on entry** — things fade in from 34px below while sharpening from a 6px blur. The blur is doing most of the work; it's what makes movement read as expensive rather than cheap.

**If it's too much:** set `parallax: false` and `magnetic: false`. If scrolling still feels heavy, raise `scrollEase` further (`0.3` is quite snappy), or set `smoothScroll: false` to hand scrolling back to the browser entirely — that is the single biggest thing you can do for responsiveness.

**Two safety nets:**

- Anyone with "reduce motion" enabled in their system settings gets a still version — no drift, no blur, no scroll easing, just a gentle fade. This is deliberate and automatic.
- If JavaScript fails to load, the page renders as ordinary fully-visible content rather than staying blank. Every hiding rule in the stylesheet is scoped behind a `.js` class that only exists once JavaScript has run.

## How to Customize

- **Change colours:** open `app/globals.css` and edit section 2 near the top. Dark mode and light mode are two separate lists — edit both.
- **Change fonts:** swap the Google Fonts link in `app/layout.tsx`, then update `--font` and `--mono` in section 3 of `app/globals.css`.
- **Add a project:** copy one of the `<article className="card">` blocks in `app/page.tsx`, change the image, title, number and `data-cat`.
- **Change how much things move:** every animation uses the same easing curve, `--ease`, in section 3 of `app/globals.css`.
- **Turn off an animation entirely:** delete the `data-reveal` attribute from whichever element in `app/page.tsx`.

## Notes

- The dark/light choice is remembered in the visitor's browser. First-time visitors get dark unless their computer is set to light mode.
- Anyone who has "reduce motion" turned on in their system settings sees the site with all animation switched off. This is intentional and handled automatically.
- There are **no testimonials on the site**. Real quotes from real clients are worth adding later — invented ones would not be.

## Recent Changes

- **2026-08-06 (fifth pass — tidying):** Deleted the leftover `images/` folder from the main project folder. It held seven files that were byte-for-byte identical to the ones in `public/images/`, and nothing on the site read them — but having two folders with the same name and the same contents was a trap waiting to happen. `public/images/` is now the only place images live. (The deleted folder went to the Trash, not permanently erased.)

- **2026-08-06 (fourth pass — speed):** The preview felt laggy. Four causes, all fixed:
  1. **Scrolling was too floaty.** The page eases toward where you scrolled, but at 11% per frame it trailed noticeably behind the trackpad. Raised to 22% — still a glide, but it keeps up with you now.
  2. **The animation loop never stopped.** It was recalculating parallax, buttons and the progress bar 60+ times a second forever, even with the page sitting completely still. It now goes to sleep once everything has settled and wakes on scroll, pointer movement or a window resize.
  3. **The frosted nav bar was expensive.** Blur was being animated from 0 to 14px every time you crossed the top of the page, which forces the browser to redraw the blur at every intermediate step. The blur now snaps on instead of animating, and it's 10px rather than 14px with a slightly more solid background to compensate — visually near-identical, much cheaper.
  4. **The toolkit marquee never stopped scrolling**, even when far off screen. It now pauses when it isn't visible.

  Some remaining slowness is just the preview: it runs in development mode, which is genuinely slower than the published site will be.

- **2026-08-06 (third pass — bug fixes):** The smooth scrolling genuinely wasn't working. Three faults: the code couldn't tell its own scrolling apart from yours, so it cancelled its own easing every frame; the image drift was being fought by a CSS transition that stretched each frame's movement over a full second; and the drift was measuring itself, feeding its own position back into the next calculation. Also found that the drift could slide an image off its own frame and show a gap on tall screens, so the movement is now capped to whatever room the image actually has.

- **2026-08-06 (second pass):** The first version's animation was too timid — 14px of movement, firing once, with nothing happening while you scrolled. Rebuilt it: added eased smooth scrolling, scroll-linked parallax on the images and hero grid, word-by-word heading reveals, automatic staggering so groups cascade, magnetic buttons, and a blur-to-sharp entrance. Travel went from 14px to 34px. Also added the no-JavaScript safety net.

- **2026-08-06:** Built the whole site from scratch. Replaced the starter template with a single scrolling page: hero, filterable work grid, about, process, toolkit marquee, FAQ accordion, and contact. Added the dark/light switch, scroll-reveal animations, the mobile menu, and seven placeholder images. Removed the starter `about.html` since everything now lives on one page.
