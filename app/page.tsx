import type { CSSProperties } from 'react'
import { projects } from './work/projects'
import SiteNav from './components/SiteNav'
import SiteFooter from './components/SiteFooter'

const v = (vars: Record<string, string>): CSSProperties => vars as unknown as CSSProperties

export default function Home() {
  return (
    <>
      <SiteNav onHome />

      <main id="top">

        {/* ============ HERO ============ */}
        <section className="hero">
          <div className="hero__grid" aria-hidden="true" data-parallax="-0.05"></div>
          <div className="shell">

            <p className="status" data-reveal>
              <span className="status__dot" aria-hidden="true"></span>
              Open for commissions
            </p>

            <h1 className="hero__title">
              <span className="line" style={v({ '--d': '60ms' })}><span>Interfaces that make</span></span>
              <span className="line" style={v({ '--d': '140ms' })}><span>Roblox games feel</span></span>
              <span className="line" style={v({ '--d': '220ms' })}><span className="ital">finished.</span></span>
            </h1>

            <p className="hero__sub" data-reveal style={v({ '--d': '320ms' })}>
              I&apos;m CENG. I design HUDs, menus, shops and inventory systems for Roblox
              experiences — starting at the first wireframe and ending with assets your
              developers can drop straight into Studio.
            </p>

            <div className="hero__actions" data-reveal style={v({ '--d': '400ms' })}>
              <a href="#work" className="btn btn--solid magnetic">
                View work
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
              </a>
              <a href="#contact" className="btn btn--ghost magnetic">Start a project</a>
            </div>

            <dl className="spec" data-stagger="70">
              <div className="spec__item" data-reveal>
                <dt>Role</dt>
                <dd>UI/UX Designer</dd>
              </div>
              <div className="spec__item" data-reveal>
                <dt>Focus</dt>
                <dd>Roblox experiences</dd>
              </div>
              <div className="spec__item" data-reveal>
                <dt>Tools</dt>
                <dd>Figma, Illustrator, After Effects</dd>
              </div>
              <div className="spec__item" data-reveal>
                <dt>Response</dt>
                <dd>Usually within a day</dd>
              </div>
            </dl>

          </div>
        </section>

        {/* ============ WORK ============ */}
        <section className="section" id="work">
          <div className="shell">

            <div className="section__head" data-stagger="90">
              <p className="eyebrow" data-reveal><em>01</em> Selected work</p>
              <h2 className="section__title" data-split>Six interfaces,<br />built to ship.</h2>
              <p className="section__note" data-reveal>
                Every screen here was designed at real Roblox resolutions and exported
                as sliced, named layers.
              </p>
            </div>
            <div className="work" id="workGrid" data-stagger="90">

              {projects.map((p) => (
                <article className="card" data-cat={p.cat} data-reveal key={p.slug}>
                  <a
                    className="card__link"
                    href={`/work/${p.slug}`}
                    aria-label={`${p.title} — ${p.tag}`}
                  >
                    <div className="card__media">
                      <span className="card__shift" data-parallax={p.parallax}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.alt} loading="lazy" width={p.width} height={p.height} />
                      </span>
                      <span className="card__view">
                        View
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                      </span>
                    </div>
                    <div className="card__meta">
                      <span className="card__index">{p.index}</span>
                      <h3 className="card__title">{p.title}</h3>
                      <span className="card__tag">{p.tag}</span>
                      <span className="card__year">{p.year}</span>
                    </div>
                  </a>
                </article>
              ))}

            </div>

          </div>
        </section>

        {/* ============ ABOUT ============ */}
        <section className="section section--rule" id="about">
          <div className="shell">
            <div className="about">

              <div className="about__visual" data-reveal>
                {/* The mark stands in for a portrait. It is painted as a mask
                    (see .logo-mark) so it takes the text colour in both themes. */}
                <div className="portrait portrait--mark">
                  <span className="portrait__shift" data-parallax="0.03">
                    <span className="portrait__logo logo-mark" aria-label="CENG" role="img"></span>
                  </span>
                </div>
                <p className="portrait__cap">CENG — UI/UX Designer</p>
              </div>

              <div className="about__body">
                <p className="eyebrow" data-reveal><em>02</em> About</p>
                <h2 className="section__title" data-split>
                  I make the part<br />players actually touch.
                </h2>

                <div className="prose" data-reveal style={v({ '--d': '120ms' })}>
                  <p>
                    Most Roblox games get the world right and the interface last. I work the
                    other way around — starting from what a player needs to see in the first
                    three seconds, then building outward until every screen agrees with the
                    one before it.
                  </p>
                  <p>
                    That means readable at 1080p and on a phone, consistent spacing across
                    every panel, and states for hover, press, disabled and empty. Not just
                    the screenshot version.
                  </p>
                  <p>
                    I hand off in Figma with named layers and sliced exports, so nobody on
                    your team has to guess what a component is called.
                  </p>
                </div>

                <ul className="caps" data-reveal style={v({ '--d': '180ms' })} data-stagger="45">
                  <li data-reveal>HUD &amp; combat overlays</li>
                  <li data-reveal>Main menus &amp; lobbies</li>
                  <li data-reveal>Shop &amp; currency screens</li>
                  <li data-reveal>Inventory &amp; equipment</li>
                  <li data-reveal>Icon &amp; badge sets</li>
                  <li data-reveal>Design systems</li>
                  <li data-reveal>Motion &amp; transitions</li>
                  <li data-reveal>Studio-ready handoff</li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* ============ PROCESS ============ */}
        <section className="section section--rule" id="process">
          <div className="shell">

            <div className="section__head section__head--split" data-stagger="90">
              <div>
                <p className="eyebrow" data-reveal><em>03</em> Process</p>
                <h2 className="section__title" data-split>Four steps,<br />no surprises.</h2>
              </div>
              <p className="section__note" data-reveal>
                The same order every time. You always know what&apos;s coming next and what
                you&apos;re approving before it gets built.
              </p>
            </div>

            {/* The rail on the left fills as you scroll, so the section shows
                how far through the four steps you have read. */}
            <div className="steps-wrap">
              <div className="steps-rail" aria-hidden="true">
                <span className="steps-rail__fill" id="stepsFill"></span>
              </div>

              <ol className="steps" data-stagger="110">
                <li className="step" data-reveal>
                  <span className="step__node" aria-hidden="true"></span>
                  <span className="step__num">01</span>
                  <div className="step__body">
                    <h3>Brief</h3>
                    <p>You tell me the game, the screens you need and your deadline. I come back with scope and a price before anything starts.</p>
                  </div>
                  <span className="step__meta">Day 1</span>
                </li>
                <li className="step" data-reveal>
                  <span className="step__node" aria-hidden="true"></span>
                  <span className="step__num">02</span>
                  <div className="step__body">
                    <h3>Direction</h3>
                    <p>Two visual directions on one real screen from your game — not a mood board. You pick one, we lock the type, spacing and colour rules.</p>
                  </div>
                  <span className="step__meta">Days 2–3</span>
                </li>
                <li className="step" data-reveal>
                  <span className="step__node" aria-hidden="true"></span>
                  <span className="step__num">03</span>
                  <div className="step__body">
                    <h3>Design</h3>
                    <p>Every screen built out in full, including the states people forget — empty, loading, locked, error. You review in Figma as it happens.</p>
                  </div>
                  <span className="step__meta">The bulk of it</span>
                </li>
                <li className="step" data-reveal>
                  <span className="step__node" aria-hidden="true"></span>
                  <span className="step__num">04</span>
                  <div className="step__body">
                    <h3>Handoff</h3>
                    <p>Named layers, sliced exports at the right scales, and a short doc covering spacing and component names. Questions answered after delivery.</p>
                  </div>
                  <span className="step__meta">Final week</span>
                </li>
              </ol>
            </div>

          </div>
        </section>

        {/* ============ TOOLKIT ============ */}
        <section className="toolkit" aria-label="Tools I work in">
          <div className="shell">
            <ul className="tools" data-stagger="70">

              <li className="tool" data-reveal>
                <span className="tool__icon" aria-hidden="true">
                  {/* Figma — the five stacked shapes */}
                  <svg viewBox="0 0 24 36" fill="currentColor">
                    <path d="M6 0h6v6H6a3 3 0 0 1 0-6Z" opacity=".9" />
                    <path d="M12 0h6a3 3 0 0 1 0 6h-6V0Z" opacity=".55" />
                    <path d="M6 6h6v6H6a3 3 0 0 1 0-6Z" opacity=".75" />
                    <path d="M6 12h6v6a3 3 0 1 1-6 0v-6Z" opacity=".9" />
                    <circle cx="15" cy="9" r="3" opacity=".55" />
                  </svg>
                </span>
                <span className="tool__name">Figma</span>
                <span className="tool__use">Design &amp; prototyping</span>
              </li>

              <li className="tool" data-reveal>
                <span className="tool__icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" fill="none">
                    <rect x="1" y="1" width="30" height="30" rx="7" stroke="currentColor" strokeWidth="1.6" />
                    <text x="16" y="21.5" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="600" fontFamily="Geist, sans-serif">Ai</text>
                  </svg>
                </span>
                <span className="tool__name">Illustrator</span>
                <span className="tool__use">Icons &amp; vector art</span>
              </li>

              <li className="tool" data-reveal>
                <span className="tool__icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" fill="none">
                    <rect x="1" y="1" width="30" height="30" rx="7" stroke="currentColor" strokeWidth="1.6" />
                    <text x="16" y="21.5" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="600" fontFamily="Geist, sans-serif">Ps</text>
                  </svg>
                </span>
                <span className="tool__name">Photoshop</span>
                <span className="tool__use">Texture &amp; retouch</span>
              </li>

              <li className="tool" data-reveal>
                <span className="tool__icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" fill="none">
                    <rect x="1" y="1" width="30" height="30" rx="7" stroke="currentColor" strokeWidth="1.6" />
                    <text x="16" y="21.5" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="600" fontFamily="Geist, sans-serif">Ae</text>
                  </svg>
                </span>
                <span className="tool__name">After Effects</span>
                <span className="tool__use">UI motion</span>
              </li>

              <li className="tool" data-reveal>
                <span className="tool__icon" aria-hidden="true">
                  {/* Roblox Studio — tilted square inside a square */}
                  <svg viewBox="0 0 32 32" fill="none">
                    <rect x="5" y="1.5" width="24" height="24" rx="2" transform="rotate(11 5 1.5)" stroke="currentColor" strokeWidth="1.6" />
                    <rect x="12.5" y="12" width="8" height="8" rx="1" transform="rotate(11 12.5 12)" fill="currentColor" />
                  </svg>
                </span>
                <span className="tool__name">Roblox Studio</span>
                <span className="tool__use">In-engine testing</span>
              </li>

              <li className="tool" data-reveal>
                <span className="tool__icon" aria-hidden="true">
                  {/* Blender — the ring and body of the mark, simplified */}
                  <svg viewBox="0 0 32 32" fill="none">
                    <circle cx="17" cy="18" r="9" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="17" cy="18" r="3.4" fill="currentColor" />
                    <path d="M4 12.5h10l-4.5 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="tool__name">Blender</span>
                <span className="tool__use">3D props &amp; renders</span>
              </li>

              <li className="tool" data-reveal>
                <span className="tool__icon" aria-hidden="true">
                  {/* Rive — the ribboned R */}
                  <svg viewBox="0 0 32 32" fill="none">
                    <path d="M8 5h11a7 7 0 0 1 0 14H8V5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M8 19v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx="17" cy="12" r="2.6" fill="currentColor" />
                  </svg>
                </span>
                <span className="tool__name">Rive</span>
                <span className="tool__use">Interactive animation</span>
              </li>

            </ul>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="section section--rule" id="faq">
          <div className="shell">

            <div className="section__head section__head--split" data-stagger="90">
              <div>
                <p className="eyebrow" data-reveal><em>04</em> Questions</p>
                <h2 className="section__title" data-split>Before you<br />message me.</h2>
              </div>
              <p className="section__note" data-reveal>
                If your question isn&apos;t here, ask it on Discord — I&apos;d rather answer than
                have you guess.
              </p>
            </div>

            <div className="faq" data-stagger="70">
              <details className="qa" data-reveal>
                <summary><span className="qa__n">01</span> What do you need from me to start?<span className="qa__ic" aria-hidden="true"></span></summary>
                <div className="qa__body"><p>The game name and link, a list of the screens you want, any existing art or colours you&apos;re locked into, and your deadline. Screenshots of the current UI help more than a description.</p></div>
              </details>
              <details className="qa" data-reveal>
                <summary><span className="qa__n">02</span> How long does a project take?<span className="qa__ic" aria-hidden="true"></span></summary>
                <div className="qa__body"><p>A single screen is usually a few days. A full system across a dozen screens runs a few weeks. I give you a real date in the brief stage rather than a guess up front.</p></div>
              </details>
              <details className="qa" data-reveal>
                <summary><span className="qa__n">03</span> Do I get files I can use in Studio?<span className="qa__ic" aria-hidden="true"></span></summary>
                <div className="qa__body"><p>Yes. Sliced PNGs at the scales you need, named to match the Figma layers, plus 9-slice assets where a panel has to stretch. Source file included.</p></div>
              </details>
              <details className="qa" data-reveal>
                <summary><span className="qa__n">04</span> How many revisions are included?<span className="qa__ic" aria-hidden="true"></span></summary>
                <div className="qa__body"><p>Revisions run through the whole project rather than being counted. Because direction gets locked in step two, changes later tend to be small.</p></div>
              </details>
              <details className="qa" data-reveal>
                <summary><span className="qa__n">05</span> Can you animate the UI?<span className="qa__ic" aria-hidden="true"></span></summary>
                <div className="qa__body"><p>I can. Transitions, hover states and entrance animations get delivered as reference videos plus timing and easing values your scripter can match.</p></div>
              </details>
              <details className="qa" data-reveal>
                <summary><span className="qa__n">06</span> What does it cost?<span className="qa__ic" aria-hidden="true"></span></summary>
                <div className="qa__body"><p>It depends on how many screens and how complex the states are. Send me the brief and you&apos;ll have a fixed number before any work starts — no hourly billing.</p></div>
              </details>
            </div>

          </div>
        </section>

        {/* ============ CONTACT ============ */}
        <section className="section contact" id="contact">
          <div className="shell">

            <p className="eyebrow" data-reveal><em>05</em> Contact</p>
            <h2 className="contact__title" data-split>
              Got a game that<br />deserves better UI?
            </h2>
            <p className="contact__sub" data-reveal style={v({ '--d': '120ms' })}>
              Send the game and the screens you need. I&apos;ll tell you honestly whether
              I&apos;m the right fit and what it&apos;ll take.
            </p>

            <div className="links" data-stagger="110">
              <a className="link-row" href="#" data-reveal data-placeholder="discord">
                <span className="link-row__k">Discord</span>
                <span className="link-row__v">add-your-username</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6" /></svg>
              </a>
              <a className="link-row" href="#" data-reveal data-placeholder="x">
                <span className="link-row__k">X / Twitter</span>
                <span className="link-row__v">@add-your-handle</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6" /></svg>
              </a>
            </div>

          </div>
        </section>

      </main>

      <SiteFooter onHome />
    </>
  )
}
