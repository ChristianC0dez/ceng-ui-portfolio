/*
  Every project on the site, in one place.

  The home page grid and the individual project pages both read from this
  list, so there is only ever one copy of a title, a year or an image path.
  Add a project here and it appears in both places automatically.

  `slug` becomes the web address: slug 'nightfall' -> /work/nightfall
  Keep it lowercase with dashes instead of spaces.

  NOTE: the descriptions below are placeholders written around the sample
  wireframes. Replace them with the real story of each job.
*/

export type Project = {
  slug: string
  index: string
  title: string
  tag: string
  year: string
  cat: string
  image: string
  width: number
  height: number
  alt: string
  parallax: string

  /** One line under the title on the project page */
  summary: string
  /** The brief description under the image. One string per paragraph. */
  body: string[]
  /** The small facts table */
  facts: { k: string; v: string }[]
}

export const projects: Project[] = [
  {
    slug: 'nightfall',
    index: '01',
    title: 'Nightfall',
    tag: 'Full UI system',
    year: '2026',
    cat: 'systems',
    image: '/images/work-01.svg',
    width: 1600,
    height: 900,
    alt: 'Wireframe preview of the Nightfall full UI system',
    parallax: '0.05',
    summary: 'A complete interface language for a survival game — 40 screens from one set of rules.',
    body: [
      'Nightfall came in with eleven screens built by four different people, none of which agreed on spacing, button size or what a warning looked like. The first job was not designing anything new — it was writing down the rules the game already half-followed, then applying them consistently.',
      'The system runs on an 8px grid with three panel weights and exactly two button styles. Once those were fixed, the remaining twenty-nine screens took less time together than the first eleven had taken separately.',
      'Everything ships as named Figma components with sliced 9-slice panels, so the team can build a new screen without asking me what a dialog is supposed to look like.',
    ],
    facts: [
      { k: 'Scope', v: '40 screens, full system' },
      { k: 'Duration', v: '6 weeks' },
      { k: 'Delivered', v: 'Figma library, sliced exports, spec doc' },
    ],
  },
  {
    slug: 'ember',
    index: '02',
    title: 'Ember',
    tag: 'Combat HUD',
    year: '2026',
    cat: 'hud',
    image: '/images/work-02.svg',
    width: 1200,
    height: 900,
    alt: 'Wireframe preview of the Ember combat HUD',
    parallax: '0.05',
    summary: 'A combat readout you can parse without looking directly at it.',
    body: [
      'Fighting games live or die on peripheral vision. Ember’s original HUD put health, cooldowns and ammo in three corners, which meant checking any of them cost a moment of not watching the fight.',
      'The rebuild groups everything time-critical into one lower band, with state carried by shape and position rather than colour alone — so it still reads for players who cannot separate red from green, and at the low contrast of a dark map.',
      'Cooldowns use a sweep rather than a number. You stop reading it and start feeling it, which is the point.',
    ],
    facts: [
      { k: 'Scope', v: 'Combat HUD, 6 states' },
      { k: 'Duration', v: '2 weeks' },
      { k: 'Delivered', v: 'Sliced PNGs, motion reference' },
    ],
  },
  {
    slug: 'tidebreak',
    index: '03',
    title: 'Tidebreak',
    tag: 'Main menu',
    year: '2025',
    cat: 'menus',
    image: '/images/work-03.svg',
    width: 1200,
    height: 900,
    alt: 'Wireframe preview of the Tidebreak main menu',
    parallax: '-0.05',
    summary: 'The first ten seconds of a game, treated like they matter.',
    body: [
      'Most Roblox menus are a stack of buttons over a screenshot. Tidebreak wanted the menu to establish the mood before the player has seen anything of the world.',
      'The layout holds the play button at a fixed optical centre while everything secondary sits on a column to the left, so the eye lands in the same place every launch. Settings, shop and party all open in place rather than replacing the screen.',
      'The entrance animation was storyboarded frame by frame and handed over as a reference video with easing values, so the scripter matched it without a dozen back-and-forths.',
    ],
    facts: [
      { k: 'Scope', v: 'Main menu, settings, party' },
      { k: 'Duration', v: '2 weeks' },
      { k: 'Delivered', v: 'Figma file, motion reference' },
    ],
  },
  {
    slug: 'ironworks',
    index: '04',
    title: 'Ironworks',
    tag: 'Shop & currency',
    year: '2025',
    cat: 'shop',
    image: '/images/work-04.svg',
    width: 1200,
    height: 900,
    alt: 'Wireframe preview of the Ironworks shop and currency screens',
    parallax: '0.05',
    summary: 'A shop that tells you what you are buying before you buy it.',
    body: [
      'The old shop showed an icon, a name and a price. Players were refunding items because what arrived was not what the 64px icon suggested.',
      'The rebuild gives every item a preview at the size it actually appears in game, plus its stats against whatever you have equipped right now. The comparison is the feature — the rest is layout.',
      'Two currencies sit in the header at all times, with the earned one always listed first. That ordering was deliberate and it is documented, because it is the sort of thing that quietly gets flipped in a later update.',
    ],
    facts: [
      { k: 'Scope', v: 'Shop, item detail, currency' },
      { k: 'Duration', v: '3 weeks' },
      { k: 'Delivered', v: 'Sliced exports, spec doc' },
    ],
  },
  {
    slug: 'aviary',
    index: '05',
    title: 'Aviary',
    tag: 'Inventory HUD',
    year: '2025',
    cat: 'hud',
    image: '/images/work-05.svg',
    width: 1200,
    height: 900,
    alt: 'Wireframe preview of the Aviary inventory HUD',
    parallax: '-0.05',
    summary: 'Sixty slots that do not feel like sixty slots.',
    body: [
      'Aviary lets players carry far more than a grid comfortably shows. The brief was to avoid pagination, which players had told the team felt like admin.',
      'The answer was grouping by type with sticky headers and a filter that narrows in place rather than reloading. Scrolling stays continuous, so the sense of how much you own is never interrupted.',
      'Every slot has an empty, filled, locked, equipped and new state. Those five states are where inventory screens usually fall apart, so they were designed first and the layout was built around them.',
    ],
    facts: [
      { k: 'Scope', v: 'Inventory, equip, sorting' },
      { k: 'Duration', v: '2 weeks' },
      { k: 'Delivered', v: 'Figma components, sliced exports' },
    ],
  },
  {
    slug: 'relay',
    index: '06',
    title: 'Relay',
    tag: 'Settings & onboarding',
    year: '2024',
    cat: 'menus',
    image: '/images/work-06.svg',
    width: 1200,
    height: 900,
    alt: 'Wireframe preview of the Relay settings and onboarding screens',
    parallax: '0.05',
    summary: 'The two screens nobody designs, designed properly.',
    body: [
      'Settings and first-run onboarding are usually whatever was left at the end of a project. Relay treated them as the brief.',
      'Onboarding asks three questions instead of nine, and each one visibly changes something on screen as it is answered, so the player can tell the choice mattered. Anything that can be inferred from the device is not asked at all.',
      'Settings groups by what a player is trying to fix — "I can’t see it", "It’s too loud", "It’s running badly" — rather than by which engine subsystem the toggle belongs to.',
    ],
    facts: [
      { k: 'Scope', v: 'Onboarding, settings, accessibility' },
      { k: 'Duration', v: '2 weeks' },
      { k: 'Delivered', v: 'Figma file, sliced exports' },
    ],
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

/** The next project in the list, wrapping round at the end. */
export function nextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}
