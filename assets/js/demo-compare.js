/* ═══════════════════════════════════════════════════════════
   911 WEBSITES - Before / After selector (/demo)
   Progressive enhancement: without JS the page shows both
   frames stacked and labelled, so the comparison still works.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  var tablist = document.querySelector('[data-cmp-tabs]');
  if (!tablist) return;

  var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
  var urlBar = document.querySelector('[data-cmp-url]');
  if (!tabs.length) return;

  function panelFor(tab) {
    return document.getElementById(tab.getAttribute('aria-controls'));
  }

  function select(tab, focus) {
    tabs.forEach(function (t) {
      var isTarget = t === tab;
      var panel = panelFor(t);
      var caption = document.querySelector('[data-cmp-caption="' + t.dataset.cmpKey + '"]');

      t.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      t.tabIndex = isTarget ? 0 : -1;

      if (panel) {
        if (isTarget) panel.setAttribute('data-active', '');
        else panel.removeAttribute('data-active');
      }
      if (caption) caption.hidden = !isTarget;
    });

    if (urlBar && tab.dataset.cmpUrl) urlBar.textContent = tab.dataset.cmpUrl;
    if (focus) tab.focus();
  }

  tablist.addEventListener('click', function (e) {
    var tab = e.target.closest('[role="tab"]');
    if (tab) select(tab, false);
  });

  tablist.addEventListener('keydown', function (e) {
    var i = tabs.indexOf(document.activeElement);
    if (i === -1) return;
    var next;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (e.key === 'Home') next = tabs[0];
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    else return;

    e.preventDefault();
    select(next, true);
  });

  // Establish the initial state from the markup's selected tab.
  var initial = tabs.filter(function (t) {
    return t.getAttribute('aria-selected') === 'true';
  })[0] || tabs[0];
  select(initial, false);
})();
