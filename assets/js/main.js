/* ═══════════════════════════════════════════════════════════
   911 WEBSITES - A/B test site (vanilla, no dependencies)
   Language manager (EN/FR, persistent) · rotating trade word ·
   scroll reveals + stagger · nav · FAQ · demo form (mailto)
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.body.getAttribute('data-page') || '';
  var STORE_KEY = '911_lang';

  /* ── Niche (outreach personalization via ?niche=) ── */
  var nicheKey = null;
  try {
    var qp = new URLSearchParams(window.location.search).get('niche');
    if (qp && window.NICHES && window.NICHES[qp.toLowerCase()]) nicheKey = qp.toLowerCase();
  } catch (e) {}

  function nicheTokens() {
    if (!nicheKey || !window.NICHES) return null;
    var n = window.NICHES[nicheKey];
    return (n && n[lang]) || null;
  }

  function applyNiche() {
    var tok = nicheTokens();
    if (!tok) return;
    document.querySelectorAll('[data-niche-token]').forEach(function (el) {
      var v = tok[el.getAttribute('data-niche-token')];
      if (typeof v === 'string') el.textContent = v;
    });
    // Swap the hero photo so the visual never contradicts the trade
    var img = document.querySelector('[data-niche-img]');
    if (img) {
      var n = window.NICHES[nicheKey];
      if (n && n.img) img.setAttribute('src', n.img);
      if (typeof tok.alt === 'string') img.setAttribute('alt', tok.alt);
    }
  }

  /* ── Language manager ──────────────────────────── */
  var dicts = window.I18N || { en: {}, fr: {} };

  function detectLang() {
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    if (saved === 'fr' || saved === 'en') return saved;
    var nav = (navigator.language || 'en').toLowerCase();
    return nav.indexOf('fr') === 0 ? 'fr' : 'en';
  }

  var lang = detectLang();

  function t(key) {
    var d = dicts[lang] || {};
    return Object.prototype.hasOwnProperty.call(d, key) ? d[key] : null;
  }

  function applyLang(next) {
    lang = next;
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
    document.documentElement.setAttribute('lang', lang);

    // Plain-text nodes
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (typeof v === 'string') el.textContent = v;
    });
    // Nodes whose translation embeds markup (accent spans). Values come
    // from our own static dictionary only; no user input is involved.
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-html'));
      if (typeof v === 'string') el.innerHTML = v;
    });
    // Placeholders + meta content
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-placeholder'));
      if (typeof v === 'string') el.setAttribute('placeholder', v);
    });
    document.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-content'));
      if (typeof v === 'string') el.setAttribute('content', v);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-alt'));
      if (typeof v === 'string') el.setAttribute('alt', v);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-aria'));
      if (typeof v === 'string') el.setAttribute('aria-label', v);
    });

    // Toggle state
    document.querySelectorAll('.lang button').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });

    // Reset the rotating trade word, then apply niche tokens on top
    resetTrade();
    applyNiche();
  }

  document.querySelectorAll('.lang button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = btn.getAttribute('data-lang');
      if (next && next !== lang) applyLang(next);
    });
  });

  /* ── Rotating trade word (variant A hero) ──────── */
  var tradeEl = document.getElementById('tradeWord');
  var tradeIdx = 0;
  var tradeTimer = null;

  function tradeList() {
    var arr = t('a.hero.trades');
    return Array.isArray(arr) && arr.length ? arr : null;
  }

  function resetTrade() {
    if (!tradeEl) return;
    if (tradeTimer) { clearInterval(tradeTimer); tradeTimer = null; }
    // A niche link fixes the trade word: no rotation, targeted messaging.
    var tok = nicheTokens();
    if (tok && tok.pill) { tradeEl.textContent = tok.pill; return; }
    var arr = tradeList();
    if (!arr) return;
    tradeIdx = 0;
    tradeEl.textContent = arr[0];
    if (!reduceMotion) {
      tradeTimer = setInterval(function () {
        tradeEl.style.opacity = '0';
        setTimeout(function () {
          var list = tradeList();
          if (!list) return;
          tradeIdx = (tradeIdx + 1) % list.length;
          tradeEl.textContent = list[tradeIdx];
          tradeEl.style.opacity = '1';
        }, 240);
      }, 2600);
    }
  }

  /* ── Initial language pass ─────────────────────── */
  applyLang(lang);

  /* ── Footer year ───────────────────────────────── */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ── Nav: scrolled state + mobile menu ─────────── */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  function closeMenu() {
    if (!nav || !burger) return;
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
      document.body.style.overflow = open ? '' : 'hidden';
    });
    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); burger.focus(); }
    });
  }

  /* ── Stagger indices ───────────────────────────── */
  document.querySelectorAll('.stagger').forEach(function (c) {
    Array.prototype.forEach.call(c.children, function (child, i) {
      child.style.setProperty('--i', i);
    });
  });
  // Cascade indices for chat + digest cards
  document.querySelectorAll('.chatcard .msg, .digest__row').forEach(function (el) {
    if (!el.style.getPropertyValue('--i')) {
      var sibs = Array.prototype.slice.call(el.parentNode.children).filter(function (n) {
        return n.classList.contains('msg') || n.classList.contains('digest__row');
      });
      el.style.setProperty('--i', sibs.indexOf(el));
    }
  });

  /* ── Scroll reveals ────────────────────────────── */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }
  // Failsafe: never leave above-the-fold content hidden.
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.querySelectorAll('[data-reveal]:not(.in)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.1) el.classList.add('in');
      });
    }, 250);
  });

  /* ── Testimonial carousel (desktop + mobile) ───── */
  document.querySelectorAll('.carousel').forEach(function (car) {
    var track = car.querySelector('.carousel__track');
    var prev = car.querySelector('.carousel__btn--prev');
    var next = car.querySelector('.carousel__btn--next');
    if (!track || !prev || !next) return;
    function step() {
      var card = track.querySelector('.quote');
      return card ? card.getBoundingClientRect().width + 16 : 320;
    }
    prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  });

  /* ── FAQ accordion ─────────────────────────────── */
  var qaItems = document.querySelectorAll('.qa');
  qaItems.forEach(function (item) {
    var btn = item.querySelector('.qa__q');
    var ans = item.querySelector('.qa__a');
    if (!btn || !ans) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      qaItems.forEach(function (other) {
        var ob = other.querySelector('.qa__q'), oa = other.querySelector('.qa__a');
        if (ob && oa && other !== item) { ob.setAttribute('aria-expanded', 'false'); oa.hidden = true; }
      });
      btn.setAttribute('aria-expanded', String(!open));
      ans.hidden = open;
    });
  });

  /* ── Demo form: builds a mailto (no backend) ───── */
  var form = document.getElementById('demoForm');
  if (form) {
    var nameInput = form.querySelector('[name="name"]');
    var phoneInput = form.querySelector('[name="phone"]');
    var msgInput = form.querySelector('[name="message"]');

    function setErr(input, key) {
      var el = document.getElementById('e-' + input.name);
      var msg = key ? t(key) : '';
      input.classList.toggle('invalid', !!key);
      if (el) el.textContent = msg || '';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      if (!nameInput.value || nameInput.value.trim().length < 2) { setErr(nameInput, 'c.form.err.name'); ok = false; } else setErr(nameInput, null);
      if (!/^[\d\s()+\-.]{7,}$/.test(phoneInput.value.trim())) { setErr(phoneInput, 'c.form.err.phone'); ok = false; } else setErr(phoneInput, null);
      if (!ok) return;

      var subjKey = form.getAttribute('data-subject-key');
      var subject = t(subjKey) || 'Demo request';
      var body =
        t('c.form.name') + ': ' + nameInput.value.trim() + '\n' +
        t('c.form.phone') + ': ' + phoneInput.value.trim() + '\n\n' +
        (msgInput && msgInput.value.trim() ? msgInput.value.trim() + '\n\n' : '') +
        'Lang: ' + lang.toUpperCase() + ' / Page: /' + (page === 'a' ? 'website' : page === 'b' ? 'reception' : page === 'crm' ? 'crm' : '');

      window.location.href = 'mailto:team@911websites.co' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  /* ── Anchor focus for a11y ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var id = this.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

})();
