(function() {
  if (typeof solutions === 'undefined') return;
  if (!document.documentElement.classList.contains('embedded')) {
    const back = document.createElement('a');
    back.href = '../index.html';
    back.className = 'back';
    back.innerHTML = '<svg viewBox="0 0 24 16" aria-hidden="true"><path d="M8 3 L2 8 L8 13 M2 8 L22 8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>index</span>';
    document.body.insertBefore(back, document.body.firstChild);
  }
  const chosen = solutions[Math.floor(Math.random() * solutions.length)];
  const el = document.getElementById('strategy');
  if (el) el.textContent = chosen.strategy ? '→ ' + chosen.strategy : '';
  new p5((p) => {
    p.setup = () => {
      const c = p.createCanvas(720, 720); c.parent('h'); p.noLoop(); p.background(255);
      chosen.draw(p);
    };
  });
})();
