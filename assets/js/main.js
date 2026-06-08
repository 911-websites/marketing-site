/* ═══════════════════════════════════════════════════════════
   911 WEBSITES - v2 (vanilla, no dependencies)
   Rotating trade word · scroll reveals + stagger · nav ·
   live AI-chat typing · FAQ · form (Formspree + validation)
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Footer year ───────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Rotating trade word ───────────────────────── */
  var trades = ['HVAC', 'Plumbing', 'Electrical', 'Roofing'];
  var trade = document.getElementById('trade');
  var ti = 0;
  if (trade && !reduceMotion) {
    setInterval(function () {
      trade.style.opacity = '0';
      setTimeout(function () {
        ti = (ti + 1) % trades.length;
        trade.textContent = trades[ti];
        trade.style.opacity = '1';
      }, 240);
    }, 2600);
  }

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

  // Failsafe: never leave above-the-fold content hidden if IO is slow/blocked.
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.querySelectorAll('[data-reveal]:not(.in)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.1) el.classList.add('in');
      });
    }, 250);
  });

  /* ── Live AI chat typing ───────────────────────── */
  var feed = document.getElementById('chatFeed');
  var script = [
    { who: 'ai',   text: 'Hi, need service today? I can book you in right now.' },
    { who: 'user', text: 'My AC just died and it is 11pm.' },
    { who: 'ai',   text: 'No problem. Can I grab your name and a callback number?' },
    { who: 'user', text: 'Mike Torres, (602) 555-0192.' },
    { who: 'ai',   text: 'Thanks Mike. A tech can be there at 7am. Want me to lock it in?' }
  ];

  function bubble(item) {
    var b = document.createElement('div');
    b.className = 'msg msg--' + item.who;
    b.textContent = item.text;
    return b;
  }

  function runChat() {
    if (!feed) return;
    feed.innerHTML = '';
    if (reduceMotion) {
      script.forEach(function (m) {
        var b = bubble(m);
        b.style.opacity = '1';
        b.style.transform = 'none';
        b.style.animation = 'none';
        feed.appendChild(b);
      });
      return;
    }
    var i = 0;
    (function next() {
      if (i >= script.length) return;
      feed.appendChild(bubble(script[i]));
      // keep the latest messages in view inside the card
      feed.scrollTop = feed.scrollHeight;
      i++;
      setTimeout(next, i === 1 ? 600 : 1150);
    })();
  }

  // Start the chat when the card scrolls into view (motion must be motivated + visible)
  if (feed) {
    if ('IntersectionObserver' in window) {
      var chatIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runChat(); chatIO.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      chatIO.observe(feed.closest('.chatcard') || feed);
    } else {
      runChat();
    }
  }

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

  /* ── Lead form ─────────────────────────────────── */
  var form = document.getElementById('leadForm');
  var submitBtn = document.getElementById('submitBtn');
  var okMsg = document.getElementById('okMsg');
  var errMsg = document.getElementById('errMsg');

  var rules = {
    fullName: function (v) { return v.trim().length >= 2; },
    phone:    function (v) { return /^[\d\s()+\-.]{7,}$/.test(v.trim()); },
    business: function (v) { return v.trim().length >= 2; },
    city:     function (v) { return v.trim().length >= 2; }
  };
  var errs = {
    fullName: 'Please enter your full name.',
    phone:    'Please enter a valid phone number.',
    business: 'Please enter your business name.',
    city:     'Please enter your city.'
  };

  function validate(input) {
    var ok = rules[input.name] ? rules[input.name](input.value) : true;
    var e = document.getElementById('e-' + input.name);
    input.classList.toggle('invalid', !ok);
    if (e) e.textContent = ok ? '' : (errs[input.name] || 'Required.');
    return ok;
  }

  if (form) {
    form.querySelectorAll('input[name]').forEach(function (input) {
      if (!rules[input.name]) return;
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () { if (input.classList.contains('invalid')) validate(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allOk = true;
      Object.keys(rules).forEach(function (n) {
        var input = form.querySelector('[name="' + n + '"]');
        if (input && !validate(input)) allOk = false;
      });
      if (!allOk || submitBtn.disabled) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      okMsg.hidden = true; errMsg.hidden = true;

      var action = form.getAttribute('action');
      if (action.indexOf('YOUR_FORM_ID') !== -1) {
        // Endpoint not set yet: simulate success so the UI is previewable.
        setTimeout(function () {
          okMsg.hidden = false;
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Get my free redesign';
          console.warn('911 Websites: set your Formspree endpoint (replace YOUR_FORM_ID in index.html).');
        }, 700);
        return;
      }

      fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (res.ok) { okMsg.hidden = false; form.reset(); okMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
          else throw new Error('status ' + res.status);
        })
        .catch(function (err) { errMsg.hidden = false; console.error(err); })
        .finally(function () { submitBtn.disabled = false; submitBtn.textContent = 'Get my free redesign'; });
    });
  }

  /* ── Anchor focus for a11y ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var id = this.getAttribute('href').slice(1);
      var t = document.getElementById(id);
      if (!t) return;
      if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
      t.focus({ preventScroll: true });
    });
  });

})();
