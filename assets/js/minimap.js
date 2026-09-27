/* Page minimap: floating table of contents with scroll tracking (desktop only). */
(function () {
  function make(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function storage(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  window.buildMinimap = function (entries, opts) {
    opts = opts || {};
    entries = entries.filter(e => e && e.el);
    if (!entries.length || document.querySelector('.mm')) return;
    const offset = opts.offset || 72;

    const root = make('nav', 'mm');
    if (opts.top) root.style.setProperty('--mm-top', opts.top);
    if (opts.accent) root.style.setProperty('--mm-accent', opts.accent);
    root.setAttribute('aria-label', 'Page minimap');
    const head = make('div', 'mm-head');
    head.appendChild(make('span', 'mm-title', opts.title || 'on this page'));
    const toggle = make('button', 'mm-toggle');
    toggle.type = 'button';
    head.appendChild(toggle);
    root.appendChild(head);

    const body = make('div', 'mm-body');
    const rail = make('div', 'mm-rail-track');
    const fill = make('span', 'mm-rail-fill');
    rail.appendChild(fill);
    body.appendChild(rail);
    const list = make('ol', 'mm-list');
    body.appendChild(list);
    root.appendChild(body);

    const flat = [];
    let locked = null;
    function addLink(parentList, entry, level, parent) {
      const li = make('li', 'mm-item mm-level-' + level);
      const a = make('a', 'mm-link');
      a.href = '#';
      a.title = entry.label;
      a.appendChild(make('span', 'mm-dot'));
      a.appendChild(make('span', 'mm-label', entry.label));
      li.appendChild(a);
      parentList.appendChild(li);
      const rec = { a, li, el: entry.el, parent };
      flat.push(rec);
      a.addEventListener('click', ev => {
        ev.preventDefault();
        const details = entry.el.closest && entry.el.closest('details');
        if (details && !details.open) details.open = true;
        const y = entry.el.getBoundingClientRect().top + window.scrollY - offset;
        locked = rec;
        setActive(rec);
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
      if (entry.children && entry.children.length) {
        const sub = make('ol', 'mm-sub');
        li.appendChild(sub);
        entry.children.filter(c => c && c.el).forEach(c => addLink(sub, c, level + 1, rec));
      }
    }
    entries.forEach(e => addLink(list, e, 0, null));
    document.body.appendChild(root);

    function setCollapsed(c) {
      root.classList.toggle('mm-collapsed', c);
      toggle.textContent = c ? '+' : '–';
      toggle.setAttribute('aria-label', c ? 'Show minimap' : 'Hide minimap');
      toggle.setAttribute('aria-expanded', String(!c));
      storage('mm-collapsed', c ? '1' : '0');
    }
    toggle.addEventListener('click', () => setCollapsed(!root.classList.contains('mm-collapsed')));
    setCollapsed(storage('mm-collapsed') === '1');

    function fit() {
      const ref = opts.contentEl && opts.contentEl();
      if (!ref) return;
      const free = (window.innerWidth - ref.getBoundingClientRect().width) / 2;
      root.classList.toggle('mm-slim', free < 226);
    }

    let current = null;
    function setActive(active) {
      if (active !== current) {
        flat.forEach(r => r.li.classList.remove('mm-active', 'mm-active-parent'));
        active.li.classList.add('mm-active');
        for (let p = active.parent; p; p = p.parent) p.li.classList.add('mm-active-parent');
        current = active;
        const lt = active.li.offsetTop, lh = active.li.offsetHeight;
        if (lt < list.scrollTop || lt + lh > list.scrollTop + list.clientHeight) {
          list.scrollTo({ top: lt - list.clientHeight / 3, behavior: 'smooth' });
        }
      }
    }
    function spy() {
      if (!locked) {
        const line = offset + 48;
        let active = null;
        for (const r of flat) {
          if (r.el.offsetParent === null && r.el.tagName !== 'DETAILS') continue;
          if (r.el.getBoundingClientRect().top <= line) active = r;
        }
        setActive(active || flat[0]);
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.height = (max > 0 ? Math.min(1, window.scrollY / max) * 100 : 0) + '%';
    }
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; spy(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const unlock = () => { if (locked) { locked = null; onScroll(); } };
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(t => window.addEventListener(t, e => {
      if (!root.contains(e.target)) unlock();
    }, { passive: true }));
    window.addEventListener('resize', () => { fit(); spy(); });
    fit();
    spy();
  };

  /* Project pages: numbered <section>s with figure blocks underneath. */
  window.minimapFromSections = function () {
    const clean = t => t.replace(/\s+/g, ' ').replace(/^Fig\.\s*[—-]\s*/i, '').trim();
    const entries = [];
    document.querySelectorAll('main > section[id]').forEach(sec => {
      if (sec.id === 'home') return;
      const h2 = sec.querySelector('h2');
      if (!h2) return;
      const children = [];
      sec.querySelectorAll('.figure-block').forEach(b => {
        const lab = b.querySelector('.figure-label');
        if (lab) children.push({ label: clean(lab.textContent), el: b });
      });
      entries.push({ label: clean(h2.textContent), el: sec, children });
    });
    buildMinimap(entries, { offset: 76, contentEl: () => document.querySelector('main > section:not(#home) .container') });
  };
})();
