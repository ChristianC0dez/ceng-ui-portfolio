/*
  Every project on the site, in one place.

  The home page grid and the individual project pages both read from this
  list, so there is only ever one copy of a title, a tag or an image path.
  Add a project here and it appears in both places automatically.

  `slug` becomes the web address: slug 'skyfall-card-deck' -> /work/skyfall-card-deck
  Keep it lowercase with dashes instead of spaces.

  A NOTE ON THE WRITING
  The descriptions below describe what is actually visible in each screen —
  layout, hierarchy, states, how the panels are built. They do not claim
  timelines, budgets or client names, because those are yours to state and
  not mine to invent. If you want dates or client names on these pages, add
  them to `facts` and they will appear in the sidebar automatically.
*/

export type Project = {
  slug: string
  index: string
  /** The game the screen belongs to */
  title: string
  /** Which screen it is */
  tag: string
  cat: string
  image: string
  width: number
  height: number
  alt: string
  parallax: string

  /** One line under the title on the project page */
  summary: string
  /** The description under the image. One string per paragraph. */
  body: string[]
  /** The small facts table down the side */
  facts: { k: string; v: string }[]
}

export const projects: Project[] = [
  {
    slug: 'anime-conquerors-summon',
    index: '01',
    title: 'Anime Conquerors',
    tag: 'Summon banner',
    cat: 'systems',
    image: '/images/anime-conquerors-summon.jpg',
    width: 1920,
    height: 1080,
    alt: 'Anime Conquerors summon screen — three banner options on the left, featured mythic and secret units centre, and a mythic pity meter beneath',
    parallax: '0.05',
    summary: 'A gacha pull screen that answers the three questions every player asks before they spend.',
    body: [
      'A summon screen has to settle three things at a glance: what am I pulling on, what can I get, and how close am I to a guarantee. This layout gives each one its own zone — banners stack down the left, the featured units hold the centre at full character art, and the pity meter runs along the bottom where it reads as a progress bar rather than a statistic.',
      'Rarity is carried by colour and by label together — Mythic in violet, Secret in red — so it survives on a phone screen where the character art gets small. Both currencies sit in the header at all times, next to the button that tops them up.',
      'The x1 and x10 actions are weighted differently on purpose: green for the single pull, violet for the ten, so the bulk action reads as the committed one instead of being an identical button with a different number on it.',
    ],
    facts: [
      { k: 'Game', v: 'Anime Conquerors' },
      { k: 'Screen', v: 'Summon / gacha banner' },
      { k: 'Includes', v: 'Banner cards, pity meter, currency bar' },
    ],
  },
  {
    slug: 'anime-conquerors-units',
    index: '02',
    title: 'Anime Conquerors',
    tag: 'Unit collection',
    cat: 'systems',
    image: '/images/anime-conquerors-units.jpg',
    width: 1920,
    height: 1080,
    alt: 'Anime Conquerors units screen — a searchable grid of owned units on the left with a detailed stat panel for the selected unit on the right',
    parallax: '0.05',
    summary: 'A hundred and fifty units, browsable without ever leaving the screen.',
    body: [
      'Collection screens fall apart at scale. This one splits into a scrolling grid and a fixed detail panel, so picking a unit never replaces what you were looking at — the grid keeps its position and the panel to the right swaps.',
      'Every tile carries level, rarity and name in the same three positions, which is what makes a wall of a hundred and fifty of them scannable. Search and filter sit directly above the grid rather than behind a menu.',
      'The detail panel shows stats as segmented bars against their caps, not bare numbers. Seeing 100/200 as a half-filled row tells you more about whether a unit is worth upgrading than the figure alone does.',
    ],
    facts: [
      { k: 'Game', v: 'Anime Conquerors' },
      { k: 'Screen', v: 'Unit collection & detail' },
      { k: 'Includes', v: 'Grid tiles, stat panel, search & filter' },
    ],
  },
  {
    slug: 'anime-conquerors-inventory',
    index: '03',
    title: 'Anime Conquerors',
    tag: 'Inventory',
    cat: 'systems',
    image: '/images/anime-conquerors-inventory.jpg',
    width: 1920,
    height: 1080,
    alt: 'Anime Conquerors inventory screen — a grid of item slots with an item detail panel showing description, selling price, and use and sell actions',
    parallax: '-0.05',
    summary: 'The same skeleton as the unit screen, retuned for items.',
    body: [
      'This shares its bones with the unit collection on purpose. A player who has learned one screen should not have to learn the other — grid on the left, detail on the right, search and filter in the same place, actions in the same corner.',
      'What changes is what the detail panel argues. Items need a reason to be used or sold, so the description and the selling price carry the panel, and the two actions are colour-split — gold to use, red to sell — because they are not reversible in the same way.',
      'Empty slots are drawn as real slots rather than blank space, so the grid holds its shape and the eye can count capacity without reading the counter.',
    ],
    facts: [
      { k: 'Game', v: 'Anime Conquerors' },
      { k: 'Screen', v: 'Inventory & item detail' },
      { k: 'Includes', v: 'Slot grid, item panel, use/sell states' },
    ],
  },
  {
    slug: 'digital-circus-loading',
    index: '04',
    title: 'The Amazing Digital Circus',
    tag: 'Loading screen',
    cat: 'menus',
    image: '/images/digital-circus-loading.jpg',
    width: 1920,
    height: 1080,
    alt: 'The Amazing Digital Circus loading screen — glitched logo panel, a progress bar reading 72 percent, a flavour line, and a character holding a tip card',
    parallax: '0.05',
    summary: 'The first thing anyone sees, treated as part of the show rather than a wait.',
    body: [
      'A loading screen is the only screen every single player is guaranteed to look at. This one uses that: the logo sits on a torn, glitched frame that establishes the show\'s visual language before the game has drawn a single thing.',
      'The progress bar is deliberately loud — halftone texture, hard percentage read-out, a caption line underneath. You always know how far through you are, which is the one job the screen actually has.',
      'The tip card in the corner does the second job. It gives the eye somewhere to go during the wait and carries a message, framed by a character so it reads as part of the world rather than as a notice bolted on top of it.',
    ],
    facts: [
      { k: 'Game', v: 'The Amazing Digital Circus' },
      { k: 'Screen', v: 'Loading / first launch' },
      { k: 'Includes', v: 'Logo frame, progress bar, tip card' },
    ],
  },
  {
    slug: 'digital-circus-cast',
    index: '05',
    title: 'The Amazing Digital Circus',
    tag: 'Cast select',
    cat: 'menus',
    image: '/images/digital-circus-cast.jpg',
    width: 1920,
    height: 1080,
    alt: 'The Amazing Digital Circus cast screen — a character preview with unlock requirements, a six-tile character grid, and buy and equip actions',
    parallax: '-0.05',
    summary: 'Character select where the requirements are the interface.',
    body: [
      'Everything a player needs in order to act is on one panel: who the character is, what they cost in progress rather than currency, and the two things you can do about it.',
      'The requirements are listed as plain running totals — essences 2/8, time played, abstractions — so the gap between where you are and what you want is a number you can close, not a locked icon with no explanation.',
      'The whole panel is built on the torn-poster language the rest of the game uses, with the side rail and the essence meter kept in a fixed position across every frame in the set, so moving between Shop, Cast and Skins never moves the furniture.',
    ],
    facts: [
      { k: 'Game', v: 'The Amazing Digital Circus' },
      { k: 'Screen', v: 'Cast / character select' },
      { k: 'Includes', v: 'Character grid, requirement list, side rail' },
    ],
  },
  {
    slug: 'digital-circus-abstraction',
    index: '06',
    title: 'The Amazing Digital Circus',
    tag: 'Abstraction',
    cat: 'menus',
    image: '/images/digital-circus-abstraction.jpg',
    width: 1920,
    height: 1080,
    alt: 'The Amazing Digital Circus abstraction screen — a preview tile beside a checklist of three unlock conditions, with buy, equip and next actions',
    parallax: '0.05',
    summary: 'A checklist, drawn in the same torn paper as everything else.',
    body: [
      'The counterpart to the cast frame, and deliberately the inverse of it: where that screen is dark and saturated, this one is bleached to near-white so the two never get confused at a glance, even though they share a layout.',
      'Unlock conditions are a literal checklist with tick boxes. Three conditions, each one either done or not — no progress bars, no percentages, nothing to interpret.',
      'Buy, Equip and Next are given equal weight because at this point the player has already decided; the screen\'s job is to get out of the way rather than to push one of them.',
    ],
    facts: [
      { k: 'Game', v: 'The Amazing Digital Circus' },
      { k: 'Screen', v: 'Abstraction unlock' },
      { k: 'Includes', v: 'Condition checklist, preview tile, actions' },
    ],
  },
  {
    slug: 'skyfall-card-deck',
    index: '07',
    title: 'Skyfall: Retribution',
    tag: 'Card deck',
    cat: 'systems',
    image: '/images/skyfall-card-deck.jpg',
    width: 1920,
    height: 1080,
    alt: 'Skyfall Retribution card deck screen — eight skill cards in two rows, each showing cost, art, effect and upgrade text, with health and scrap counters on the left',
    parallax: '-0.05',
    summary: 'Eight cards, each one readable in full without a tooltip.',
    body: [
      'Deck screens usually hide half the information behind a hover. Here every card carries its cost, its art, its effect and its upgrade line at once, so comparing two cards is a matter of looking rather than of pointing at each one in turn.',
      'The cost badge sits in the top right of every card in the same place, and the lightning variant marks the cards that work differently — a shape difference, not just a colour one.',
      'Conditional effects are picked out in colour inside the body text, so "only if enemy HP ≤ 30" reads as a condition rather than as more grey text. Health and scrap sit off to the left, outside the card area, where they stay legible against the scene behind them.',
    ],
    facts: [
      { k: 'Game', v: 'Skyfall: Retribution' },
      { k: 'Screen', v: 'Card deck / loadout' },
      { k: 'Includes', v: 'Card template, rarity states, resource bar' },
    ],
  },
  {
    slug: 'rpg-path-selection',
    index: '08',
    title: 'Aetheria',
    tag: 'Path selection',
    cat: 'menus',
    image: '/images/rpg-path-selection.jpg',
    width: 1920,
    height: 1080,
    alt: 'Fantasy RPG path selection screen — eight elemental aether cards with drop rates and lore text in a column, over a cathedral interior',
    parallax: '0.05',
    summary: 'Eight elemental paths, with the odds stated plainly.',
    body: [
      'A complete tonal departure from the other work here, and deliberately so: serif type, restrained contrast, and a panel that sits over the scene rather than covering it. The cathedral does the atmospheric work, so the interface does not have to.',
      'Every path lists its drop rate next to its name — 20% down to 0.90% — rather than burying the odds. Rarity is communicated by the number itself, which needs no legend and no colour key.',
      'The column scrolls inside a fixed frame with the roll actions pinned beneath it, so the two things a player does here stay put no matter how far down the list they read. The breadcrumb along the bottom keeps character creation legible as a sequence with a known end.',
    ],
    facts: [
      { k: 'Screen', v: 'Character creation — path select' },
      { k: 'Includes', v: 'Aether cards, drop rates, step breadcrumb' },
      { k: 'Note', v: 'Serif direction, distinct from the anime work' },
    ],
  },
  {
    slug: 'cartoon-inventory',
    index: '09',
    title: 'Cartoon Pets',
    tag: 'Inventory',
    cat: 'systems',
    image: '/images/cartoon-inventory.jpg',
    width: 1920,
    height: 1080,
    alt: 'Bright cartoon-style pet inventory — a ten-slot grid with a dashed border, a search field, and a pet detail card showing rarity, age and equip actions',
    parallax: '-0.05',
    summary: 'The same inventory problem, solved for a much younger audience.',
    body: [
      'Everything here is bigger, rounder and higher contrast than the anime work — thick outlines, a dashed cut-out border, and slots large enough to hit reliably with a thumb.',
      'The detail card stacks rarity and age as separate coloured pills rather than as text, so the two facts that matter about a pet are legible before any reading happens.',
      'Equip and delete are kept deliberately unequal: equip is a wide green action, delete is a small red icon set apart from it. On a screen aimed at younger players, the destructive action should be harder to hit by accident.',
    ],
    facts: [
      { k: 'Screen', v: 'Pet inventory & detail' },
      { k: 'Includes', v: 'Slot grid, pet card, rarity pills' },
      { k: 'Note', v: 'Built for large touch targets' },
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
