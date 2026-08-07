/* The bottom bar, shared by the home page and every project page. */

export default function SiteFooter({ onHome = false }: { onHome?: boolean }) {
  const to = (hash: string) => (onHome ? `#${hash}` : `/#${hash}`)

  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <a href={onHome ? '#top' : '/'} className="footer__mark">
          <span className="logo-mark" aria-hidden="true"></span>
          CENG
        </a>
        <nav className="footer__nav" aria-label="Footer">
          <a href={to('work')}>Work</a>
          <a href={to('about')}>About</a>
          <a href={to('process')}>Process</a>
          <a href="/pricing">Pricing</a>
          <a href={to('faq')}>FAQ</a>
          <a href="/terms">Terms</a>
          <a href={to('contact')}>Contact</a>
        </nav>
        <p className="footer__note">
          UI/UX for Roblox experiences — <span id="year">2026</span>
        </p>
      </div>
    </footer>
  )
}
