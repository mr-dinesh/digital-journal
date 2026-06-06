let _Q = [];
fetch('/data/npp-quotes.json')
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(d => { _Q = d; nppNext(); })
  .catch(() => {
    const q = document.getElementById('npp-q');
    if (q) q.textContent = 'Quotes unavailable.';
  });
function nppNext() {
  if (!_Q.length) return;
  const r = _Q[Math.floor(Math.random() * _Q.length)];
  document.getElementById('npp-q').textContent = r.quote;
  document.getElementById('npp-a').textContent = '— ' + r.author;
}
document.getElementById('npp-next-btn').addEventListener('click', nppNext);
