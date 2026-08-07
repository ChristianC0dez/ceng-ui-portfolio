import type { Metadata } from 'next'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export const metadata: Metadata = {
  title: 'Terms of Service — CENG',
  description:
    'How a commission with CENG works: payment, revisions, refunds, delivery, ownership, timelines, conduct and liability.',
}

/*
  THE TERMS LIVE HERE.

  Each block is one numbered section. Edit the wording, add a bullet, or add a
  whole new section by copying a block — the numbering is generated from the
  position in this list, so nothing needs renumbering by hand.
*/
const sections = [
  {
    title: 'Payment & Pricing',
    points: [
      '50% deposit required to start work, remaining 50% due on delivery.',
      'Accepted payment methods: PayPal or Robux.',
      'Transaction fees and taxes are the client’s responsibility.',
      'Price locked in at deposit for the agreed scope, depending on the plan chosen.',
      'Files released only after full payment.',
    ],
  },
  {
    title: 'Revisions',
    points: [
      'Included revisions depend on the plan selected, confirmed upfront.',
      'No revisions after final delivery.',
      'Further changes after delivery are a new, separately priced commission.',
    ],
  },
  {
    title: 'Refunds',
    points: [
      'Full refund only if requested before work starts.',
      'No refunds once work has started, regardless of progress.',
      'If cancelled mid-project, completed work stays with me unless the balance is paid in full.',
    ],
  },
  {
    title: 'Delivery',
    points: [
      'Sent via the agreed platform (Discord or email).',
      'Delivered in the agreed format — Figma, PNG, Roblox-ready assets, or imported.',
      'Client should review promptly; delays don’t extend revision windows.',
    ],
  },
  {
    title: 'Usage & Ownership',
    points: [
      'Full payment grants the client rights to use the design in their project(s).',
      'I may showcase work in my portfolio unless confidentiality is requested in writing beforehand.',
      'Source files are not included unless explicitly agreed.',
    ],
  },
  {
    title: 'Timelines',
    points: [
      'Timelines vary by plan and are not guaranteed.',
      'No client response for 14+ days may pause or cancel the commission with no refund.',
      'Rush jobs available for an extra fee if capacity allows.',
    ],
  },
  {
    title: 'Conduct',
    points: [
      'Harassment, disrespect, or scope-creep disguised as revisions may lead to cancellation without refund.',
      'I may decline or stop work at my discretion.',
    ],
  },
  {
    title: 'Liability',
    points: [
      'I am not responsible for UI performance once implemented, such as coding issues or performance.',
      'My responsibility is limited to the agreed work.',
    ],
  },
]

export default function TermsPage() {
  return (
    <>
      <SiteNav />

      <main id="top">
        <section className="section terms-head">
          <div className="shell">
            <p className="eyebrow" data-reveal><em>—</em> Terms of service</p>
            <h1 className="terms__title" data-split>What to expect,<br />in writing.</h1>
            <p className="terms__sub" data-reveal>
              Everything below applies to every commission. Read it before you send a
              deposit — if anything here does not work for your project, say so first
              and we will sort it out rather than discover it halfway through.
            </p>
          </div>
        </section>

        <section className="tos">
          <div className="shell">
            {sections.map((section, i) => (
              <section className="tos__block" key={section.title} data-reveal>
                <header className="tos__head">
                  <h2 className="tos__title">{section.title}</h2>
                  <span className="tos__rule" aria-hidden="true"></span>
                  <span className="tos__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </header>

                <ul className="tos__list">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            ))}

            <p className="tos__foot" data-reveal>
              © CENG {new Date().getFullYear()} — All rights reserved.
            </p>
          </div>
        </section>

        <section className="section project-cta">
          <div className="shell">
            <h2 className="section__title" data-split>Happy with all that?</h2>
            <p className="section__note" data-reveal>
              Send the game and the screens you need, and we&apos;ll get the scope and
              the number agreed before anything starts.
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
