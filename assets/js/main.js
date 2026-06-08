/* ═══════════════════════════════════════════════════
   911 WEBSITES — main.js
   Vanilla JS only. No dependencies.
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── FOOTER YEAR ────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── ROTATING TRADE PILL ────────────────────────── */
  const trades = ['HVAC', 'Plumbing', 'Electrical', 'Roofing'];
  const pill = document.getElementById('tradePill');
  let tradeIndex = 0;

  function rotateTrade() {
    if (!pill) return;
    pill.style.opacity = '0';
    setTimeout(() => {
      tradeIndex = (tradeIndex + 1) % trades.length;
      pill.textContent = trades[tradeIndex];
      pill.style.opacity = '1';
    }, 250);
  }

  if (pill) setInterval(rotateTrade, 2800);

  /* ── STICKY NAV SCROLL BEHAVIOR ─────────────────── */
  const nav = document.getElementById('nav');

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 10) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MOBILE NAV TOGGLE ──────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('nav--open', !expanded);
      // Prevent body scroll when nav is open
      document.body.style.overflow = expanded ? '' : 'hidden';
    });

    // Close nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('nav--open');
        document.body.style.overflow = '';
      });
    });

    // Close nav on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('nav--open');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });

    // Close nav when clicking outside
    document.addEventListener('click', e => {
      if (nav.classList.contains('nav--open') && !nav.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('nav--open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── INTERSECTION OBSERVER FADE-INS ─────────────── */
  const animateEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window && animateEls.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    animateEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    animateEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ── FAQ ACCORDION ──────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all other open items
      faqItems.forEach(other => {
        if (other === item) return;
        const otherBtn = other.querySelector('.faq-q');
        const otherAns = other.querySelector('.faq-a');
        if (otherBtn && otherAns) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAns.hidden = true;
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', String(!expanded));
      answer.hidden = expanded;
    });
  });

  /* ── LEAD FORM SUBMISSION ───────────────────────── */
  const form       = document.getElementById('leadForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg   = document.getElementById('formError');

  // Inline validation helpers
  const validators = {
    fullName:     val => val.trim().length >= 2,
    phone:        val => /^[\d\s\(\)\-\+\.]{7,}$/.test(val.trim()),
    businessName: val => val.trim().length >= 2,
    city:         val => val.trim().length >= 2,
  };

  const errorMessages = {
    fullName:     'Please enter your full name.',
    phone:        'Please enter a valid phone number.',
    businessName: 'Please enter your business name.',
    city:         'Please enter your city.',
  };

  function validateField(input) {
    const name    = input.name;
    const errEl   = document.getElementById(name + '-error');
    const isValid = validators[name] ? validators[name](input.value) : true;

    input.classList.toggle('is-invalid', !isValid);
    if (errEl) errEl.textContent = isValid ? '' : errorMessages[name] || 'Required.';
    return isValid;
  }

  function validateAll() {
    let allValid = true;
    Object.keys(validators).forEach(name => {
      const input = form.querySelector('[name="' + name + '"]');
      if (input && !validateField(input)) allValid = false;
    });
    return allValid;
  }

  if (form) {
    // Live validation on blur
    form.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();

      if (!validateAll()) return;

      // Guard against double-submit
      if (submitBtn.disabled) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      successMsg.hidden = true;
      errorMsg.hidden   = true;

      /*
        TODO: If the Formspree action URL is still set to YOUR_FORM_ID,
        replace it at https://formspree.io/f/YOUR_FORM_ID in the form action.
        This fetch will fail gracefully until then.
      */
      const action = form.getAttribute('action');
      const isPlaceholder = action.includes('YOUR_FORM_ID');

      if (isPlaceholder) {
        // Dev mode: simulate success so the UI can be previewed
        await new Promise(r => setTimeout(r, 800));
        successMsg.hidden = false;
        form.reset();
        submitBtn.disabled   = false;
        submitBtn.textContent = 'Get my free redesign →';
        console.warn('911 Websites: Formspree endpoint not yet set. Replace YOUR_FORM_ID in index.html.');
        return;
      }

      try {
        const data = new FormData(form);
        const res  = await fetch(action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          successMsg.hidden = false;
          form.reset();
          // Scroll to success message
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          throw new Error('Server error: ' + res.status);
        }
      } catch (err) {
        errorMsg.hidden = false;
        console.error('Form submission error:', err);
      } finally {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Get my free redesign →';
      }
    });
  }

  /* ── SMOOTH SCROLL FOR NAV CTA ──────────────────── */
  // Supplement native scroll-behavior with a focus move for accessibility
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;
      // Move focus to section for screen readers
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: true });
    });
  });

})();
