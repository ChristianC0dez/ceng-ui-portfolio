/* ==========================================================================
   CENG — site interactivity & motion
   --------------------------------------------------------------------------
   1.  Motion settings      — the one place to tune or switch off animation
   2.  Dark / light mode
   3.  Smooth scrolling     — eases the page instead of jumping line to line
   4.  Headline splitting   — breaks headings into words so they rise in turn
   5.  Scroll reveals       — with automatic staggering
   6.  Parallax             — continuous drift tied to scroll position
   7.  Magnetic buttons     — buttons lean toward your cursor
   8.  Nav state, progress bar, active link, process rail
   9.  Work grid
   10. FAQ accordion
   11. Mobile menu
   12. Loading screen
   13. Footer year
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;


  /* ======================================================================
     1. MOTION SETTINGS
     ----------------------------------------------------------------------
     Turn any of these off if it feels like too much.
     ====================================================================== */

  var MOTION = {
    smoothScroll: true,   // eased page scrolling
    parallax:     true,   // images and headings drift as you scroll
    magnetic:     true,   // buttons lean toward the cursor
    scrollEase:   0.22,   // higher = snappier scrolling, lower = floatier
    staggerStep:  85,     // milliseconds between items in a group
    wordStep:     55,     // milliseconds between words in a heading

    // --- Loading screen ---
    loader:       true,   // show the logo screen while the page loads
    loaderMin:    1100,   // never flash by faster than this (milliseconds)
    loaderMax:    6000,   // give up waiting after this, no matter what
    loaderOnce:   false   // true = show only on the first visit of a session
  };

  // Someone with "reduce motion" switched on in their system settings gets a
  // plain, still version of the site. This is deliberate.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Touch devices keep their native scrolling — hijacking it feels wrong there.
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  var animate = !reduceMotion;
  var useSmooth = animate && MOTION.smoothScroll && finePointer;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }


  /* ======================================================================
     2. DARK / LIGHT MODE
     ====================================================================== */

  var themeToggle = document.getElementById('themeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('ceng-theme', theme); } catch (e) {}

    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#fbfbfa');
  }

  applyTheme(root.getAttribute('data-theme') || 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      if (document.startViewTransition && animate) {
        document.startViewTransition(function () { applyTheme(next); });
      } else {
        applyTheme(next);
      }
    });
  }


  /* ======================================================================
     3. SMOOTH SCROLLING
     ----------------------------------------------------------------------
     This eases the real scroll position rather than moving the page inside
     a transformed box. Doing it this way keeps the sticky nav, the reveals
     and browser find-on-page all working normally.
     ====================================================================== */

  var scrollTarget = window.scrollY;
  var scrollCurrent = window.scrollY;
  var expectedScroll = -1;   // where we last told the browser to put the page
  var rafId = 0;             // 0 means the animation loop is asleep

  /* Measurements are taken once and reused. Asking the browser for a position
     inside the animation loop forces it to redo layout 60 times a second,
     which is one of the classic reasons a "smooth" page stutters. */
  var cache = { docHeight: 0, viewH: 0, sections: [], steps: [], stepsTop: 0, stepsHeight: 0 };

  // offsetTop walks up ignoring transforms — important, because the parallax
  // elements are themselves being transformed. Measuring them with
  // getBoundingClientRect would feed their own offset back into the next
  // frame's calculation and the drift would cancel itself out.
  function docTop(el) {
    var t = 0;
    while (el) { t += el.offsetTop; el = el.offsetParent; }
    return t;
  }

  function measure() {
    cache.viewH = window.innerHeight;
    cache.docHeight = document.documentElement.scrollHeight;
    cache.sections = sections.map(function (s) { return { id: s.id, top: docTop(s) }; });

    // Process rail: where the list starts, how tall it is, and where each
    // step sits. Measured here so the per-frame update is pure arithmetic.
    if (stepsWrap) {
      cache.stepsTop = docTop(stepsWrap);
      cache.stepsHeight = stepsWrap.offsetHeight;
      cache.steps = stepEls.map(function (el) {
        return { top: docTop(el), height: el.offsetHeight };
      });
    }

    parallaxItems.forEach(function (item) {
      item.top = docTop(item.el);
      item.height = item.el.offsetHeight;

      // How far this thing may drift before it slides off its own frame and
      // shows a gap. The image inside is zoomed in CSS; that zoom is the only
      // room we have. Read it rather than assume it, so changing the scale in
      // the stylesheet can't silently break this.
      var img = item.el.querySelector('img');
      if (img) {
        var m = window.getComputedStyle(img).transform;
        var scaleY = 1;
        if (m && m !== 'none') {
          var parts = m.match(/matrix\(([^)]+)\)/);
          if (parts) scaleY = parseFloat(parts[1].split(',')[3]) || 1;
        }
        item.limit = Math.max(0, (item.height * (scaleY - 1)) / 2 - 2);
      } else {
        item.limit = Infinity;                 // the hero grid has nothing to clip
      }
    });
  }

  function maxScroll() {
    return Math.max(0, cache.docHeight - cache.viewH);
  }

  if (useSmooth) {
    // Our per-frame jumps must be instant, or they fight the CSS easing
    root.style.scrollBehavior = 'auto';

    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey) return;                       // let pinch-zoom through
      if (e.target.closest('[data-native-scroll]')) return;
      e.preventDefault();

      var delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;          // line units
      else if (e.deltaMode === 2) delta *= window.innerHeight;

      scrollTarget = clamp(scrollTarget + delta, 0, maxScroll());
      wake();
    }, { passive: false });

    // Keyboard, scrollbar dragging and find-on-page move the page themselves.
    // When that happens, catch up rather than fighting it.
    //
    // Note: scrollTo() fires this event asynchronously, so a simple "is this
    // us?" boolean would already be back to false by the time we arrive and
    // every frame of our own easing would look like an outside interruption.
    // Compare positions instead — if the page is where we last put it, it
    // was us.
    window.addEventListener('scroll', function () {
      if (Math.abs(window.scrollY - expectedScroll) <= 2) return;
      scrollTarget = window.scrollY;
      scrollCurrent = window.scrollY;
      wake();
    }, { passive: true });

    window.addEventListener('resize', function () {
      measure();                                   // sizes changed, re-read them
      scrollTarget = clamp(scrollTarget, 0, maxScroll());
      wake();
    });
  } else {
    // Native scrolling still has to drive the parallax and the nav, and the
    // loop is asleep between gestures — so nudge it awake on every scroll.
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
  }

  // Anchor links glide instead of teleporting
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var dest = document.querySelector(id);
      if (!dest) return;

      e.preventDefault();
      var top = dest.getBoundingClientRect().top + window.scrollY - 88;

      if (useSmooth) {
        scrollTarget = clamp(top, 0, maxScroll());
        wake();
      } else {
        window.scrollTo({ top: top, behavior: animate ? 'smooth' : 'auto' });
      }
    });
  });


  /* ======================================================================
     4. HEADLINE SPLITTING
     ----------------------------------------------------------------------
     Any heading marked data-split gets chopped into words, each in its own
     little mask, so they rise one after another.
     ====================================================================== */

  function splitWords(el) {
    var step = MOTION.wordStep;
    var index = 0;
    var pieces = [];

    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        // Text — break it into words
        node.textContent.split(/(\s+)/).forEach(function (chunk) {
          if (!chunk.trim()) { if (chunk) pieces.push(document.createTextNode(' ')); return; }
          var wrap = document.createElement('span');
          wrap.className = 'word-wrap';
          var word = document.createElement('span');
          word.className = 'word';
          word.textContent = chunk;
          word.style.setProperty('--d', (index++ * step) + 'ms');
          wrap.appendChild(word);
          pieces.push(wrap);
        });
      } else if (node.nodeName === 'BR') {
        pieces.push(node.cloneNode());
      } else {
        // Keep nested markup (like the muted span) intact, but still animate it
        var keep = node.cloneNode(true);
        var wrap2 = document.createElement('span');
        wrap2.className = 'word-wrap';
        var inner = document.createElement('span');
        inner.className = 'word';
        inner.style.setProperty('--d', (index++ * step) + 'ms');
        inner.appendChild(keep);
        wrap2.appendChild(inner);
        pieces.push(wrap2);
      }
    });

    el.textContent = '';
    el.classList.add('split');
    pieces.forEach(function (p) { el.appendChild(p); });
  }

  if (animate) {
    document.querySelectorAll('[data-split]').forEach(splitWords);
  }


  /* ======================================================================
     5. SCROLL REVEALS (with automatic staggering)
     ----------------------------------------------------------------------
     Any container marked data-stagger hands its children an increasing
     delay, so groups cascade instead of landing all at once.
     ====================================================================== */

  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    var step = parseInt(group.getAttribute('data-stagger'), 10) || MOTION.staggerStep;
    var kids = group.querySelectorAll(':scope > [data-reveal], :scope > * > [data-reveal]');
    kids.forEach(function (kid, i) {
      if (!kid.style.getPropertyValue('--d')) {
        kid.style.setProperty('--d', (i * step) + 'ms');
      }
    });
  });

  var revealables = document.querySelectorAll('[data-reveal], [data-split], .hero__title .line');

  if (!animate || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in', 'is-done'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-in');
        revealObserver.unobserve(el);
        // Release the compositor layer once it has settled
        setTimeout(function () { el.classList.add('is-done'); }, 1600);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  // The hero is already on screen, so it never gets an intersection event of
  // its own — it has to be started by hand. Held back until the loading screen
  // has gone, otherwise the entrance plays out of sight behind the overlay and
  // the visitor arrives at a page that has already finished animating.
  var heroStarted = false;

  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    requestAnimationFrame(function () {
      document.querySelectorAll('.hero [data-reveal], .hero [data-split], .hero__title .line')
        .forEach(function (el) { el.classList.add('is-in'); });
    });
  }


  /* ======================================================================
     6. PARALLAX
     ----------------------------------------------------------------------
     Elements marked data-parallax="0.12" drift as they cross the screen.
     The number is how strongly they move — negative goes the other way.
     ====================================================================== */

  var parallaxItems = [];

  if (animate && MOTION.parallax) {
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      parallaxItems.push({
        el: el,
        speed: parseFloat(el.getAttribute('data-parallax')) || 0.1,
        current: 0
      });
    });
  }

  // Returns true while any item is still drifting toward its target, so the
  // animation loop knows whether it still has work to do.
  function updateParallax(y) {
    if (!parallaxItems.length) return false;
    var vh = cache.viewH;
    var mid = vh / 2;
    var moving = false;

    parallaxItems.forEach(function (item) {
      var top = item.top - y;                                  // position on screen now
      if (top + item.height < -240 || top > vh + 240) return;   // offscreen, skip

      var centre = top + item.height / 2;
      var target = clamp((mid - centre) * item.speed, -item.limit, item.limit);

      // Close enough to have stopped being visible movement — snap and stop,
      // otherwise the lerp keeps producing ever-smaller deltas forever and the
      // loop can never go back to sleep.
      if (Math.abs(target - item.current) < 0.05) {
        item.current = target;
      } else {
        item.current = lerp(item.current, target, 0.14);
        moving = true;
      }

      var next = item.current.toFixed(2) + 'px';
      if (next !== item.last) {            // skip pointless style writes
        item.el.style.setProperty('--py', next);
        item.last = next;
      }
    });

    return moving;
  }


  /* ======================================================================
     7. MAGNETIC BUTTONS
     ====================================================================== */

  var magnets = [];

  if (animate && MOTION.magnetic && finePointer) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      var m = { el: el, tx: 0, ty: 0, cx: 0, cy: 0, strength: 0.32 };
      magnets.push(m);

      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        m.tx = (e.clientX - (r.left + r.width / 2)) * m.strength;
        m.ty = (e.clientY - (r.top + r.height / 2)) * m.strength;
        wake();
      });
      el.addEventListener('mouseleave', function () { m.tx = 0; m.ty = 0; wake(); });
    });
  }

  // Returns true while any button is still easing toward or away from the
  // cursor. A magnet that has arrived writes nothing and costs nothing.
  function updateMagnets() {
    var moving = false;

    magnets.forEach(function (m) {
      if (Math.abs(m.tx - m.cx) < 0.05 && Math.abs(m.ty - m.cy) < 0.05) {
        if (m.cx === m.tx && m.cy === m.ty) return;   // already settled, skip the write
        m.cx = m.tx;
        m.cy = m.ty;
      } else {
        m.cx = lerp(m.cx, m.tx, 0.16);
        m.cy = lerp(m.cy, m.ty, 0.16);
        moving = true;
      }
      m.el.style.setProperty('--mx', m.cx.toFixed(2) + 'px');
      m.el.style.setProperty('--my', m.cy.toFixed(2) + 'px');
    });

    return moving;
  }


  /* ======================================================================
     8. NAV STATE, PROGRESS BAR, ACTIVE LINK
     ====================================================================== */

  var nav = document.getElementById('nav');
  var progress = document.querySelector('.scroll-progress span');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  // On a project page the nav points back at the home page ("/#work"), which
  // is a URL and not a selector — handing it to querySelector throws, and an
  // uncaught throw here would take the rest of the script down with it,
  // including the code that dismisses the loading screen. Only plain "#id"
  // hrefs are looked up, and even those are guarded.
  var sections = navLinks
    .map(function (link) {
      var href = link.getAttribute('href') || '';
      if (href.charAt(0) !== '#' || href.length < 2) return null;
      try { return document.querySelector(href); } catch (e) { return null; }
    })
    .filter(Boolean);

  var lastProgress = -1;
  var lastCurrent = '';

  /* --- Process rail ---------------------------------------------------- */

  var stepsWrap = document.querySelector('.steps-wrap');
  var stepsFill = document.getElementById('stepsFill');
  var stepEls = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var lastFill = -1;
  var lastStep = -2;

  // Everything is compared against a line about 55% down the screen — roughly
  // where the eye sits while reading — rather than the top of the viewport.
  function updateSteps(y) {
    if (!stepsWrap || !cache.stepsHeight) return;

    var readLine = y + cache.viewH * 0.55;

    var filled = clamp(readLine - cache.stepsTop, 0, cache.stepsHeight);
    var pct = Math.round((filled / cache.stepsHeight) * 1000) / 10;
    if (pct !== lastFill) {
      if (stepsFill) stepsFill.style.height = pct + '%';
      lastFill = pct;
    }

    // The current step is the last one the read line has reached.
    var current = -1;
    cache.steps.forEach(function (s, i) {
      if (readLine >= s.top) current = i;
    });

    if (current !== lastStep) {
      stepEls.forEach(function (el, i) {
        el.classList.toggle('is-current', i === current);
        el.classList.toggle('is-passed', i < current);
      });
      lastStep = current;
    }
  }

  function updateChrome(y) {
    if (nav) nav.classList.toggle('is-stuck', y > 12);

    if (progress) {
      var max = maxScroll();
      var pct = max > 0 ? clamp((y / max) * 100, 0, 100) : 0;
      var rounded = Math.round(pct * 10) / 10;
      if (rounded !== lastProgress) {       // only touch the DOM when it changed
        progress.style.width = rounded + '%';
        lastProgress = rounded;
      }
    }

    var current = '';
    var midpoint = y + cache.viewH * 0.34;
    cache.sections.forEach(function (s) {
      if (s.top <= midpoint) current = s.id;
    });
    if (current !== lastCurrent) {
      navLinks.forEach(function (link) {
        link.classList.toggle('is-current', link.getAttribute('href') === '#' + current);
      });
      lastCurrent = current;
    }
  }


  /* ======================================================================
     THE ANIMATION LOOP
     ----------------------------------------------------------------------
     One loop drives scrolling, parallax and the magnets, so everything
     moves on the same heartbeat.
     ====================================================================== */

  function frame() {
    // One read of the scroll position per frame, then only writes. Mixing
    // reads and writes is what causes layout thrashing.
    var y = window.scrollY;
    var busy = false;

    if (useSmooth) {
      if (Math.abs(scrollTarget - scrollCurrent) > 0.08) {
        scrollCurrent = lerp(scrollCurrent, scrollTarget, MOTION.scrollEase);
        expectedScroll = scrollCurrent;
        window.scrollTo(0, scrollCurrent);
        y = scrollCurrent;
        busy = true;
      } else {
        scrollCurrent = scrollTarget;
      }
    }

    // Call both every frame — they each need to write this frame's position.
    // Assigning into `busy` afterwards avoids || short-circuiting one away.
    var parallaxBusy = updateParallax(y);
    var magnetsBusy = updateMagnets();
    updateChrome(y);
    updateSteps(y);

    if (parallaxBusy || magnetsBusy) busy = true;

    // Nothing left to animate: stop burning a frame 60 times a second and
    // wait to be woken by scrolling, pointer movement or a resize.
    if (busy) {
      rafId = requestAnimationFrame(frame);
    } else {
      rafId = 0;
    }
  }

  // Restart the loop if it has gone to sleep. Cheap enough to call from any
  // event handler — if the loop is already running this does nothing.
  function wake() {
    if (!rafId) rafId = requestAnimationFrame(frame);
  }

  // Take measurements, then start. Re-measure when the page can change size:
  // fonts swapping in and images loading both shift everything downward.
  // Re-measuring moves every parallax target, so the loop has to run again to
  // settle onto the new positions.
  function remeasure() { measure(); wake(); }

  measure();
  window.addEventListener('resize', remeasure);
  window.addEventListener('load', remeasure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
  document.querySelectorAll('.faq summary').forEach(function (s) {
    s.addEventListener('click', function () { setTimeout(remeasure, 620); });
  });

  updateChrome(window.scrollY);
  wake();


  /* ======================================================================
     9. WORK GRID
     ----------------------------------------------------------------------
     Nothing to run here any more. The category filter that used to live in
     this slot was removed along with its buttons — the six projects are
     simply all shown. The `data-cat` attributes are left on the cards in the
     markup in case filtering is ever wanted back.
     ====================================================================== */


  /* ======================================================================
     10. FAQ ACCORDION
     ====================================================================== */

  document.querySelectorAll('.qa').forEach(function (qa) {
    var summary = qa.querySelector('summary');
    var body = qa.querySelector('.qa__body');
    if (!summary || !body) return;

    body.style.height = qa.open ? 'auto' : '0px';

    summary.addEventListener('click', function (event) {
      event.preventDefault();

      if (!animate) {
        qa.open = !qa.open;
        body.style.height = qa.open ? 'auto' : '0px';
        return;
      }

      var isOpen = qa.open;
      var start = body.getBoundingClientRect().height;

      if (!isOpen) qa.open = true;
      body.style.height = start + 'px';
      var end = isOpen ? 0 : body.scrollHeight;

      requestAnimationFrame(function () {
        body.style.transition = 'height .55s cubic-bezier(.22,1,.36,1)';
        body.style.height = end + 'px';
      });

      body.addEventListener('transitionend', function done(e) {
        if (e.propertyName !== 'height') return;
        body.removeEventListener('transitionend', done);
        body.style.transition = '';
        if (isOpen) { qa.open = false; body.style.height = '0px'; }
        else { body.style.height = 'auto'; }
      });
    });
  });


  /* ======================================================================
     11. MOBILE MENU
     ====================================================================== */

  var menuBtn = document.getElementById('menuBtn');
  var mobileMenu = document.getElementById('mobileMenu');

  function setMenu(open) {
    if (!menuBtn || !mobileMenu) return;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.hidden = !open;
    document.body.classList.toggle('is-locked', open);
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) setMenu(false);
  });


  /* ======================================================================
     12. LOADING SCREEN
     ----------------------------------------------------------------------
     The percentage is tied to real work — fonts resolving and images
     arriving — rather than a number invented to look busy. It is smoothed
     on the way up so it reads as progress rather than as jumps.

     Three rules this obeys, in priority order:
       1. It always leaves. A hung image, a dead font CDN, a broken file —
          none of them can strand a visitor behind the overlay.
       2. It never flashes. Below `loaderMin` the screen would appear and
          vanish, which looks like a glitch rather than a design choice.
       3. The hero entrance starts only once the overlay is on its way out,
          so it is never spent behind a closed curtain.
     ====================================================================== */

  function initLoader() {
    var loader = document.getElementById('loader');

    // Whatever happens below, the page must end up unlocked and the hero
    // must end up running.
    function dismissInstantly() {
      root.classList.remove('is-loading');
      if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
      startHero();
    }

    if (!loader || !MOTION.loader) { dismissInstantly(); return; }

    if (MOTION.loaderOnce) {
      try {
        if (sessionStorage.getItem('ceng-seen-loader')) { dismissInstantly(); return; }
        sessionStorage.setItem('ceng-seen-loader', '1');
      } catch (e) {}                       // private browsing — just show it
    }

    var bar = document.getElementById('loaderBar');
    var pctEl = document.getElementById('loaderPct');
    var startedAt = Date.now();
    var shown = 0;                         // the number currently on screen
    var lastPainted = -1;
    var finished = false;

    /* --- What we are actually waiting for ------------------------------ */

    // The logo is part of the overlay, not the page, so it must not count
    // toward the page's own loading progress.
    var images = Array.prototype.slice.call(document.images).filter(function (img) {
      return !loader.contains(img);
    });

    var totalAssets = images.length + 1;   // +1 is the web fonts
    var readyAssets = 0;

    function assetSettled() { readyAssets++; }

    images.forEach(function (img) {
      if (img.complete) { assetSettled(); return; }
      img.addEventListener('load', assetSettled);
      // A broken image is still a settled one. Counting only successes would
      // let one bad file hold the percentage below 100 forever.
      img.addEventListener('error', assetSettled);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(assetSettled).catch(assetSettled);
    } else {
      assetSettled();
    }

    var pageComplete = document.readyState === 'complete';
    window.addEventListener('load', function () { pageComplete = true; });

    // Blends real asset progress with elapsed time. The time component stops
    // the bar sitting frozen at one number on a fast connection where
    // everything is already cached.
    function target() {
      var assets = totalAssets ? Math.min(readyAssets / totalAssets, 1) : 1;
      var elapsed = Math.min((Date.now() - startedAt) / MOTION.loaderMin, 1);
      if (pageComplete && readyAssets >= totalAssets && elapsed >= 1) return 100;
      return Math.min(assets * 72 + elapsed * 27, 99);
    }

    /* --- Painting ------------------------------------------------------- */

    /*
      The bar and the number are painted at different resolutions on purpose.

      The bar gets one decimal place every frame, so it slides continuously.
      The number only gets rewritten when the whole percent actually changes —
      it is text, and rewriting it 60 times a second to show the same value is
      wasted work. Rounding both to whole numbers made the bar visibly step.
    */
    function paint(value) {
      if (bar) bar.style.width = value.toFixed(1) + '%';

      var whole = Math.round(value);
      if (whole === lastPainted) return;
      lastPainted = whole;
      if (pctEl) pctEl.textContent = whole + '%';
    }

    function leave() {
      if (finished) return;
      finished = true;

      paint(100);
      root.classList.remove('is-loading');   // hand scrolling back
      loader.classList.add('is-out');        // lift the overlay away
      startHero();

      // Take it out of the document once it has gone, so it can never catch
      // a click. transitionend is belt, the timeout is braces.
      var strip = function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      };
      loader.addEventListener('transitionend', strip, { once: true });
      setTimeout(strip, 1500);
    }

    function tick() {
      if (finished) return;      // the failsafe timeout got here first
      var t = target();

      // Once everything really is in, close the gap faster — an eased approach
      // crawls the last few percent and reads as the bar stalling.
      shown += (t - shown) * (t === 100 ? 0.24 : 0.12);
      paint(shown);

      if (t === 100 && shown >= 99) {
        // Land on a full bar and a clean 100%, then hold it long enough to
        // actually be read before the screen goes. Finishing at 97% and
        // vanishing is the thing that makes a loader feel broken.
        paint(100);
        setTimeout(leave, 450);
        return;
      }

      requestAnimationFrame(tick);
    }

    // The hard stop. Nothing above is allowed to outlive this.
    setTimeout(leave, MOTION.loaderMax);

    requestAnimationFrame(tick);
  }

  initLoader();


  /* ======================================================================
     13. FOOTER YEAR
     ====================================================================== */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

})();
