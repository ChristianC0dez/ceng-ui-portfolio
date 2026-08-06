/*
  The top bar. Used by the home page and by every project page, so there is
  only one copy to keep in step.

  `onHome` matters more than it looks: on the home page the links are plain
  anchors (#work) so the smooth-scrolling script picks them up, but on a
  project page they have to point back at the home page first (/#work).
*/

export default function SiteNav({ onHome = false }: { onHome?: boolean }) {
  const to = (hash: string) => (onHome ? `#${hash}` : `/#${hash}`)

  return (
    <>
      <div className="scroll-progress" aria-hidden="true"><span></span></div>

      <a href={to('work')} className="skip-link">Skip to work</a>

      <header className="nav" id="nav">
        <div className="nav__inner">
          <a href={onHome ? '#top' : '/'} className="wordmark" aria-label="CENG, back to top">
            <span className="logo-mark" aria-hidden="true"></span>
            CENG
          </a>

          <nav className="nav__links" aria-label="Main">
            <a href={to('work')}><span>Work</span></a>
            <a href={to('about')}><span>About</span></a>
            <a href={to('process')}><span>Process</span></a>
            <a href={to('faq')}><span>FAQ</span></a>
          </nav>

          <div className="nav__actions">
            <button className="theme-toggle" id="themeToggle" type="button" aria-label="Switch to light mode">
              <span className="theme-toggle__track" aria-hidden="true">
                <svg className="theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <svg className="theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4.2" />
                  <path d="M12 2.6v2M12 19.4v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.6 12h2M19.4 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
                </svg>
              </span>
            </button>

            <a href={to('contact')} className="btn btn--solid btn--sm nav__cta magnetic">Start a project</a>

            <button className="menu-btn" id="menuBtn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </header>

      <div className="mobile-menu" id="mobileMenu" hidden>
        <nav aria-label="Mobile">
          <a href={to('work')}><em>01</em> Work</a>
          <a href={to('about')}><em>02</em> About</a>
          <a href={to('process')}><em>03</em> Process</a>
          <a href={to('faq')}><em>04</em> FAQ</a>
          <a href={to('contact')}><em>05</em> Contact</a>
        </nav>
      </div>
    </>
  )
}
