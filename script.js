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
   8.  Nav state, progress bar, active link
   9.  Work grid filtering
   10. FAQ accordion
   11. Mobile menu
   12. Footer year
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
    scrollEase:   0.115,  // higher = snappier scrolling, lower = floatier
    staggerStep:  85,     // milliseconds between items in a group
    wordStep:     55      // milliseconds between words in a heading
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

  /* Measurements are taken once and reused. Asking the browser for a position
     inside the animation loop forces it to redo layout 60 times a second,
     which is one of the classic reasons a "smooth" page stutters. */
  var cache = { docHeight: 0, viewH: 0, sections: [] };

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
    }, { passive: true });

    window.addEventListener('resize', function () {
      measure();                                   // sizes changed, re-read them
      scrollTarget = clamp(scrollTarget, 0, maxScroll());
    });
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

    // The hero is already on screen, so start it immediately
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

  function updateParallax(y) {
    if (!parallaxItems.length) return;
    var vh = cache.viewH;
    var mid = vh / 2;

    parallaxItems.forEach(function (item) {
      var top = item.top - y;                                  // position on screen now
      if (top + item.height < -240 || top > vh + 240) return;   // offscreen, skip

      var centre = top + item.height / 2;
      var target = clamp((mid - centre) * item.speed, -item.limit, item.limit);
      item.current = lerp(item.current, target, 0.14);

      var next = item.current.toFixed(2) + 'px';
      if (next !== item.last) {            // skip pointless style writes
        item.el.style.setProperty('--py', next);
        item.last = next;
      }
    });
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
      });
      el.addEventListener('mouseleave', function () { m.tx = 0; m.ty = 0; });
    });
  }

  function updateMagnets() {
    magnets.forEach(function (m) {
      m.cx = lerp(m.cx, m.tx, 0.16);
      m.cy = lerp(m.cy, m.ty, 0.16);
      if (Math.abs(m.cx) < 0.01 && Math.abs(m.cy) < 0.01) { m.cx = 0; m.cy = 0; }
      m.el.style.setProperty('--mx', m.cx.toFixed(2) + 'px');
      m.el.style.setProperty('--my', m.cy.toFixed(2) + 'px');
    });
  }


  /* ======================================================================
     8. NAV STATE, PROGRESS BAR, ACTIVE LINK
     ====================================================================== */

  var nav = document.getElementById('nav');
  var progress = document.querySelector('.scroll-progress span');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  var lastProgress = -1;
  var lastCurrent = '';

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

    if (useSmooth) {
      if (Math.abs(scrollTarget - scrollCurrent) > 0.08) {
        scrollCurrent = lerp(scrollCurrent, scrollTarget, MOTION.scrollEase);
        expectedScroll = scrollCurrent;
        window.scrollTo(0, scrollCurrent);
        y = scrollCurrent;
      } else {
        scrollCurrent = scrollTarget;
      }
    }

    updateParallax(y);
    updateMagnets();
    updateChrome(y);

    requestAnimationFrame(frame);
  }

  // Take measurements, then start. Re-measure when the page can change size:
  // fonts swapping in and images loading both shift everything downward.
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  document.querySelectorAll('.faq summary').forEach(function (s) {
    s.addEventListener('click', function () { setTimeout(measure, 620); });
  });

  updateChrome(window.scrollY);
  requestAnimationFrame(frame);


  /* ======================================================================
     9. WORK GRID FILTERING
     ====================================================================== */

  var chips = document.querySelectorAll('.chip[data-filter]');
  var cards = document.querySelectorAll('#workGrid .card');
  var emptyNote = document.getElementById('workEmpty');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.getAttribute('data-filter');

      chips.forEach(function (c) {
        var active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      var shown = 0;
      cards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-cat') === filter;
        card.classList.toggle('is-hidden', !match);
        if (match) {
          // Re-cascade the ones that remain, so filtering feels animated too
          card.style.setProperty('--d', (shown * 60) + 'ms');
          if (animate) {
            card.classList.remove('is-in');
            void card.offsetWidth;                 // forces the browser to restart it
            card.classList.add('is-in');
          }
          shown++;
        }
      });

      if (emptyNote) emptyNote.hidden = shown !== 0;
    });
  });


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
     12. FOOTER YEAR
     ====================================================================== */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

})();
