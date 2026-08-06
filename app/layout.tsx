import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'CENG — UI/UX Designer for Roblox Experiences',
  description: 'CENG designs HUDs, menus, shops and inventory systems for Roblox experiences. Interface design from first wireframe to handoff-ready assets.',
}

// Runs before anything paints. Sets the theme so there is no flash of the
// wrong palette, and locks scrolling straight away so the page cannot be
// scrolled behind the loading screen. `script.js` releases the lock.
const themeScript = `(function(){var r=document.documentElement;r.classList.add('js','is-loading');try{var saved=localStorage.getItem('ceng-theme');var prefersLight=window.matchMedia('(prefers-color-scheme: light)').matches;r.setAttribute('data-theme',saved||(prefersLight?'light':'dark'));}catch(e){}setTimeout(function(){r.classList.remove('is-loading');var l=document.getElementById('loader');if(l&&l.parentNode)l.parentNode.removeChild(l);},8000);})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        {/*
          The loading screen. It sits before the page content so it paints
          first, and the stylesheet only reveals it once the `js` class is on
          <html> — so if JavaScript never arrives, no one is left staring at an
          overlay that can't dismiss itself.
        */}
        <div className="loader" id="loader">
          <div className="loader__inner">
            <img
              className="loader__logo"
              src="/images/ceng-logo.png"
              alt=""
              width={675}
              height={675}
              aria-hidden="true"
            />
            <div className="loader__meter" aria-hidden="true">
              <span id="loaderBar" />
            </div>
            <p className="loader__status">
              <span className="loader__word">Loading</span>
              {/* Hidden from screen readers: a number ticking 60 times a
                  second would be read aloud as noise. The word above is the
                  part that carries the meaning. */}
              <span className="loader__pct" id="loaderPct" aria-hidden="true">
                0%
              </span>
            </p>
          </div>
        </div>

        {/*
          The site itself. Wrapped so it can be blurred and faded in on its own
          as the loading screen dissolves — the loader is a sibling, so it is
          never caught by the page's own blur.
        */}
        <div className="page">{children}</div>

        <Script src="/script.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
