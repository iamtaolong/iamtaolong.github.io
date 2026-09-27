/* Hover easter egg on the profile photo: peaches pop out and bounce. */
(function () {
  const photo = document.getElementById('profile-photo');
  if (!photo || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2000;overflow:hidden;';
  document.body.appendChild(layer);

  let running = false;
  const rand = (a, b) => a + Math.random() * (b - a);

  function spawn(size) {
    const n = document.createElement('span');
    n.textContent = '\u{1F351}';
    n.style.cssText = `position:absolute;left:0;top:0;font-size:${size}px;line-height:1;will-change:transform,opacity;`;
    layer.appendChild(n);
    return n;
  }

  function burst() {
    if (running) return;
    running = true;
    const r = photo.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height * 0.42;
    const parts = [];

    for (let i = 0; i < 24; i++) {
      const size = rand(18, 36);
      const ang = rand(-Math.PI * 0.92, -Math.PI * 0.08);
      const sp = rand(5, 12);
      parts.push({ el: spawn(size), x: cx - size / 2, y: cy - size / 2, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        rot: rand(-30, 30), vr: rand(-12, 12), size, life: rand(95, 135), age: 0, bounce: 0.55 });
    }

    photo.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.94)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }],
      { duration: 420, easing: 'ease-out' });

    const g = 0.45;
    function step() {
      const floor = photo.getBoundingClientRect().bottom + 8;
      let alive = 0;
      for (const p of parts) {
        if (p.done) continue;
        p.age++;
        p.vy += g;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y + p.size > floor && p.vy > 0) {
          p.y = floor - p.size;
          p.vy *= -p.bounce;
          p.vx *= 0.82;
          p.vr *= 0.7;
        }
        const fade = Math.max(0, Math.min(1, (p.life - p.age) / 25));
        p.el.style.opacity = fade;
        p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`;
        if (p.age >= p.life) { p.done = true; p.el.remove(); } else alive++;
      }
      if (alive) requestAnimationFrame(step);
      else running = false;
    }
    requestAnimationFrame(step);
  }

  photo.addEventListener('mouseenter', burst);
})();
