// Bangalore Weather Daily: a customisable view of the daily CSV published by
// github.com/skthewimp/bangalore-weather. Everything is computed in the
// browser from one file (DT,High,Low,Rain; one row per day since 1981).
(function () {
  "use strict";

  const SRC = "/api/blr-weather";
  const MAX_DAYS = 1096; // three years; past that the bars stop meaning anything
  const RAINY_MM = 2.5;
  const SVGNS = "http://www.w3.org/2000/svg";
  const CMP_VARS = ["--c1", "--c2", "--c3"];

  const WINDOWS = [
    ["7", "7d"], ["14", "14d"], ["30", "30d"], ["45", "45d"], ["90", "90d"],
    ["ytd", "YTD"], ["sw", "SW monsoon"], ["ne", "NE monsoon"], ["365", "1y"], ["custom", "Custom"],
  ];
  const PANELS = {
    temp: "Temperature",
    rain: "Daily rain",
    cum: "Cumulative rain",
    anom: "Anomaly",
    stats: "Counts & streaks",
  };
  const DEFAULT_PANELS = ["temp", "rain", "cum", "anom", "stats"];

  // ---------- data ----------
  let D = [], HI, LO, RN, IDX = new Map();
  let byMD = new Map();           // "MM-DD" -> row indices (Feb 29 folds into Feb 28)
  let NH = {}, NL = {}, NR = {}, P90 = {};
  let LAST = "", FIRST = "";

  const mdOf = (d) => { const m = d.slice(5); return m === "02-29" ? "02-28" : m; };
  const yearOf = (d) => +d.slice(0, 4);

  function median(a) {
    const s = Float64Array.from(a).sort(), n = s.length;
    return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  }
  function quantile(sorted, q) {
    const pos = (sorted.length - 1) * q, lo = Math.floor(pos), hi = Math.ceil(pos);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
  }

  function parse(text) {
    const lines = text.trim().split(/\r?\n/);
    const n = lines.length - 1;
    HI = new Float64Array(n); LO = new Float64Array(n); RN = new Float64Array(n);
    D = new Array(n);
    for (let i = 0; i < n; i++) {
      const [dt, h, l, r] = lines[i + 1].split(",");
      D[i] = dt; HI[i] = +h; LO[i] = +l; RN[i] = Math.max(0, +r || 0);
      IDX.set(dt, i);
      const md = mdOf(dt);
      if (!byMD.has(md)) byMD.set(md, []);
      byMD.get(md).push(i);
    }
    FIRST = D[0]; LAST = D[n - 1];

    // calendar order of the 365 MM-DD keys
    const order = [];
    for (let t = Date.UTC(2001, 0, 1); t < Date.UTC(2002, 0, 1); t += 864e5) order.push(new Date(t).toISOString().slice(5, 10));
    const meanRain = order.map((md) => { const ix = byMD.get(md); let s = 0; ix.forEach((i) => (s += RN[i])); return s / ix.length; });
    order.forEach((md, k) => {
      const ix = byMD.get(md);
      NH[md] = median(ix.map((i) => HI[i]));
      NL[md] = median(ix.map((i) => LO[i]));
      let s = 0, pool = [];
      for (let o = -7; o <= 7; o++) {
        const m2 = order[(k + o + 365) % 365];
        s += meanRain[(k + o + 365) % 365];
        byMD.get(m2).forEach((i) => pool.push(HI[i]));
      }
      NR[md] = s / 15;
      P90[md] = quantile(Float64Array.from(pool).sort(), 0.9);
    });
  }

  // Record for row i's date, from every other year.
  function rec(i) {
    const y = yearOf(D[i]);
    let rh = -Infinity, rl = Infinity;
    for (const j of byMD.get(mdOf(D[i]))) {
      if (yearOf(D[j]) === y) continue;
      if (HI[j] > rh) rh = HI[j];
      if (LO[j] < rl) rl = LO[j];
    }
    return { rh, rl };
  }

  // ---------- dates ----------
  const iso = (t) => new Date(t).toISOString().slice(0, 10);
  const ms = (d) => Date.parse(d + "T00:00:00Z");
  const addDays = (d, k) => iso(ms(d) + k * 864e5);
  const fmtDay = (d, opts) => new Date(ms(d)).toLocaleDateString("en-IN", Object.assign({ timeZone: "UTC", day: "numeric", month: "short" }, opts || {}));
  const fmtLong = (d) => fmtDay(d, { year: "numeric", weekday: "short" });
  const clampDate = (d) => (d < FIRST ? FIRST : d > LAST ? LAST : d);
  const ord = (n) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
  const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1);
  const mm = (v) => (v < 0.1 ? (v > 0 ? "trace" : "0 mm") : f1(v) + " mm");
  const sgn = (v) => (v > 0 ? "+" : v < 0 ? "−" : "±") + f1(Math.abs(v));

  // Shift a date into another year, keeping MM-DD (Feb 29 -> Feb 28 when absent).
  function shiftYear(d, dy) {
    let s = (yearOf(d) - dy) + d.slice(4);
    if (!IDX.has(s) && d.slice(5) === "02-29") s = s.slice(0, 5) + "02-28";
    return s;
  }

  // ---------- state ----------
  const state = { w: "45", f: "", t: "", d: "", c: [], p: DEFAULT_PANELS.slice(), hidden: [] };

  function readHash() {
    const h = new URLSearchParams(location.hash.slice(1));
    if (h.get("w") && WINDOWS.some(([k]) => k === h.get("w"))) state.w = h.get("w");
    if (h.get("f")) state.f = h.get("f");
    if (h.get("t")) state.t = h.get("t");
    if (h.get("d")) state.d = h.get("d");
    if (h.get("c")) state.c = h.get("c").split(",").map(Number).filter((y) => y >= 1981).slice(0, 3);
    let p = h.get("p");
    if (!p) { try { p = localStorage.getItem("blrw-panels"); } catch (e) {} }
    if (p) {
      const items = p.split(",");
      const keys = items.map((s) => s.replace(/^-/, "")).filter((k) => PANELS[k]);
      DEFAULT_PANELS.forEach((k) => { if (!keys.includes(k)) keys.push(k); });
      state.p = [...new Set(keys)];
      state.hidden = items.filter((s) => s[0] === "-").map((s) => s.slice(1));
    }
  }
  function panelsParam() { return state.p.map((k) => (state.hidden.includes(k) ? "-" + k : k)).join(","); }
  function writeHash() {
    const h = new URLSearchParams();
    h.set("w", state.w);
    if (state.w === "custom") { h.set("f", state.f); h.set("t", state.t); }
    if (state.d && state.d !== LAST) h.set("d", state.d);
    if (state.c.length) h.set("c", state.c.join(","));
    const p = panelsParam();
    if (p !== DEFAULT_PANELS.join(",")) h.set("p", p);
    history.replaceState(null, "", "#" + h.toString());
    try { localStorage.setItem("blrw-panels", p); } catch (e) {}
  }

  // Resolve the window to [from, to] date strings.
  function resolveWindow() {
    const end = LAST, ey = yearOf(end);
    let from, to = end;
    switch (state.w) {
      case "ytd": from = ey + "-01-01"; break;
      case "sw": { const y = end >= ey + "-06-01" ? ey : ey - 1; from = y + "-06-01"; to = y + "-09-30"; break; }
      case "ne": { const y = end >= ey + "-10-01" ? ey : ey - 1; from = y + "-10-01"; to = y + "-12-31"; break; }
      case "custom": {
        from = clampDate(state.f || addDays(end, -44)); to = clampDate(state.t || end);
        if (from > to) [from, to] = [to, from];
        break;
      }
      default: from = addDays(end, -(+state.w - 1));
    }
    to = clampDate(to); from = clampDate(from);
    if ((ms(to) - ms(from)) / 864e5 + 1 > MAX_DAYS) from = addDays(to, -(MAX_DAYS - 1));
    return [from, to];
  }

  // ---------- window model ----------
  function buildModel() {
    const [from, to] = resolveWindow();
    const a = IDX.get(from), b = IDX.get(to);
    const days = [];
    for (let i = a; i <= b; i++) {
      const md = mdOf(D[i]), r = rec(i);
      days.push({
        i, d: D[i], md, hi: HI[i], lo: LO[i], rain: RN[i],
        nh: NH[md], nl: NL[md], nr: NR[md], p90: P90[md], rh: r.rh, rl: r.rl,
      });
    }
    const n = days.length, endYear = yearOf(to);

    // Compare years: same window shifted back by whole years.
    const cmp = state.c.map((y, k) => {
      const dy = endYear - y;
      let cum = 0;
      const pts = days.map((p) => {
        const j = IDX.get(shiftYear(p.d, dy));
        if (j === undefined) return null;
        cum += RN[j];
        return { hi: HI[j], lo: LO[j], rain: RN[j], cum, d: D[j] };
      });
      return { y, k, pts, label: String(dy === 0 ? y : labelFor(from, to, dy)) };
    });

    // Cumulative-rain percentiles over every past year that covers the window.
    const curves = [];
    for (let dy = 1; ; dy++) {
      if (!IDX.has(shiftYear(from, dy))) break;
      let cum = 0;
      curves.push(days.map((p) => { const j = IDX.get(shiftYear(p.d, dy)); cum += j === undefined ? 0 : RN[j]; return cum; }));
    }
    const pct = days.map((_, x) => {
      const s = Float64Array.from(curves.map((c) => c[x])).sort();
      return s.length ? { p10: quantile(s, 0.1), p50: quantile(s, 0.5), p90: quantile(s, 0.9) } : null;
    });
    let cum = 0;
    days.forEach((p) => { cum += p.rain; p.cum = cum; });

    return { from, to, days, n, cmp, pct, years: curves.length };
  }

  // Window that crosses a year boundary gets labelled "2015–16".
  function labelFor(from, to, dy) {
    const a = yearOf(from) - dy, b = yearOf(to) - dy;
    return a === b ? String(a) : a + "–" + String(b).slice(2);
  }

  // ---------- svg helpers ----------
  function el(tag, attrs, parent) {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function h(tag, attrs, html) {
    const e = document.createElement(tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function niceTicks(lo, hi, target) {
    const span = hi - lo || 1, raw = span / target, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= target) || 10 * mag;
    const out = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(6));
    return out;
  }
  function path(points) {
    let s = "", pen = false;
    for (const p of points) {
      if (!p) { pen = false; continue; }
      s += (pen ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1);
      pen = true;
    }
    return s;
  }
  function area(xs, top, bot) {
    let s = "";
    xs.forEach((x, k) => (s += (k ? "L" : "M") + x.toFixed(1) + "," + top[k].toFixed(1)));
    for (let k = xs.length - 1; k >= 0; k--) s += "L" + xs[k].toFixed(1) + "," + bot[k].toFixed(1);
    return s + "Z";
  }
  // Bar rounded only at the data end (top for positive, bottom for negative).
  function bar(x, y0, y1, w, r) {
    const top = Math.min(y0, y1), hgt = Math.abs(y1 - y0);
    r = Math.max(0, Math.min(r, w / 2, hgt));
    if (r < 0.5) return `M${x},${top}h${w}v${hgt}h${-w}Z`;
    return `M${x},${top + hgt}V${top + r}q0,${-r} ${r},${-r}h${w - 2 * r}q${r},0 ${r},${r}V${top + hgt}Z`;
  }
  function barDown(x, y0, y1, w, r) {
    const hgt = Math.abs(y1 - y0); r = Math.max(0, Math.min(r, w / 2, hgt));
    if (r < 0.5) return `M${x},${y0}h${w}v${hgt}h${-w}Z`;
    return `M${x},${y0}V${y0 + hgt - r}q0,${r} ${r},${r}h${w - 2 * r}q${r},0 ${r},${-r}V${y0}Z`;
  }
  const cssVar = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

  // Common frame: x positions per day, y scale, gridlines, date axis.
  function frame(svg, m, W, H, ylo, yhi, yfmt, ticksN) {
    const P = { l: 40, r: m.cmp.length ? 44 : 12, t: 8, b: 22 };
    const n = m.n, bw = (W - P.l - P.r) / n;
    const x = (k) => P.l + (k + 0.5) * bw;
    const y = (v) => P.t + (H - P.t - P.b) * (1 - (v - ylo) / (yhi - ylo || 1));
    niceTicks(ylo, yhi, ticksN || 5).forEach((v) => {
      el("line", { class: "g-grid", x1: P.l, x2: W - P.r, y1: y(v), y2: y(v) }, svg);
      el("text", { class: "g-ax", x: P.l - 6, y: y(v) + 4, "text-anchor": "end" }, svg).textContent = yfmt(v);
    });
    // date ticks: month starts, or every few days for short windows
    const minGap = 56;
    let lastX = -1e9;
    m.days.forEach((p, k) => {
      const first = k === 0, mstart = p.d.endsWith("-01");
      const short = n <= 31 && (n - 1 - k) % Math.ceil(n / 6) === 0;
      if ((first || mstart || short) && x(k) - lastX >= minGap) {
        const yr = p.d.slice(5) === "01-01" || (first && n > 200);
        el("text", { class: "g-ax", x: x(k), y: H - 6, "text-anchor": first ? "start" : "middle" }, svg).textContent =
          yr ? fmtDay(p.d, { year: "numeric", day: undefined }) : fmtDay(p.d);
        lastX = x(k);
      }
    });
    return { P, bw, x, y, W, H };
  }

  // Direct label at the right end of a compare line.
  function endLabel(svg, F, cm, yv) {
    if (yv == null) return;
    const t = el("text", { class: "lbl-c", x: F.W - F.P.r + 4, y: F.y(yv) + 4 }, svg);
    t.textContent = cm.label;
  }

  // ---------- hover layer ----------
  // One crosshair + tooltip per chart; arrow keys move it, Enter/click picks the day.
  function hover(wrap, svg, F, m, tipHtml) {
    const tip = h("div", { class: "tip", role: "status" });
    wrap.appendChild(tip);
    const line = el("line", { class: "cross", y1: F.P.t, y2: F.H - F.P.b, visibility: "hidden" }, svg);
    let cur = -1;
    function show(k, clientX) {
      if (k < 0 || k >= m.n) return hide();
      cur = k;
      const cx = F.x(k);
      line.setAttribute("x1", cx); line.setAttribute("x2", cx); line.setAttribute("visibility", "visible");
      tip.innerHTML = tipHtml(k);
      tip.style.display = "block";
      const scale = wrap.clientWidth / F.W;
      const px = cx * scale, tw = tip.offsetWidth;
      let left = px + 12;
      if (left + tw > wrap.clientWidth) left = px - tw - 12;
      tip.style.left = Math.max(0, left) + "px";
      tip.style.top = "4px";
    }
    function hide() { cur = -1; tip.style.display = "none"; line.setAttribute("visibility", "hidden"); }
    function idxAt(ev) {
      const r = svg.getBoundingClientRect();
      const xx = ((ev.clientX - r.left) / r.width) * F.W;
      return Math.floor((xx - F.P.l) / F.bw);
    }
    svg.addEventListener("pointermove", (ev) => show(idxAt(ev)));
    svg.addEventListener("pointerleave", hide);
    svg.addEventListener("click", (ev) => { const k = idxAt(ev); if (k >= 0 && k < m.n) pickDay(m.days[k].d); });
    wrap.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowRight" || ev.key === "ArrowLeft") {
        ev.preventDefault();
        show(Math.max(0, Math.min(m.n - 1, (cur < 0 ? m.n - 1 : cur) + (ev.key === "ArrowRight" ? 1 : -1))));
      } else if (ev.key === "Enter" && cur >= 0) pickDay(m.days[cur].d);
      else if (ev.key === "Escape") hide();
    });
    wrap.addEventListener("blur", hide);
  }
  const sw = (v) => `<i style="background:var(${v})"></i>`;

  // Dashed marker for the picked day, if it is inside the window.
  function markSelected(svg, F, m) {
    const k = m.days.findIndex((p) => p.d === state.d);
    if (k >= 0) el("line", { class: "sel", x1: F.x(k), x2: F.x(k), y1: F.P.t, y2: F.H - F.P.b }, svg);
  }

  // ---------- panels ----------
  function panelTemp(body, m, W) {
    const H = Math.round(Math.min(320, Math.max(220, W * 0.36)));
    let lo = Infinity, hi = -Infinity;
    m.days.forEach((p) => { lo = Math.min(lo, p.rl, p.lo); hi = Math.max(hi, p.rh, p.hi); });
    m.cmp.forEach((c) => c.pts.forEach((q) => { if (q) { lo = Math.min(lo, q.lo); hi = Math.max(hi, q.hi); } }));
    lo = Math.floor(lo - 0.5); hi = Math.ceil(hi + 0.5);
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });
    const F = frame(svg, m, W, H, lo, hi, (v) => v + "°");
    const bars = F.bw >= 3;
    const xs = m.days.map((_, k) => F.x(k));
    if (bars) {
      m.days.forEach((p, k) => {
        const x0 = F.x(k) - F.bw / 2, gap = Math.min(2, F.bw * 0.15);
        el("path", { class: "f-rec", d: bar(x0 + gap / 2, F.y(p.rl), F.y(p.rh), F.bw - gap, 3) }, svg);
        const nw = (F.bw - gap) * 0.62;
        el("path", { class: "f-nor", d: bar(F.x(k) - nw / 2, F.y(p.nl), F.y(p.nh), nw, 2) }, svg);
        const aw = Math.max(2, (F.bw - gap) * 0.3);
        const cls = p.hi >= p.rh ? "f-hot" : p.lo <= p.rl ? "f-cold" : "f-act";
        el("path", { class: cls, d: bar(F.x(k) - aw / 2, F.y(p.lo), F.y(p.hi), aw, 2) }, svg);
      });
    } else {
      el("path", { class: "f-rec", d: area(xs, m.days.map((p) => F.y(p.rh)), m.days.map((p) => F.y(p.rl))) }, svg);
      el("path", { class: "f-nor", d: area(xs, m.days.map((p) => F.y(p.nh)), m.days.map((p) => F.y(p.nl))) }, svg);
      el("path", { class: "f-act", "fill-opacity": 0.85, d: area(xs, m.days.map((p) => F.y(p.hi)), m.days.map((p) => F.y(p.lo))) }, svg);
      m.days.forEach((p, k) => {
        if (p.hi >= p.rh) el("circle", { class: "f-hot", cx: F.x(k), cy: F.y(p.hi), r: 3 }, svg);
        else if (p.lo <= p.rl) el("circle", { class: "f-cold", cx: F.x(k), cy: F.y(p.lo), r: 3 }, svg);
      });
    }
    m.cmp.forEach((c) => {
      const col = `var(${CMP_VARS[c.k]})`;
      el("path", { class: "l-c", style: `stroke:${col}`, d: path(c.pts.map((q, k) => (q ? [F.x(k), F.y(q.hi)] : null))) }, svg);
      el("path", { class: "l-c", style: `stroke:${col}`, "stroke-dasharray": "4 3", d: path(c.pts.map((q, k) => (q ? [F.x(k), F.y(q.lo)] : null))) }, svg);
      const last = [...c.pts].reverse().find(Boolean);
      endLabel(svg, F, c, last && last.hi);
    });
    markSelected(svg, F, m);

    const above = m.days.filter((p) => p.hi > p.nh).length;
    const recHi = m.days.filter((p) => p.hi >= p.rh).length;
    const meanAnom = m.days.reduce((s, p) => s + p.hi - p.nh, 0) / m.n;
    svg.setAttribute("aria-label", `Daily high and low temperature, ${fmtDay(m.from)} to ${fmtDay(m.to)}. Highs averaged ${sgn(meanAnom)}° against normal; ${above} of ${m.n} days above the normal high; ${recHi} record highs.`);
    body.appendChild(h("p", { class: "lede" }, `Highs ran <b>${sgn(meanAnom)}°</b> against normal; <b>${above}</b> of ${m.n} days beat the normal high${recHi ? `, <b>${recHi}</b> set a record for the date` : ""}.`));
    const wrap = h("div", { class: "chart", tabindex: "0" });
    wrap.appendChild(svg); body.appendChild(wrap);
    hover(wrap, svg, F, m, (k) => {
      const p = m.days[k];
      let s = `<b>${fmtLong(p.d)}</b><br>${sw("--act")}${f1(p.hi)}° / ${f1(p.lo)}°<br>${sw("--nor")}normal ${f1(p.nh)}° / ${f1(p.nl)}°<br>${sw("--rec")}record ${f1(p.rh)}° / ${f1(p.rl)}°`;
      if (p.hi >= p.rh) s += `<br><b>Record high for the date</b>`;
      if (p.lo <= p.rl) s += `<br><b>Record low for the date</b>`;
      m.cmp.forEach((c) => { const q = c.pts[k]; if (q) s += `<br>${sw(CMP_VARS[c.k])}${fmtDay(q.d, { year: "numeric" })}: ${f1(q.hi)}° / ${f1(q.lo)}°`; });
      return s;
    });
    const lg = [["--rec", "record"], ["--nor", "normal (median)"], ["--act", "this period"], ["--hot", "record high"], ["--cold", "record low"]];
    legend(body, lg, m, "solid = high, dashed = low");
  }

  function legend(body, items, m, cmpNote) {
    const L = h("div", { class: "legend" });
    items.forEach(([v, t, line]) => L.appendChild(h("span", {}, `<i class="sw${line ? " line" : ""}" style="background:var(${v})"></i>${t}`)));
    m.cmp.forEach((c) => L.appendChild(h("span", {}, `<i class="sw line" style="background:var(${CMP_VARS[c.k]})"></i>${c.label}`)));
    if (m.cmp.length && cmpNote) L.appendChild(h("span", {}, `(${cmpNote})`));
    body.appendChild(L);
  }

  function panelRain(body, m, W) {
    const H = Math.round(Math.min(200, Math.max(140, W * 0.2)));
    const mx = Math.max(5, ...m.days.map((p) => p.rain), ...m.days.map((p) => p.nr));
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });
    const m2 = Object.assign({}, m, { cmp: [] });
    const F = frame(svg, m2, W, H, 0, mx * 1.05, (v) => v + "", 4);
    el("line", { class: "g-base", x1: F.P.l, x2: W - F.P.r, y1: F.y(0), y2: F.y(0) }, svg);
    const gap = Math.min(2, F.bw * 0.2), w = Math.max(1, F.bw - gap);
    m.days.forEach((p, k) => {
      if (p.rain >= 0.1) el("path", { class: "f-rain", d: bar(F.x(k) - w / 2, F.y(0), F.y(p.rain), w, F.bw > 8 ? 3 : 0) }, svg);
    });
    el("path", { class: "l-norm", d: path(m.days.map((p, k) => [F.x(k), F.y(p.nr)])) }, svg);
    el("text", { class: "g-ax", x: F.P.l - 6, y: F.P.t - 0, "text-anchor": "end" }, svg).textContent = "mm";
    markSelected(svg, F, m2);
    const total = m.days.reduce((s, p) => s + p.rain, 0), norm = m.days.reduce((s, p) => s + p.nr, 0);
    const rainy = m.days.filter((p) => p.rain >= RAINY_MM).length;
    const pctN = norm > 0.5 ? Math.round((total / norm) * 100) : null;
    svg.setAttribute("aria-label", `Daily rain. ${f1(total)} mm in total${pctN != null ? `, ${pctN}% of normal` : ""}; ${rainy} rainy days.`);
    body.appendChild(h("p", { class: "lede" }, `<b>${Math.round(total)} mm</b>${pctN != null ? ` — ${pctN}% of the ${Math.round(norm)} mm normal` : ""}; <b>${rainy}</b> rainy day${rainy === 1 ? "" : "s"} (≥ ${RAINY_MM} mm).`));
    const wrap = h("div", { class: "chart", tabindex: "0" });
    wrap.appendChild(svg); body.appendChild(wrap);
    hover(wrap, svg, F, m2, (k) => {
      const p = m.days[k];
      let s = `<b>${fmtLong(p.d)}</b><br>${sw("--rain")}${mm(p.rain)}<br>normal ${f1(p.nr)} mm`;
      m.cmp.forEach((c) => { const q = c.pts[k]; if (q) s += `<br>${sw(CMP_VARS[c.k])}${fmtDay(q.d, { year: "numeric" })}: ${f1(q.rain)} mm`; });
      return s;
    });
    legend(body, [["--rain", "rain"], ["--muted", "normal (mean, smoothed)", true]], m2);
  }

  function panelCum(body, m, W) {
    const H = Math.round(Math.min(280, Math.max(190, W * 0.3)));
    let mx = m.days[m.n - 1].cum;
    m.pct.forEach((q) => q && (mx = Math.max(mx, q.p90)));
    m.cmp.forEach((c) => c.pts.forEach((q) => q && (mx = Math.max(mx, q.cum))));
    mx = Math.max(5, mx * 1.05);
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });
    const F = frame(svg, m, W, H, 0, mx, (v) => v + "", 5);
    const xs = m.days.map((_, k) => F.x(k));
    if (m.pct[0]) {
      el("path", { class: "f-band", d: area(xs, m.pct.map((q) => F.y(q.p90)), m.pct.map((q) => F.y(q.p10))) }, svg);
      el("path", { class: "l-norm", d: path(m.pct.map((q, k) => [F.x(k), F.y(q.p50)])) }, svg);
    }
    m.cmp.forEach((c) => {
      el("path", { class: "l-c", style: `stroke:var(${CMP_VARS[c.k]})`, d: path(c.pts.map((q, k) => (q ? [F.x(k), F.y(q.cum)] : null))) }, svg);
      const last = [...c.pts].reverse().find(Boolean);
      endLabel(svg, F, c, last && last.cum);
    });
    el("path", { class: "l-act", d: path(m.days.map((p, k) => [F.x(k), F.y(p.cum)])) }, svg);
    el("text", { class: "g-ax", x: F.P.l - 6, y: F.P.t, "text-anchor": "end" }, svg).textContent = "mm";
    markSelected(svg, F, m);
    const endCum = m.days[m.n - 1].cum, q = m.pct[m.n - 1];
    let where = "";
    if (q) {
      const below = m.pct.length && m.years ? countBelow(m, endCum) : 0;
      where = endCum < q.p10 ? "drier than 9 in 10 past years" : endCum > q.p90 ? "wetter than 9 in 10 past years" : `within the usual range (median ${Math.round(q.p50)} mm)`;
      where += ` — wetter than ${below} of ${m.years} years`;
    }
    svg.setAttribute("aria-label", `Cumulative rain over the window: ${Math.round(endCum)} mm, ${where}.`);
    body.appendChild(h("p", { class: "lede" }, `<b>${Math.round(endCum)} mm</b> so far: ${where}.`));
    const wrap = h("div", { class: "chart", tabindex: "0" });
    wrap.appendChild(svg); body.appendChild(wrap);
    hover(wrap, svg, F, m, (k) => {
      const p = m.days[k], qq = m.pct[k];
      let s = `<b>${fmtLong(p.d)}</b><br>${sw("--act")}${f1(p.cum)} mm since ${fmtDay(m.from)}`;
      if (qq) s += `<br>${sw("--band")}typical ${Math.round(qq.p10)}–${Math.round(qq.p90)} mm, median ${Math.round(qq.p50)}`;
      m.cmp.forEach((c) => { const q2 = c.pts[k]; if (q2) s += `<br>${sw(CMP_VARS[c.k])}${c.label}: ${f1(q2.cum)} mm`; });
      return s;
    });
    legend(body, [["--act", "this period", true], ["--band", "10th–90th percentile of past years"], ["--muted", "median", true]], m);
  }

  function countBelow(m, v) {
    // How many past years ended the same window drier than v.
    let c = 0;
    for (let dy = 1; dy <= m.years; dy++) {
      let s = 0;
      m.days.forEach((p) => { const j = IDX.get(shiftYear(p.d, dy)); if (j !== undefined) s += RN[j]; });
      if (s < v) c++;
    }
    return c;
  }

  function panelAnom(body, m, W) {
    const H = Math.round(Math.min(220, Math.max(150, W * 0.22)));
    let a = 1;
    m.days.forEach((p) => (a = Math.max(a, Math.abs(p.hi - p.nh), Math.abs(p.lo - p.nl))));
    a = Math.ceil(a + 0.3);
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });
    const m2 = Object.assign({}, m, { cmp: [] });
    const F = frame(svg, m2, W, H, -a, a, (v) => (v > 0 ? "+" : "") + v + "°", 4);
    el("line", { class: "g-base", x1: F.P.l, x2: W - F.P.r, y1: F.y(0), y2: F.y(0) }, svg);
    const gap = Math.min(2, F.bw * 0.2), w = Math.max(1, F.bw - gap), r = F.bw > 8 ? 3 : 0;
    m.days.forEach((p, k) => {
      const v = p.hi - p.nh;
      if (Math.abs(v) < 0.05) return;
      el("path", { class: v > 0 ? "f-warm" : "f-cool", d: v > 0 ? bar(F.x(k) - w / 2, F.y(0), F.y(v), w, r) : barDown(F.x(k) - w / 2, F.y(0), F.y(v), w, r) }, svg);
    });
    markSelected(svg, F, m2);
    const warm = m.days.filter((p) => p.hi - p.nh >= 2).length, cool = m.days.filter((p) => p.hi - p.nh <= -2).length;
    svg.setAttribute("aria-label", `Daily high minus normal high. ${warm} days 2° or more above, ${cool} days 2° or more below.`);
    body.appendChild(h("p", { class: "lede" }, `Daily high minus the normal high. <b>${warm}</b> days ran 2° or more warm, <b>${cool}</b> ran 2° or more cool.`));
    const wrap = h("div", { class: "chart", tabindex: "0" });
    wrap.appendChild(svg); body.appendChild(wrap);
    hover(wrap, svg, F, m2, (k) => {
      const p = m.days[k];
      return `<b>${fmtLong(p.d)}</b><br>${sw(p.hi >= p.nh ? "--warm" : "--cool")}high ${sgn(p.hi - p.nh)}° vs normal<br>low ${sgn(p.lo - p.nl)}° vs normal`;
    });
    legend(body, [["--warm", "warmer than normal"], ["--cool", "cooler than normal"]], m2);
  }

  function panelStats(body, m) {
    const ds = m.days;
    const hot = ds.filter((p) => p.hi > p.p90).length;
    const recH = ds.filter((p) => p.hi >= p.rh).length, recL = ds.filter((p) => p.lo <= p.rl).length;
    const rainy = ds.filter((p) => p.rain >= RAINY_MM).length;
    let dry = 0, run = 0, dryEnd = null;
    ds.forEach((p) => { run = p.rain < RAINY_MM ? run + 1 : 0; if (run > dry) { dry = run; dryEnd = p.d; } });
    let streak = 0; for (let k = ds.length - 1; k >= 0 && ds[k].hi > ds[k].nh; k--) streak++;
    const warmest = ds.reduce((a, p) => (p.hi > a.hi ? p : a), ds[0]);
    const coolest = ds.reduce((a, p) => (p.lo < a.lo ? p : a), ds[0]);
    const wettest = ds.reduce((a, p) => (p.rain > a.rain ? p : a), ds[0]);
    const meanHi = ds.reduce((s, p) => s + p.hi, 0) / m.n, meanNh = ds.reduce((s, p) => s + p.nh, 0) / m.n;
    const tiles = [
      [sgn(meanHi - meanNh) + "°", "average high vs normal"],
      [`${hot}`, `hot days (normally about ${Math.round(m.n / 10)})`],
      [`${recH} / ${recL}`, "record highs / record lows"],
      [`${streak}`, `day${streak === 1 ? "" : "s"} in a row above normal, to ${fmtDay(m.to)}`],
      [`${rainy}`, `rainy days (≥ ${RAINY_MM} mm)`],
      [`${dry}`, dry ? `longest dry run, ended ${fmtDay(dryEnd)}` : "longest dry run"],
      [`${f1(warmest.hi)}°`, `warmest, ${fmtDay(warmest.d)}`],
      [`${f1(coolest.lo)}°`, `coolest night, ${fmtDay(coolest.d)}`],
      [`${Math.round(wettest.rain)} mm`, wettest.rain >= 0.1 ? `wettest, ${fmtDay(wettest.d)}` : "wettest day"],
    ];
    const g = h("div", { class: "tiles" });
    tiles.forEach(([v, k]) => g.appendChild(h("div", { class: "tile" }, `<div class="v">${esc(v)}</div><div class="k">${esc(k)}</div>`)));
    body.appendChild(g);
  }

  // ---------- day card ----------
  function dayCard() {
    const d = state.d || LAST, i = IDX.get(d);
    document.getElementById("day-input").value = d;
    const out = document.getElementById("day-body");
    out.innerHTML = "";
    if (i === undefined) { out.textContent = "No data for that date."; return; }
    const md = mdOf(d), r = rec(i);
    // ranks and the strip use the exact calendar date (29 Feb only against other 29 Febs)
    const ix = byMD.get(md).filter((j) => D[j].slice(5) === d.slice(5));
    const his = ix.map((j) => HI[j]), los = ix.map((j) => LO[j]), rains = ix.map((j) => RN[j]);
    const rankDesc = (arr, v) => 1 + arr.filter((x) => x > v).length;
    const rankAsc = (arr, v) => 1 + arr.filter((x) => x < v).length;
    const N = ix.length, dayName = fmtDay(d);
    out.appendChild(h("div", { class: "big" }, `${f1(HI[i])}°<small> / ${f1(LO[i])}°</small>`));
    out.appendChild(h("div", { class: "dayline" }, `${fmtLong(d)}`));
    out.appendChild(h("div", { class: "dayline" }, `<span class="m">normal</span> ${f1(NH[md])}° / ${f1(NL[md])}° <span class="m">(${sgn(HI[i] - NH[md])}°)</span>`));
    out.appendChild(h("div", { class: "dayline" }, `<span class="m">record</span> ${f1(r.rh)}° / ${f1(r.rl)}° · <span class="m">rain</span> ${mm(RN[i])}`));
    const hr = rankDesc(his, HI[i]), lr = rankDesc(los, LO[i]), cr = rankAsc(his, HI[i]);
    const ranks = h("ul", { class: "ranks" });
    ranks.appendChild(h("li", {}, hr <= N / 2 ? `${ord(hr)} warmest ${dayName} of ${N}` : `${ord(cr)} coolest ${dayName} of ${N}`));
    ranks.appendChild(h("li", {}, lr <= N / 2 ? `${ord(lr)} warmest night of ${N}` : `${ord(rankAsc(los, LO[i]))} coolest night of ${N}`));
    const wet = rains.filter((x) => x >= 0.1).length;
    ranks.appendChild(h("li", {}, RN[i] >= 0.1 ? `${ord(rankDesc(rains, RN[i]))} wettest ${dayName} of ${N}` : `dry — ${dayName} saw rain in ${wet} of ${N} years`));
    out.appendChild(ranks);

    // Strip plot: every year's high (top row) and low (bottom row) for this date.
    const W = Math.max(220, out.clientWidth || 260), H = 92;
    const lo = Math.floor(Math.min(...los)) - 1, hi = Math.ceil(Math.max(...his)) + 1;
    const x = (v) => 8 + (W - 16) * (v - lo) / (hi - lo);
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `${dayName} highs and lows in every year since ${yearOf(FIRST)}, this year marked.` });
    niceTicks(lo, hi, 5).forEach((v) => {
      el("line", { class: "g-grid", x1: x(v), x2: x(v), y1: 6, y2: H - 18 }, svg);
      el("text", { class: "g-ax", x: x(v), y: H - 4, "text-anchor": "middle" }, svg).textContent = v + "°";
    });
    const rows = [[his, 22, "high"], [los, 54, "low"]];
    rows.forEach(([arr, yy, nm]) => {
      ix.forEach((j, k) => {
        if (j === i) return;
        const c = el("circle", { cx: x(arr[k]), cy: yy, r: 4, fill: "var(--nor)", "fill-opacity": 0.55 }, svg);
        el("title", {}, c).textContent = `${yearOf(D[j])}: ${nm} ${f1(arr[k])}°`;
      });
    });
    rows.forEach(([arr, yy, nm]) => {
      const v = nm === "high" ? HI[i] : LO[i];
      el("circle", { cx: x(v), cy: yy, r: 6, fill: "var(--act)", stroke: "var(--card)", "stroke-width": 2 }, svg);
      el("title", {}, svg.lastChild).textContent = `${yearOf(d)}: ${nm} ${f1(v)}°`;
    });
    out.appendChild(h("div", { class: "strip-title" }, `Every ${dayName} since ${yearOf(FIRST)} — highs above, lows below`));
    out.appendChild(svg);
  }

  function pickDay(d) {
    state.d = clampDate(d);
    writeHash();
    dayCard();
    renderPanels(); // moves the dashed marker
  }

  // ---------- controls ----------
  function buildControls() {
    const wbox = document.getElementById("windows");
    WINDOWS.forEach(([k, label]) => {
      const b = h("button", { type: "button", "data-w": k }, label);
      b.addEventListener("click", () => {
        state.w = k;
        if (k === "custom" && !state.f) { const [f, t] = resolveWindowFor("45"); state.f = f; state.t = t; }
        render();
      });
      wbox.appendChild(b);
    });
    const from = document.getElementById("from"), to = document.getElementById("to");
    [from, to].forEach((inp) => {
      inp.min = FIRST; inp.max = LAST;
      inp.addEventListener("change", () => { state.f = from.value; state.t = to.value; render(); });
    });

    const sel = document.getElementById("cmp-add");
    for (let y = yearOf(LAST) - 1; y >= yearOf(FIRST); y--) sel.appendChild(h("option", { value: y }, String(y)));
    sel.addEventListener("change", () => {
      const y = +sel.value; sel.value = "";
      if (y && !state.c.includes(y) && state.c.length < 3) { state.c.push(y); render(); }
    });

    const di = document.getElementById("day-input");
    di.min = FIRST; di.max = LAST;
    di.addEventListener("change", () => di.value && pickDay(di.value));
    document.getElementById("day-prev").addEventListener("click", () => pickDay(addDays(state.d || LAST, -1)));
    document.getElementById("day-next").addEventListener("click", () => pickDay(addDays(state.d || LAST, 1)));
    document.getElementById("day-latest").addEventListener("click", () => pickDay(LAST));

    document.querySelectorAll("[data-theme-btn]").forEach((b) =>
      b.addEventListener("click", () => {
        const t = b.getAttribute("data-theme-btn");
        document.documentElement.setAttribute("data-theme", t);
        try { localStorage.setItem("blrw-theme", t); } catch (e) {}
        syncTheme();
        renderPanels();
      }));
    syncTheme();

    // close the panels menu on outside click
    document.addEventListener("click", (ev) => {
      const m = document.getElementById("panels-menu");
      if (m.open && !m.contains(ev.target)) m.open = false;
    });
  }
  function resolveWindowFor(w) { const keep = state.w; state.w = w; const r = resolveWindow(); state.w = keep; return r; }
  function syncTheme() {
    const t = document.documentElement.getAttribute("data-theme");
    document.querySelectorAll("[data-theme-btn]").forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-btn") === t)));
    const meta = document.querySelectorAll('meta[name="theme-color"]');
    meta.forEach((mm) => mm.setAttribute("content", t === "instrument" ? "#0E1417" : "#F3ECDD"));
  }

  function syncControls(m) {
    document.querySelectorAll("[data-w]").forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-w") === state.w)));
    const custom = document.getElementById("custom");
    custom.classList.toggle("on", state.w === "custom");
    document.getElementById("from").value = m.from;
    document.getElementById("to").value = m.to;

    const box = document.getElementById("compare");
    box.querySelectorAll(".chip").forEach((c) => c.remove());
    const sel = document.getElementById("cmp-add");
    state.c.forEach((y, k) => {
      const chip = h("span", { class: "chip" }, `<i style="background:var(${CMP_VARS[k]})"></i>${m.cmp[k] ? esc(m.cmp[k].label) : y}`);
      const x = h("button", { type: "button", "aria-label": `Remove ${y}` }, "×");
      x.addEventListener("click", () => { state.c.splice(k, 1); render(); });
      chip.appendChild(x);
      box.insertBefore(chip, sel);
    });
    sel.disabled = state.c.length >= 3;
    sel.options[0].textContent = state.c.length >= 3 ? "3 years max" : "+ Compare year";

    const list = document.getElementById("panels-list");
    list.innerHTML = "";
    state.p.forEach((k, pos) => {
      const row = h("div", { class: "menu-row" });
      const id = "pv-" + k;
      const lab = h("label", { for: id });
      const cb = h("input", { type: "checkbox", id });
      cb.checked = !state.hidden.includes(k);
      cb.addEventListener("change", () => {
        state.hidden = cb.checked ? state.hidden.filter((x) => x !== k) : [...state.hidden, k];
        writeHash(); renderPanels();
      });
      lab.appendChild(cb); lab.appendChild(document.createTextNode(PANELS[k]));
      row.appendChild(lab);
      [["↑", -1], ["↓", 1]].forEach(([s, dir]) => {
        const b = h("button", { type: "button", "aria-label": `Move ${PANELS[k]} ${dir < 0 ? "up" : "down"}` }, s);
        b.disabled = (dir < 0 && pos === 0) || (dir > 0 && pos === state.p.length - 1);
        b.addEventListener("click", () => {
          const p = state.p; [p[pos], p[pos + dir]] = [p[pos + dir], p[pos]];
          writeHash(); syncControls(model); renderPanels();
          document.querySelector(`#panels-list [aria-label="${b.getAttribute("aria-label")}"]`)?.focus();
        });
        row.appendChild(b);
      });
      list.appendChild(row);
    });
  }

  // ---------- render ----------
  let model = null;
  const RENDER = { temp: panelTemp, rain: panelRain, cum: panelCum, anom: panelAnom, stats: panelStats };

  function renderPanels() {
    const main = document.getElementById("panels");
    main.innerHTML = "";
    const vis = state.p.filter((k) => !state.hidden.includes(k));
    if (!vis.length) { main.appendChild(h("div", { class: "card" }, "All panels are hidden. Use <b>Panels ▾</b> to bring some back.")); return; }
    vis.forEach((k) => {
      const card = h("section", { class: "card", "aria-labelledby": "h-" + k });
      card.appendChild(h("h2", { id: "h-" + k }, PANELS[k]));
      main.appendChild(card);
      const W = Math.max(300, Math.round(card.clientWidth - 28));
      RENDER[k](card, model, W);
    });
    main.appendChild(tableCard(model));
  }

  function tableCard(m) {
    const card = h("section", { class: "card" });
    const det = h("details", { class: "table" });
    det.appendChild(h("summary", {}, `Data table for ${fmtDay(m.from, { year: "numeric" })} – ${fmtDay(m.to, { year: "numeric" })} (${m.n} days)`));
    det.addEventListener("toggle", () => {
      if (!det.open || det.querySelector("table")) return;
      let rows = "";
      for (let k = m.n - 1; k >= 0; k--) {
        const p = m.days[k];
        rows += `<tr><td>${p.d}</td><td>${f1(p.hi)}</td><td>${f1(p.nh)}</td><td>${f1(p.rh)}</td><td>${f1(p.lo)}</td><td>${f1(p.nl)}</td><td>${f1(p.rl)}</td><td>${f1(p.rain)}</td></tr>`;
      }
      const wrap = h("div", { class: "tablewrap" }, `<table><thead><tr><th>Date</th><th>High °C</th><th>Normal</th><th>Record</th><th>Low °C</th><th>Normal</th><th>Record</th><th>Rain mm</th></tr></thead><tbody>${rows}</tbody></table>`);
      det.appendChild(wrap);
    });
    card.appendChild(det);
    return card;
  }

  function render() {
    model = buildModel();
    writeHash();
    syncControls(model);
    renderPanels();
    dayCard();
  }

  let rz = 0, lastW = 0;
  window.addEventListener("resize", () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      const w = document.getElementById("panels").clientWidth;
      if (model && w !== lastW) { lastW = w; renderPanels(); dayCard(); }
    }, 150);
  });
  window.addEventListener("hashchange", () => {
    if (!model) return;
    readHash(); render();
  });

  // ---------- boot ----------
  async function boot() {
    const status = document.getElementById("status");
    let res, text, cacheState;
    try {
      res = await fetch(SRC);
      if (!res.ok) throw new Error("HTTP " + res.status);
      text = await res.text();
      if (!text.startsWith("DT,High,Low,Rain")) throw new Error("unexpected file");
      cacheState = res.headers.get("x-blr-weather");
    } catch (e) {
      status.innerHTML = `Couldn’t load the weather data (${esc(e.message)}). The source is <a href="https://weather.karthiks.co/">weather.karthiks.co</a>; try again in a bit.`;
      return;
    }
    parse(text);
    readHash();
    if (state.d) state.d = clampDate(state.d);
    const ageDays = Math.round((Date.now() - ms(LAST)) / 864e5);
    let sub = `Daily highs, lows and rain since ${yearOf(FIRST)} · data through <b>${fmtDay(LAST, { year: "numeric" })}</b>`;
    if (ageDays > 3) sub += ` · <span class="warn">the source hasn’t updated in ${ageDays} days</span>`;
    if (cacheState === "stale") sub += ` · <span class="warn">source unreachable, showing the last copy</span>`;
    document.getElementById("sub").innerHTML = sub;
    status.hidden = true;
    document.getElementById("layout").hidden = false;
    buildControls();
    render();
    lastW = document.getElementById("panels").clientWidth;
  }
  boot();
})();
