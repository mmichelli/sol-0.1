(function() {
  if (typeof solutions === 'undefined') return;
  if (!document.documentElement.classList.contains('embedded')) {
    const back = document.createElement('a');
    back.href = '../index.html';
    back.className = 'back';
    back.textContent = '← index';
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
