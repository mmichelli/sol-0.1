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
  // Click on the image or the card to re-render
  const reload = () => location.reload();
  for (const sel of ['#h', '.card']) {
    const el = document.querySelector(sel);
    if (el) el.addEventListener('click', reload);
  }
})();
