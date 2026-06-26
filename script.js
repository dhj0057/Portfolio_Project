/* ============================================================
   0/1 LOGIC — script.js
   Interactivity layer: vanilla JS (event model, IntersectionObserver,
   requestAnimationFrame) + jQuery (filter, modal, theme, mobile nav).
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $win = window;

  /* ---------- small helpers ---------- */
  function countUp(el, target, suffix, dur) {
    suffix = suffix || '';
    dur = dur || 1200;
    if (reduceMotion) { el.textContent = target + suffix; return; }
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);          // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ============================================================
     1. BOOT SEQUENCE — types terminal lines, then reveals the page
     ============================================================ */
  function runBoot() {
    const boot = document.getElementById('boot');
    const lines = Array.prototype.slice.call(document.querySelectorAll('.boot-line'));
    if (!boot) { afterBoot(); return; }

    if (reduceMotion) {
      setTimeout(function () { boot.classList.add('done'); afterBoot(); }, 300);
      return;
    }

    // reveal lines one by one
    lines.forEach(function (line, i) {
      line.style.opacity = '0';
      setTimeout(function () { line.style.opacity = '1'; }, 260 * i);
    });
    const total = 260 * lines.length + 500;
    setTimeout(function () {
      boot.classList.add('done');
      afterBoot();
    }, total);
  }

  /* ============================================================
     2. HERO TYPING EFFECT — types the headline with a blinking caret
     ============================================================ */
  function typeHeadline() {
    const el = document.getElementById('typed-headline');
    if (!el) return;
    const lines = ['ZERO SENTIMENT', '// ABSOLUTE LOGIC'];
    const full = lines.join('\n');

    if (reduceMotion) {
      el.innerHTML = lines.join('<br>') + '<span class="caret">_</span>';
      return;
    }
    let i = 0;
    function tick() {
      const slice = full.substring(0, i);
      el.innerHTML = slice.replace(/\n/g, '<br>') + '<span class="caret">_</span>';
      i++;
      if (i <= full.length) setTimeout(tick, 55);
    }
    tick();
  }

  /* ============================================================
     3. HERO STAT COUNTERS — count up once on load
     ============================================================ */
  function startHeroCounters() {
    document.querySelectorAll('.hero-stat b[data-count]').forEach(function (el) {
      countUp(el, parseInt(el.dataset.count, 10), el.dataset.suffix || '', 1100);
    });
  }

  // sequence after boot finishes
  function afterBoot() {
    typeHeadline();
    startHeroCounters();
    const hud = document.getElementById('hud');
    if (hud) setTimeout(function () { hud.classList.add('visible'); }, 600);
  }

  /* ============================================================
     4. INTERSECTION OBSERVER — scroll reveal + skill gauges
     ============================================================ */
  function initObservers() {
    const revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          if (e.target.classList.contains('skill-col')) animateSkill(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.18 });

    document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });

    if (reduceMotion) {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      document.querySelectorAll('.skill-col').forEach(animateSkill);
    }
  }

  function animateSkill(col) {
    const fill = col.querySelector('.fill');
    const pct = col.querySelector('.skill-pct');
    if (fill) {
      const target = fill.dataset.target;
      requestAnimationFrame(function () { fill.style.width = target + '%'; });
    }
    if (pct) countUp(pct, parseInt(pct.dataset.target, 10), '%', 1400);
  }

  /* ============================================================
     5. SCROLL ENGINE (rAF) — progress bar, header state,
        back-to-top, HUD scroll %, scrollspy (active nav + section)
     ============================================================ */
  function initScrollEngine() {
    const progress = document.getElementById('scroll-progress');
    const header = document.querySelector('header');
    const toTop = document.getElementById('back-to-top');
    const hudScroll = document.getElementById('hud-scroll');
    const hudSection = document.getElementById('hud-section');
    const navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    const sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
    let ticking = false;

    function update() {
      const st = $win.pageYOffset || document.documentElement.scrollTop;
      const docH = document.documentElement.scrollHeight - $win.innerHeight;
      const ratio = docH > 0 ? st / docH : 0;

      if (progress) progress.style.width = (ratio * 100) + '%';
      if (header) header.classList.toggle('scrolled', st > 40);
      if (toTop) toTop.classList.toggle('visible', st > 500);
      if (hudScroll) hudScroll.textContent = String(Math.round(ratio * 100)).padStart(3, '0') + '%';

      // scrollspy: section whose top crosses the upper third
      let current = sections[0];
      sections.forEach(function (sec) {
        if (sec.getBoundingClientRect().top <= $win.innerHeight * 0.35) current = sec;
      });
      if (current) {
        const id = current.id;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
        if (hudSection) hudSection.textContent = id.toUpperCase();
      }
      ticking = false;
    }

    $win.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ============================================================
     6. HUD CLOCK — live time readout
     ============================================================ */
  function initClock() {
    const clock = document.getElementById('hud-clock');
    if (!clock) return;
    function tick() {
      const d = new Date();
      const p = function (n) { return String(n).padStart(2, '0'); };
      clock.textContent = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ============================================================
     7. CUBE INSPECT — pause rotation while hovering (event model)
     ============================================================ */
  function initCube() {
    const cube = document.getElementById('cube-model');
    if (!cube || reduceMotion) return;
    cube.addEventListener('mouseenter', function () { cube.classList.add('paused'); });
    cube.addEventListener('mouseleave', function () { cube.classList.remove('paused'); });
  }

  /* ============================================================
     8. jQUERY LAYER — filter, modal, theme toggle, mobile nav
     ============================================================ */
  function initJQuery() {
    if (typeof window.jQuery === 'undefined') return;
    const $ = window.jQuery;

    /* --- 8a. Project filter (click event → DOM show/hide) --- */
    $('#filter-bar').on('click', '.filter-btn', function () {
      const filter = $(this).data('filter');
      $('.filter-btn').removeClass('is-active');
      $(this).addClass('is-active');

      let visible = 0;
      $('.project-card').each(function () {
        const match = filter === 'all' || $(this).data('category') === filter;
        $(this).toggleClass('is-hidden', !match);
        if (match) {
          visible++;
          // quick re-entry pop
          this.style.animation = 'none';
          void this.offsetWidth;
          this.style.opacity = '0';
          $(this).stop(true, true).animate({ opacity: 1 }, 280);
        }
      });
      $('#empty-state').prop('hidden', visible !== 0);
    });

    /* --- 8b. Project modal (open / close) --- */
    function openModal($card) {
      $('#modal-tag').text($card.find('.card-tag').text());
      $('#modal-title').text($card.data('title'));
      $('#modal-stack').text($card.data('stack'));
      $('#modal-desc').text($card.data('desc'));

      const $links = $('#modal-links').empty();
      const live = $card.data('live');
      const source = $card.data('source');
      if (live) $links.append('<a class="project-btn mono" target="_blank" rel="noopener noreferrer" href="' + live + '">LIVE DEMO</a>');
      if (source) $links.append('<a class="project-btn mono" target="_blank" rel="noopener noreferrer" href="' + source + '">SOURCE</a>');

      $('#modal').addClass('open').attr('aria-hidden', 'false');
      $('body').css('overflow', 'hidden');
    }
    function closeModal() {
      $('#modal').removeClass('open').attr('aria-hidden', 'true');
      $('body').css('overflow', '');
    }
    $('#project-grid').on('click', '.open-modal', function () {
      openModal($(this).closest('.project-card'));
    });
    $('.modal-close, .modal-overlay').on('click', closeModal);

    /* --- 8c. Theme toggle (light / dark) --- */
    function applyTheme(light) {
      $('body').toggleClass('light', light);
      $('#theme-toggle .ctrl-text').text(light ? 'LIGHT' : 'DARK');
      $('#theme-toggle .ctrl-icon').text(light ? '◑' : '◐');
    }
    let saved = null;
    try { saved = localStorage.getItem('dhj-theme'); } catch (e) {}
    if (saved === 'light') applyTheme(true);

    $('#theme-toggle').on('click', function () {
      const nowLight = !$('body').hasClass('light');
      applyTheme(nowLight);
      try { localStorage.setItem('dhj-theme', nowLight ? 'light' : 'dark'); } catch (e) {}
    });

    /* --- 8d. Mobile nav toggle --- */
    $('#nav-toggle').on('click', function () {
      const open = !$('nav').hasClass('open');
      $('nav').toggleClass('open', open);
      $(this).toggleClass('open', open).attr('aria-expanded', open);
    });
    $('.nav-link').on('click', function () {
      $('nav').removeClass('open');
      $('#nav-toggle').removeClass('open').attr('aria-expanded', 'false');
    });

    /* --- 8e. ESC closes modal + mobile nav --- */
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        closeModal();
        $('nav').removeClass('open');
        $('#nav-toggle').removeClass('open').attr('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initObservers();
    initScrollEngine();
    initClock();
    initCube();
    initJQuery();
    runBoot();
  });
})();
