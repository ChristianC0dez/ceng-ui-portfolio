import type { Metadata } from 'next'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export const metadata: Metadata = {
  title: 'Pricing — CENG',
  description:
    'Per-frame pricing for Roblox UI design. Three tiers, from a single simple frame to complex multi-state layouts. Robux accepted.',
}

/*
  THE ROBUX CONVERSION

  Roblox pays out Developer Exchange at $0.0035 USD per Robux — 100,000 R$
  cashes out at $350. So the Robux figure is simply the dollar price divided
  by that rate, rounded up to the nearest 100 so a rounding error never costs
  you money.

  If Roblox ever changes the DevEx rate, change this one number and every
  Robux price on the page follows.

  ⚠️ WORTH KNOWING: this is the straight DevEx conversion you asked for, and
  it is correct if a client sends you Robux directly. It is NOT the right
  number if they pay by buying a gamepass — Roblox keeps 30% of a gamepass
  sale, so you would receive only 70% of the figures shown. To price for
  gamepass payment instead, change the divisor below to `(DEVEX_RATE * 0.7)`,
  which raises the Pro tier from R$38,600 to about R$55,200.
*/
const DEVEX_RATE = 0.0035

function toRobux(usd: number): string {
  const robux = Math.ceil(usd / DEVEX_RATE / 100) * 100
  return robux.toLocaleString('en-US')
}

/*
  THE PRICES LIVE HERE.

  Edit a number, a feature line or a delivery time in this list and the page
  updates. To add a fourth tier, copy one block and change its contents — the
  layout adjusts on its own.

  `featured: true` puts the subtle highlight and the "Most popular" label on a
  tier. Only mark one.

  `cta` is the button text, written out in full rather than assembled from the
  tier name — otherwise "Advanced" produces "Start a advanced frame".
*/
const tiers = [
  {
    name: 'Basic',
    price: 35,
    unit: '/ frame',
    summary: 'A single clean screen, built and handed over ready to drop in.',
    features: [
      'Simple frame',
      'High-quality assets',
      'Minimal layouts',
      '1 revision',
      'Imported for you',
      '3–5 days delivery',
    ],
    cta: 'Start a basic frame',
    featured: false,
  },
  {
    name: 'Advanced',
    price: 70,
    unit: '/ frame',
    summary: 'More detail, more states, and a layout that carries real content.',
    features: [
      'Detailed frame',
      'High-quality assets',
      'Advanced layouts',
      '2 revisions',
      'Imported for you',
      '1–2 weeks delivery',
    ],
    cta: 'Start an advanced frame',
    featured: true,
  },
  {
    name: 'Pro',
    price: 135,
    unit: '/ frame',
    summary: 'The full treatment — the most complex screens, with the most room to revise.',
    features: [
      'Highly-detailed frame',
      'High-quality assets',
      'Complex layouts',
      '4 revisions',
      'Imported for you',
      '2–5 weeks delivery',
    ],
    cta: 'Start a pro frame',
    featured: false,
  },
]

function Tick() {
  return (
    <span className="tier__tick" aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 8.5 6.5 11.5 12.5 5" />
      </svg>
    </span>
  )
}

export default function PricingPage() {
  return (
    <>
      <SiteNav />

      <main id="top">
        <section className="section pricing-head">
          <div className="shell">
            <p className="eyebrow" data-reveal><em>—</em> Pricing</p>
            <h1 className="pricing__title" data-split>Priced per frame,<br />not per guess.</h1>
            <p className="pricing__sub" data-reveal>
              A frame is one screen — a shop, an inventory, a HUD, a menu. You pay for
              the screens you need and nothing else. Every tier is imported into your
              game for you.
            </p>
          </div>
        </section>

        <section className="pricing">
          <div className="shell">

            <div className="tiers" data-stagger="90">
              {tiers.map((tier) => (
                <article
                  key={tier.name}
                  className={`tier${tier.featured ? ' tier--featured' : ''}`}
                  data-reveal
                >
                  <header className="tier__head">
                    <h2 className="tier__name">{tier.name}</h2>
                    {tier.featured && <span className="tier__badge">Most popular</span>}
                  </header>

                  {/* Both prices are rendered into data attributes so the
                      toggle can swap between them without a round trip. */}
                  <p className="tier__price">
                    <span
                      className="tier__amount"
                      data-usd={`$${tier.price}`}
                      data-robux={`R$${toRobux(tier.price)}`}
                    >
                      ${tier.price}
                    </span>
                    <span className="tier__unit">{tier.unit}</span>
                  </p>

                  <p className="tier__summary">{tier.summary}</p>

                  <ul className="tier__list" data-stagger="55">
                    {tier.features.map((f) => (
                      <li key={f} data-reveal><Tick />{f}</li>
                    ))}
                  </ul>

                  <a
                    href="/#contact"
                    className={`btn ${tier.featured ? 'btn--solid' : 'btn--ghost'} tier__cta magnetic`}
                  >
                    {tier.cta}
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </a>
                </article>
              ))}
            </div>

            {/*
              Currency switch. Defaults to USD; the script swaps every
              `.tier__amount` to its `data-robux` value and back.
            */}
            <div className="switch-row" data-reveal>
              <div className="switch" id="currencySwitch" role="group" aria-label="Show prices in">
                {/* Slides behind whichever option is active */}
                <span className="switch__thumb" aria-hidden="true"></span>
                <button
                  type="button"
                  className="switch__btn is-active"
                  data-currency="usd"
                  aria-pressed="true"
                >
                  USD
                </button>
                <button
                  type="button"
                  className="switch__btn"
                  data-currency="robux"
                  aria-pressed="false"
                >
                  Robux
                </button>
              </div>

              <p className="pricing__note">
                Robux accepted at the Developer Exchange rate.
              </p>

              {/* Anyone reading prices is deciding whether to commit — the
                  terms belong right here, not buried in the footer. */}
              <a href="/terms" className="btn btn--ghost btn--lg" data-reveal>
                Read the Terms of Service
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
            </div>

          </div>
        </section>

        {/* The questions a price list always raises, answered before they are asked */}
        <section className="section section--rule">
          <div className="shell">
            <div className="section__head" data-stagger="90">
              <p className="eyebrow" data-reveal><em>—</em> Before you ask</p>
              <h2 className="section__title" data-split>How the pricing works.</h2>
            </div>

            <dl className="terms" data-stagger="70">
              <div className="term" data-reveal>
                <dt>What counts as one frame?</dt>
                <dd>
                  One screen and the states that belong to it — hover, pressed, empty,
                  locked. A shop with an item detail panel is one frame, not two.
                </dd>
              </div>
              <div className="term" data-reveal>
                <dt>What does &ldquo;imported&rdquo; mean?</dt>
                <dd>
                  I put the finished screen into your Roblox place myself, with named
                  layers and sliced assets, so your developers are not rebuilding it
                  from a picture.
                </dd>
              </div>
              <div className="term" data-reveal>
                <dt>What if I need several frames?</dt>
                <dd>
                  Send the full list and you get one fixed number for the set before any
                  work starts. Larger sets usually work out below the per-frame rate.
                </dd>
              </div>
              <div className="term" data-reveal>
                <dt>What happens after the revisions?</dt>
                <dd>
                  Revisions cover changes to work already agreed. A new direction or an
                  extra screen is quoted separately rather than absorbed quietly.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="section project-cta">
          <div className="shell">
            <h2 className="section__title" data-split>Not sure which tier fits?</h2>
            <p className="section__note" data-reveal>
              Send the game and the screens you have in mind. I&apos;ll tell you which
              tier it lands in and what the whole set would cost.
            </p>
            <a href="/#contact" className="btn btn--solid magnetic" data-reveal>
              Start a project
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
