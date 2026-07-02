/* ===================================================================
   DATA LOADING
=================================================================== */
const DATA_URL = "../data/graph.json";
const STATUS_COLORS = {
  voimassa: "#2f6d4f", kumottu: "#a6321f", kumoutunut: "#b3812c",
  unknown: "#2f6d4f", unscraped: "#9c94b0",
};
const STATUS_LABELS = {
  voimassa: "Voimassa", kumottu: "Kumottu", kumoutunut: "Kumoutunut",
  unknown: "Voimassa", unscraped: "Ei haettu",
};

let graphData = { nodes: [], edges: [] };
let nodesById = {};

const FALLBACK_DATA = {"nodes": [{"id": "234/1929", "name": "Avioliittolaki", "status": "voimassa", "date": "13.6.1929", "url": "https://www.finlex.fi/fi/lainsaadanto/1929/234", "category_path": ["Perhe- ja perintöoikeus", "Perhe", "Avioliitto ja rekisteröity parisuhde"], "section_count": 17}, {"id": "235/1929", "name": "Laki avioliittolain voimaanpanosta", "status": "voimassa", "date": "13.6.1929", "url": "https://www.finlex.fi/fi/lainsaadanto/1929/235", "category_path": ["Perhe- ja perintöoikeus", "Perhe", "Avioliitto ja rekisteröity parisuhde"], "section_count": 6}, {"id": "820/1987", "name": "Avioliittoasetus", "status": "voimassa", "date": "6.11.1987", "url": "https://www.finlex.fi/fi/lainsaadanto/1987/820", "category_path": ["Perhe- ja perintöoikeus", "Perhe", "Avioliitto ja rekisteröity parisuhde"], "section_count": 9}, {"id": "1157/2019", "name": "Laki vihkimisoikeudesta", "status": "voimassa", "date": "29.11.2019", "url": "https://www.finlex.fi/fi/lainsaadanto/2019/1157", "category_path": ["Perhe- ja perintöoikeus", "Perhe", "Avioliitto ja rekisteröity parisuhde"], "section_count": 8}, {"id": "56/2019", "name": "Laki kansainvälisten parien varallisuussuhteita koskevien neuvoston asetusten soveltamisesta", "status": "voimassa", "date": "18.1.2019", "url": "https://www.finlex.fi/fi/lainsaadanto/2019/56", "category_path": ["Perhe- ja perintöoikeus", "Perhe", "Avioliitto ja rekisteröity parisuhde"], "section_count": 5}, {"id": "26/2011", "name": "Laki avopuolisoiden yhteistalouden purkamisesta", "status": "voimassa", "date": "14.1.2011", "url": "https://www.finlex.fi/fi/lainsaadanto/2011/26", "category_path": ["Perhe- ja perintöoikeus", "Perhe", "Avioliitto ja rekisteröity parisuhde"], "section_count": 12}, {"id": "950/2001", "name": "Laki rekisteröidystä parisuhteesta", "status": "kumottu", "date": "9.11.2001", "url": "https://www.finlex.fi/fi/lainsaadanto/2001/950", "category_path": ["Perhe- ja perintöoikeus", "Perhe", "Avioliitto ja rekisteröity parisuhde"], "section_count": 11}, {"id": "775/2022", "name": "Vanhemmuuslaki", "status": "voimassa", "date": "26.8.2022", "url": "https://www.finlex.fi/fi/lainsaadanto/2022/775", "category_path": ["Perhe- ja perintöoikeus", "Perhe", "Vanhemmuus"], "section_count": 42}, {"id": "167/2024", "name": "Valtioneuvoston asetus oikeusgeneettisestä vanhemmuustutkimuksesta maksettavista korvauksista", "status": "voimassa", "date": "11.4.2024", "url": "https://www.finlex.fi/fi/lainsaadanto/2024/167", "category_path": ["Perhe- ja perintöoikeus", "Perhe", "Vanhemmuus"], "section_count": 4}, {"id": "270/2024", "name": "Valtioneuvoston asetus mekaanisesti kierrätetyn uusiomuoviraaka-aineen jätteeksi luokittelun päättymisen arviointiperusteista", "status": "voimassa", "date": "23.5.2024", "url": "https://www.finlex.fi/fi/lainsaadanto/2024/270", "category_path": ["Ympäristöoikeus", "Jätehuolto"], "section_count": 17}, {"id": "646/2011", "name": "Jätelaki", "status": "voimassa", "date": "17.6.2011", "url": "https://www.finlex.fi/fi/lainsaadanto/2011/646", "category_path": ["Ympäristöoikeus", "Jätehuolto"], "section_count": 149}, {"id": "527/2014", "name": "Ympäristönsuojelulaki", "status": "voimassa", "date": "27.6.2014", "url": "https://www.finlex.fi/fi/lainsaadanto/2014/527", "category_path": ["Ympäristöoikeus", "Ympäristönsuojelu"], "section_count": 233}, {"id": "714/2021", "name": "Laki jätelain muuttamisesta", "status": "voimassa", "date": "16.7.2021", "url": "https://www.finlex.fi/fi/lainsaadanto/2021/714", "category_path": ["Ympäristöoikeus", "Jätehuolto"], "section_count": 30}, {"id": "1166/2018", "name": "Laki ympäristönsuojelulain muuttamisesta", "status": "voimassa", "date": "14.12.2018", "url": "https://www.finlex.fi/fi/lainsaadanto/2018/1166", "category_path": ["Ympäristöoikeus", "Ympäristönsuojelu"], "section_count": 22}], "edges": [{"source": "235/1929", "target": "234/1929", "label": "voimaanpano"}, {"source": "820/1987", "target": "234/1929", "label": "asetus"}, {"source": "1157/2019", "target": "234/1929", "label": "5 §"}, {"source": "56/2019", "target": "234/1929", "label": "viittaus"}, {"source": "26/2011", "target": "950/2001", "label": "viittaus"}, {"source": "775/2022", "target": "234/1929", "label": "viittaus"}, {"source": "167/2024", "target": "775/2022", "label": "voimaanpano"}, {"source": "270/2024", "target": "646/2011", "label": "5 b §"}, {"source": "270/2024", "target": "527/2014", "label": "9 §"}, {"source": "270/2024", "target": "527/2014", "label": "27 §"}, {"source": "646/2011", "target": "714/2021", "label": "muutos"}, {"source": "527/2014", "target": "1166/2018", "label": "muutos"}]};

async function loadGraph() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error("fetch failed: " + res.status);
    graphData = await res.json();
  } catch (e) {
    console.warn("Could not load graph.json — using bundled sample data.", e);
    graphData = FALLBACK_DATA;
  }
  nodesById = {};
  graphData.nodes.forEach(n => nodesById[n.id] = n);
  buildAdjacency();
  layoutManager.apply(layoutSelect.value, true);
  renderLegend();
  setupTimeSlider();
  buildAutocompleteIndex();
  requestRender();
  drawMinimap();
}

let outgoing = {}, incoming = {};
function buildAdjacency() {
  outgoing = {}; incoming = {};
  graphData.nodes.forEach(n => { outgoing[n.id] = []; incoming[n.id] = []; });
  graphData.edges.forEach(e => {
    if (!outgoing[e.source]) outgoing[e.source] = [];
    if (!incoming[e.target]) incoming[e.target] = [];
    outgoing[e.source].push(e);
    incoming[e.target].push(e);
  });
}

function neighborsOf(id) {
  const out = (outgoing[id] || []).map(e => e.target);
  const inc = (incoming[id] || []).map(e => e.source);
  return new Set([...out, ...inc]);
}

// BFS over undirected adjacency; returns Map(id -> distance)
function bfsDistances(startId, maxDepth = Infinity) {
  const dist = new Map([[startId, 0]]);
  const queue = [startId];
  while (queue.length) {
    const cur = queue.shift();
    const d = dist.get(cur);
    if (d >= maxDepth) continue;
    for (const nb of neighborsOf(cur)) {
      if (!dist.has(nb)) { dist.set(nb, d + 1); queue.push(nb); }
    }
  }
  return dist;
}

// BFS reachable set following outgoing edges only (for impact analysis)
function reachableForward(startId) {
  const seen = new Set([startId]);
  const queue = [startId];
  while (queue.length) {
    const cur = queue.shift();
    (outgoing[cur] || []).forEach(e => {
      if (!seen.has(e.target)) { seen.add(e.target); queue.push(e.target); }
    });
  }
  seen.delete(startId);
  return seen;
}

function edgeType(label) {
  const l = (label || '').toLowerCase();
  if (l.includes('muutos') || l.includes('muutt')) return 'amend';
  if (l.includes('voimaanpano')) return 'implement';
  if (l.includes('asetus')) return 'implement';
  if (l.includes('viittaus') || l.includes('§')) return 'reference';
  return 'change';
}
const EDGE_COLOR_VAR = { change: '--edge-change', reference: '--edge-reference', implement: '--edge-implement', amend: '--edge-amend' };
const EDGE_LABELS = { change: 'Muutos', reference: 'Viittaus', implement: 'Voimaanpano/asetus', amend: 'Muuttaa säädöstä' };

function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

function parseYear(dateStr) {
  if (!dateStr) return null;
  const parts = String(dateStr).split('.');
  const y = parseInt(parts[parts.length - 1], 10);
  return isNaN(y) ? null : y;
}

/* ===================================================================
   CANVAS / VIEWPORT
=================================================================== */
const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');
const pane = document.getElementById('graph-pane');

let view = { x: 0, y: 0, scale: 1 };
let nodePositions = {};
const NODE_W = 190, NODE_H = 46;

function resizeCanvas() {
  const rect = pane.getBoundingClientRect();
  canvas.width = rect.width * devicePixelRatio;
  canvas.height = rect.height * devicePixelRatio;
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  requestRender();
  drawMinimap();
}
window.addEventListener('resize', resizeCanvas);

function worldToScreen(x, y) { return [(x * view.scale) + view.x, (y * view.scale) + view.y]; }
function screenToWorld(x, y) { return [(x - view.x) / view.scale, (y - view.y) / view.scale]; }

/* ===================================================================
   LAYOUTS
=================================================================== */
const layoutManager = {
  apply(mode, resetAll = false) {
    const nodes = graphData.nodes;
    if (nodes.length === 0) return;
    if (mode === 'force') this.force(nodes, resetAll);
    else if (mode === 'hierarchical') this.hierarchical(nodes);
    else if (mode === 'circular') this.circular(nodes);
    else if (mode === 'radial') this.radial(nodes);
    else if (mode === 'grid') this.grid(nodes);
    requestRender();
    drawMinimap();
  },
  force(nodes, resetAll) {
    nodes.forEach((n, i) => {
      if (resetAll || !nodePositions[n.id]) {
        const angle = (i / nodes.length) * Math.PI * 2;
        nodePositions[n.id] = {
          x: 600 + Math.cos(angle) * 300 + (Math.random() - 0.5) * 60,
          y: 400 + Math.sin(angle) * 300 + (Math.random() - 0.5) * 60,
          vx: 0, vy: 0,
        };
      }
    });
    runForceSimulation(180);
  },
  hierarchical(nodes) {
    const byTopCategory = {};
    nodes.forEach(n => {
      const top = (n.category_path && n.category_path[0]) || "Muut";
      (byTopCategory[top] = byTopCategory[top] || []).push(n);
    });
    const cats = Object.keys(byTopCategory);
    const colWidth = 260;
    cats.forEach((cat, ci) => {
      byTopCategory[cat].forEach((n, ri) => {
        nodePositions[n.id] = { x: 120 + ci * colWidth, y: 100 + ri * (NODE_H + 26), vx: 0, vy: 0 };
      });
    });
  },
  circular(nodes) {
    const R = Math.max(220, nodes.length * 14);
    nodes.forEach((n, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      nodePositions[n.id] = { x: 600 + Math.cos(angle) * R, y: 420 + Math.sin(angle) * R, vx: 0, vy: 0 };
    });
  },
  radial(nodes) {
    const byTop = {};
    nodes.forEach(n => {
      const top = (n.category_path && n.category_path[0]) || "Muut";
      (byTop[top] = byTop[top] || []).push(n);
    });
    const cats = Object.keys(byTop);
    cats.forEach((cat, ci) => {
      const ring = 140 + ci * 150;
      const list = byTop[cat];
      list.forEach((n, i) => {
        const angle = (i / list.length) * Math.PI * 2 + ci * 0.4;
        nodePositions[n.id] = { x: 600 + Math.cos(angle) * ring, y: 420 + Math.sin(angle) * ring, vx: 0, vy: 0 };
      });
    });
  },
  grid(nodes) {
    const cols = Math.ceil(Math.sqrt(nodes.length));
    nodes.forEach((n, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      nodePositions[n.id] = { x: 100 + col * 230, y: 100 + row * 90, vx: 0, vy: 0 };
    });
  },
};

function runForceSimulation(iterations) {
  const nodes = graphData.nodes;
  const edges = graphData.edges;
  const REPULSE = 26000, SPRING = 0.02, SPRING_LEN = 220, DAMP = 0.85, CENTER = 0.002;
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      const a = nodePositions[nodes[i].id];
      let fx = 0, fy = 0;
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const b = nodePositions[nodes[j].id];
        let dx = a.x - b.x, dy = a.y - b.y;
        let distSq = dx * dx + dy * dy || 0.01;
        let dist = Math.sqrt(distSq);
        const force = REPULSE / distSq;
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
      }
      fx += (600 - a.x) * CENTER;
      fy += (420 - a.y) * CENTER;
      a.vx = (a.vx + fx) * DAMP;
      a.vy = (a.vy + fy) * DAMP;
    }
    edges.forEach(e => {
      const a = nodePositions[e.source], b = nodePositions[e.target];
      if (!a || !b) return;
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const diff = (dist - SPRING_LEN) * SPRING;
      const fx = (dx / dist) * diff, fy = (dy / dist) * diff;
      a.vx += fx; a.vy += fy;
      b.vx -= fx; b.vy -= fy;
    });
    nodes.forEach(n => { const p = nodePositions[n.id]; p.x += p.vx; p.y += p.vy; });
  }
}

function runForceTick() {
  // lighter single-step tick used for continuous "animate graph" mode
  const nodes = graphData.nodes, edges = graphData.edges;
  const REPULSE = 26000, SPRING = 0.02, SPRING_LEN = 220, DAMP = 0.9, CENTER = 0.002;
  for (let i = 0; i < nodes.length; i++) {
    const a = nodePositions[nodes[i].id]; if (!a) continue;
    let fx = 0, fy = 0;
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const b = nodePositions[nodes[j].id]; if (!b) continue;
      let dx = a.x - b.x, dy = a.y - b.y;
      let distSq = dx * dx + dy * dy || 0.01;
      let dist = Math.sqrt(distSq);
      const force = REPULSE / distSq;
      fx += (dx / dist) * force; fy += (dy / dist) * force;
    }
    fx += (600 - a.x) * CENTER; fy += (420 - a.y) * CENTER;
    a.vx = (a.vx + fx) * DAMP; a.vy = (a.vy + fy) * DAMP;
  }
  edges.forEach(e => {
    const a = nodePositions[e.source], b = nodePositions[e.target];
    if (!a || !b) return;
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
    const diff = (dist - SPRING_LEN) * SPRING;
    const fx = (dx / dist) * diff, fy = (dy / dist) * diff;
    a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
  });
  nodes.forEach(n => { const p = nodePositions[n.id]; if (p) { p.x += p.vx; p.y += p.vy; } });
}

/* ===================================================================
   RENDERING
=================================================================== */
let selectedNode = null;
let hoveredNode = null;
let searchMatches = new Set();
const hiddenStatuses = new Set();
let showLabels = true;
let animateGraph = false;
let timeCutoffYear = null; // null = disabled
let pathHighlightNodes = new Set();
let pathHighlightEdges = new Set(); // "source|target"

function isVisible(n) {
  if (!n) return false;
  if (hiddenStatuses.has(n.status)) return false;
  if (timeCutoffYear != null) {
    const y = parseYear(n.date);
    if (y != null && y > timeCutoffYear) return false;
  }
  return true;
}

function requestRender() { needsRender = true; }
let needsRender = true;

function renderLoop() {
  if (animateGraph && layoutSelect.value === 'force') runForceTick();
  if (needsRender || searchMatches.size > 0 || animateGraph) { draw(); needsRender = false; }
  requestAnimationFrame(renderLoop);
}

function draw() {
  const w = canvas.width, h = canvas.height;
  ctx.save();
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = cssVar('--paper');
  ctx.fillRect(0, 0, w / devicePixelRatio, h / devicePixelRatio);

  const t = performance.now() / 500;
  const pulse = 0.55 + Math.sin(t) * 0.35;

  let distMap = null;
  if (selectedNode) distMap = bfsDistances(selectedNode, 2);

  // edges
  graphData.edges.forEach(e => {
    const a = nodePositions[e.source], b = nodePositions[e.target];
    if (!a || !b) return;
    if (!isVisible(nodesById[e.source]) || !isVisible(nodesById[e.target])) return;
    const [ax, ay] = worldToScreen(a.x, a.y);
    const [bx, by] = worldToScreen(b.x, b.y);
    const type = edgeType(e.label);
    const baseColor = cssVar(EDGE_COLOR_VAR[type]);
    const isHistoric = (nodesById[e.source] && (nodesById[e.source].status === 'kumottu' || nodesById[e.source].status === 'kumoutunut')) ||
                        (nodesById[e.target] && (nodesById[e.target].status === 'kumottu' || nodesById[e.target].status === 'kumoutunut'));
    const pathKey1 = e.source + '|' + e.target, pathKey2 = e.target + '|' + e.source;
    const onPath = pathHighlightEdges.has(pathKey1) || pathHighlightEdges.has(pathKey2);

    let alpha = 0.55, widthPx = 1.3;
    if (selectedNode) {
      const touches = e.source === selectedNode || e.target === selectedNode;
      const near = distMap && (distMap.get(e.source) <= 2 && distMap.get(e.target) <= 2);
      if (touches) { alpha = 0.95; widthPx = 2.4; }
      else if (near) { alpha = 0.45; widthPx = 1.3; }
      else { alpha = 0.08; widthPx = 1; }
    }
    if (onPath) { alpha = 1; widthPx = 3; }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = onPath ? cssVar('--gold') : baseColor;
    ctx.lineWidth = widthPx * view.scale;
    if (isHistoric) ctx.setLineDash([6 * view.scale, 4 * view.scale]);
    else ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    // arrowhead
    const angle = Math.atan2(by - ay, bx - ax);
    const headLen = 7 * view.scale;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(bx - NODE_W / 2 * view.scale * Math.cos(angle), by - NODE_H / 2 * view.scale * Math.sin(angle));
    ctx.lineTo(bx - headLen * Math.cos(angle - 0.3) - NODE_W/2*view.scale*Math.cos(angle), by - headLen * Math.sin(angle - 0.3) - NODE_H/2*view.scale*Math.sin(angle));
    ctx.moveTo(bx - NODE_W / 2 * view.scale * Math.cos(angle), by - NODE_H / 2 * view.scale * Math.sin(angle));
    ctx.lineTo(bx - headLen * Math.cos(angle + 0.3) - NODE_W/2*view.scale*Math.cos(angle), by - headLen * Math.sin(angle + 0.3) - NODE_H/2*view.scale*Math.sin(angle));
    ctx.stroke();
    ctx.restore();
  });

  // nodes
  graphData.nodes.forEach(n => {
    if (!isVisible(n)) return;
    const p = nodePositions[n.id];
    if (!p) return;
    const [sx, sy] = worldToScreen(p.x, p.y);
    let nw = NODE_W * view.scale, nh = NODE_H * view.scale;
    if (sx < -nw || sx > canvas.width / devicePixelRatio + nw || sy < -nh || sy > canvas.height / devicePixelRatio + nh) return;

    const isSelected = selectedNode === n.id;
    const isHover = hoveredNode === n.id;
    const isMatch = searchMatches.has(n.id);
    const onPath = pathHighlightNodes.has(n.id);
    const color = STATUS_COLORS[n.status] || STATUS_COLORS.unknown;

    let opacity = 1, borderW = 1.4;
    if (selectedNode && !isSelected) {
      const d = distMap ? distMap.get(n.id) : undefined;
      if (d === 1) { opacity = 1; borderW = 2; }
      else if (d === 2) { opacity = 0.6; borderW = 1.3; }
      else { opacity = 0.22; borderW = 1; }
    }
    if (isSelected) { nw *= 1.06; nh *= 1.06; borderW = 3; }

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(sx, sy);

    if (isHover && !isSelected) {
      ctx.shadowColor = cssVar('--gold'); ctx.shadowBlur = 18 * view.scale;
    }

    roundRect(ctx, -nw / 2, -nh / 2, nw, nh, 8 * view.scale);
    ctx.fillStyle = "#fffdf6";
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = borderW * view.scale;
    ctx.strokeStyle = onPath ? cssVar('--gold') : (isSelected ? cssVar('--gold') : isMatch ? cssVar('--accent') : color);
    ctx.stroke();

    if (isMatch) {
      ctx.save();
      ctx.globalAlpha = opacity * pulse;
      roundRect(ctx, -nw / 2 - 4 * view.scale, -nh / 2 - 4 * view.scale, nw + 8 * view.scale, nh + 8 * view.scale, 10 * view.scale);
      ctx.lineWidth = 2 * view.scale;
      ctx.strokeStyle = cssVar('--accent');
      ctx.stroke();
      ctx.restore();
    }

    // status dot
    ctx.beginPath();
    ctx.arc(-nw / 2 + 12 * view.scale, -nh / 2 + 12 * view.scale, 4.5 * view.scale, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    if (showLabels) {
      ctx.fillStyle = "#0f1a2b";
      ctx.font = `${isSelected ? '700 ' : ''}${Math.max(9, 12 * view.scale)}px 'Source Sans 3', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const label = truncate(n.name, 26);
      ctx.fillText(label, 6 * view.scale, -4 * view.scale);
      ctx.font = `${Math.max(8, 10 * view.scale)}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = "#6b6355";
      ctx.fillText(n.id, 6 * view.scale, 12 * view.scale);
    }
    ctx.restore();
  });

  ctx.restore();
  drawMinimap();
}

function truncate(s, n) { if (!s) return ""; return s.length > n ? s.slice(0, n - 1) + "…" : s; }
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ===================================================================
   MINIMAP
=================================================================== */
const minimapCanvas = document.getElementById('minimap');
const minimapCtx = minimapCanvas.getContext('2d');
function drawMinimap() {
  const wrap = document.getElementById('minimap-wrap');
  if (getComputedStyle(wrap).display === 'none') return;
  const cw = 160, ch = 108;
  minimapCanvas.width = cw * devicePixelRatio;
  minimapCanvas.height = ch * devicePixelRatio;
  minimapCanvas.style.width = cw + 'px'; minimapCanvas.style.height = ch + 'px';
  const mctx = minimapCtx;
  mctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  mctx.clearRect(0, 0, cw, ch);

  const pts = graphData.nodes.map(n => nodePositions[n.id]).filter(Boolean);
  if (!pts.length) return;
  let minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x));
  let minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y));
  const padding = 40;
  minX -= padding; minY -= padding; maxX += padding; maxY += padding;
  const gw = Math.max(1, maxX - minX), gh = Math.max(1, maxY - minY);
  const scale = Math.min(cw / gw, ch / gh);
  const ox = (cw - gw * scale) / 2, oy = (ch - gh * scale) / 2;
  const mmToScreen = (x, y) => [ox + (x - minX) * scale, oy + (y - minY) * scale];

  graphData.nodes.forEach(n => {
    const p = nodePositions[n.id]; if (!p || hiddenStatuses.has(n.status)) return;
    const [mx, my] = mmToScreen(p.x, p.y);
    mctx.fillStyle = STATUS_COLORS[n.status] || STATUS_COLORS.unknown;
    mctx.beginPath(); mctx.arc(mx, my, n.id === selectedNode ? 2.6 : 1.6, 0, Math.PI * 2); mctx.fill();
  });

  // viewport rect
  const rect = pane.getBoundingClientRect();
  const [wx0, wy0] = screenToWorld(0, 0);
  const [wx1, wy1] = screenToWorld(rect.width, rect.height);
  const [vx0, vy0] = mmToScreen(wx0, wy0);
  const [vx1, vy1] = mmToScreen(wx1, wy1);
  mctx.strokeStyle = cssVar('--gold');
  mctx.lineWidth = 1.5;
  mctx.strokeRect(Math.min(vx0,vx1), Math.min(vy0,vy1), Math.abs(vx1-vx0), Math.abs(vy1-vy0));

  minimapCanvas._mmMeta = { minX, minY, scale, ox, oy };
}
function minimapToWorld(mx, my) {
  const meta = minimapCanvas._mmMeta; if (!meta) return [0, 0];
  return [meta.minX + (mx - meta.ox) / meta.scale, meta.minY + (my - meta.oy) / meta.scale];
}
function centerViewOnWorld(wx, wy) {
  const rect = pane.getBoundingClientRect();
  view.x = rect.width / 2 - wx * view.scale;
  view.y = rect.height / 2 - wy * view.scale;
  requestRender();
}
let minimapDragging = false;
function minimapPointer(e) {
  const rect = minimapCanvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  const [wx, wy] = minimapToWorld(mx, my);
  centerViewOnWorld(wx, wy);
}
minimapCanvas.addEventListener('mousedown', (e) => { minimapDragging = true; minimapPointer(e); });
window.addEventListener('mousemove', (e) => { if (minimapDragging) minimapPointer(e); });
window.addEventListener('mouseup', () => { minimapDragging = false; });
/* ===================================================================
   INTERACTION: mouse pan/drag/zoom/select
=================================================================== */
let isPanning = false, panStart = null;
let draggingNode = null, dragOffset = null;
let panVelocity = { x: 0, y: 0 };
let lastPanPoint = null;
let inertiaRAF = null;

function nodeAtScreen(sx, sy) {
  for (let i = graphData.nodes.length - 1; i >= 0; i--) {
    const n = graphData.nodes[i];
    if (!isVisible(n)) continue;
    const p = nodePositions[n.id];
    if (!p) continue;
    const [cx, cy] = worldToScreen(p.x, p.y);
    const nw = NODE_W * view.scale, nh = NODE_H * view.scale;
    if (Math.abs(sx - cx) <= nw / 2 && Math.abs(sy - cy) <= nh / 2) return n;
  }
  return null;
}

function zoomAt(mx, my, factor) {
  const [wx, wy] = screenToWorld(mx, my);
  view.scale *= factor;
  view.scale = Math.min(Math.max(view.scale, 0.15), 4);
  const [nsx, nsy] = worldToScreen(wx, wy);
  view.x += mx - nsx; view.y += my - nsy;
  requestRender();
}

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  zoomAt(mx, my, e.deltaY < 0 ? 1.1 : 0.9);
}, { passive: false });

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

function startPan(clientX, clientY) {
  isPanning = true; panStart = { x: clientX, y: clientY, vx: view.x, vy: view.y };
  lastPanPoint = { x: clientX, y: clientY, t: performance.now() };
  panVelocity = { x: 0, y: 0 };
  if (inertiaRAF) { cancelAnimationFrame(inertiaRAF); inertiaRAF = null; }
  canvas.classList.add('panning');
}
function updatePan(clientX, clientY) {
  view.x = panStart.vx + (clientX - panStart.x);
  view.y = panStart.vy + (clientY - panStart.y);
  const now = performance.now();
  if (lastPanPoint) {
    const dt = Math.max(1, now - lastPanPoint.t);
    panVelocity = { x: (clientX - lastPanPoint.x) / dt, y: (clientY - lastPanPoint.y) / dt };
  }
  lastPanPoint = { x: clientX, y: clientY, t: now };
  requestRender();
}
function endPanWithInertia() {
  isPanning = false; canvas.classList.remove('panning');
  let vx = panVelocity.x * 16, vy = panVelocity.y * 16;
  function step() {
    if (Math.abs(vx) < 0.05 && Math.abs(vy) < 0.05) { inertiaRAF = null; return; }
    view.x += vx; view.y += vy;
    vx *= 0.92; vy *= 0.92;
    requestRender();
    inertiaRAF = requestAnimationFrame(step);
  }
  inertiaRAF = requestAnimationFrame(step);
}

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  if (e.button === 2) { startPan(e.clientX, e.clientY); return; }
  const hit = nodeAtScreen(mx, my);
  if (hit) {
    draggingNode = hit.id;
    const p = nodePositions[hit.id];
    const [wx, wy] = screenToWorld(mx, my);
    dragOffset = { dx: wx - p.x, dy: wy - p.y };
    selectNode(hit.id);
  } else {
    startPan(e.clientX, e.clientY);
  }
});

window.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  if (isPanning) { updatePan(e.clientX, e.clientY); return; }
  if (draggingNode) {
    const [wx, wy] = screenToWorld(mx, my);
    const p = nodePositions[draggingNode];
    p.x = wx - dragOffset.dx; p.y = wy - dragOffset.dy;
    requestRender();
    return;
  }
  const hit = nodeAtScreen(mx, my);
  const newHover = hit ? hit.id : null;
  if (newHover !== hoveredNode) {
    hoveredNode = newHover;
    canvas.style.cursor = hit ? 'pointer' : 'grab';
    requestRender();
  }
});
window.addEventListener('mouseup', () => {
  if (isPanning) endPanWithInertia();
  draggingNode = null;
  canvas.classList.remove('panning');
});

/* ---------------- TOUCH / POINTER GESTURES ---------------- */
const activePointers = new Map();
let pinchStart = null; // {dist, midX, midY, scale, viewX, viewY}
let lastTapTime = 0, lastTapPos = null;
let longPressTimer = null;
let touchDragCandidate = null;

function pointDist(p1, p2) { return Math.hypot(p1.x - p2.x, p1.y - p2.y); }
function pointMid(p1, p2) { return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }; }

canvas.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'mouse') return; // mouse handled above
  canvas.setPointerCapture(e.pointerId);
  activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (activePointers.size === 1) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const hit = nodeAtScreen(mx, my);
    if (hit) {
      touchDragCandidate = hit.id;
      const p = nodePositions[hit.id];
      const [wx, wy] = screenToWorld(mx, my);
      dragOffset = { dx: wx - p.x, dy: wy - p.y };
    } else {
      touchDragCandidate = null;
      startPan(e.clientX, e.clientY);
    }
    longPressTimer = setTimeout(() => {
      const h = nodeAtScreen(mx, my);
      if (h) showContextMenu(h, e.clientX, e.clientY);
    }, 550);

    const now = performance.now();
    if (lastTapPos && now - lastTapTime < 320 && pointDist(lastTapPos, { x: e.clientX, y: e.clientY }) < 30) {
      zoomAt(mx, my, 1.6);
      lastTapTime = 0; lastTapPos = null;
    } else {
      lastTapTime = now; lastTapPos = { x: e.clientX, y: e.clientY };
    }
  } else if (activePointers.size === 2) {
    clearTimeout(longPressTimer);
    isPanning = false; draggingNode = null; touchDragCandidate = null;
    const pts = [...activePointers.values()];
    const mid = pointMid(pts[0], pts[1]);
    pinchStart = { dist: pointDist(pts[0], pts[1]), midX: mid.x, midY: mid.y, scale: view.scale, viewX: view.x, viewY: view.y };
  }
});

canvas.addEventListener('pointermove', (e) => {
  if (e.pointerType === 'mouse') return;
  if (!activePointers.has(e.pointerId)) return;
  activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (activePointers.size === 2 && pinchStart) {
    const pts = [...activePointers.values()];
    const dist = pointDist(pts[0], pts[1]);
    const mid = pointMid(pts[0], pts[1]);
    const rect = canvas.getBoundingClientRect();
    const factor = dist / pinchStart.dist;
    view.scale = Math.min(Math.max(pinchStart.scale * factor, 0.15), 4);
    view.x = pinchStart.viewX + (mid.x - pinchStart.midX);
    view.y = pinchStart.viewY + (mid.y - pinchStart.midY);
    requestRender();
    return;
  }

  if (activePointers.size === 1) {
    if (longPressTimer && lastTapPos) {
      const moved = Math.hypot(e.clientX - lastTapPos.x, e.clientY - lastTapPos.y);
      if (moved > 12) clearTimeout(longPressTimer);
    }
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    if (touchDragCandidate) {
      const [wx, wy] = screenToWorld(mx, my);
      const p = nodePositions[touchDragCandidate];
      p.x = wx - dragOffset.dx; p.y = wy - dragOffset.dy;
      requestRender();
    } else if (isPanning) {
      updatePan(e.clientX, e.clientY);
    }
  }
});

function endPointer(e) {
  if (e.pointerType === 'mouse') return;
  clearTimeout(longPressTimer);
  const wasSingle = activePointers.size === 1;
  activePointers.delete(e.pointerId);
  if (activePointers.size < 2) pinchStart = null;
  if (wasSingle) {
    if (touchDragCandidate) {
      selectNode(touchDragCandidate);
      touchDragCandidate = null;
    } else if (isPanning) {
      endPanWithInertia();
    }
  }
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);

/* context menu (long-press / right side) */
let ctxTargetId = null;
const ctxMenu = document.getElementById('node-context-menu');
function showContextMenu(node, x, y) {
  ctxTargetId = node.id;
  ctxMenu.style.left = x + 'px';
  ctxMenu.style.top = y + 'px';
  ctxMenu.style.display = 'block';
}
function hideContextMenu() { ctxMenu.style.display = 'none'; ctxTargetId = null; }
document.addEventListener('click', (e) => { if (!ctxMenu.contains(e.target)) hideContextMenu(); });
document.getElementById('ctx-details').addEventListener('click', () => { if (ctxTargetId) { selectNode(ctxTargetId); openDrawerForCurrentDevice(); } hideContextMenu(); });
document.getElementById('ctx-center').addEventListener('click', () => { if (ctxTargetId) centerOn(ctxTargetId); hideContextMenu(); });
document.getElementById('ctx-finlex').addEventListener('click', () => { if (ctxTargetId && nodesById[ctxTargetId]?.url) window.open(nodesById[ctxTargetId].url, '_blank'); hideContextMenu(); });

/* ===================================================================
   SELECTION + DETAILS PANEL
=================================================================== */
function selectNode(id) {
  selectedNode = id;
  pathHighlightNodes = new Set(); pathHighlightEdges = new Set();
  requestRender();
  populateDetails(id);
  if (id) openDrawerForCurrentDevice(); else closeDrawerForCurrentDevice();
}

function isMobileLayout() { return window.matchMedia('(max-width: 1000px)').matches; }
function openDrawerForCurrentDevice() {
  if (isMobileLayout()) { document.getElementById('bottom-sheet').classList.add('open'); }
  else { document.getElementById('details-drawer').classList.add('open'); }
}
function closeDrawerForCurrentDevice() {
  document.getElementById('bottom-sheet').classList.remove('open');
  document.getElementById('details-drawer').classList.remove('open');
}

function buildDetailsHtml(n) {
  const cat = (n.category_path || []).map(c => `<span>${escapeHtml(c)}</span>`).join('');
  const out = outgoing[n.id] || [];
  const inc = incoming[n.id] || [];
  const directCount = out.length;
  const indirectCount = reachableForward(n.id).size - directCount;

  // timeline: own enactment date + dates of laws that amend/implement it (incoming edges), sorted
  const tlEvents = [{ id: n.id, date: n.date, self: true }];
  inc.forEach(e => { const s = nodesById[e.source]; if (s && s.date) tlEvents.push({ id: s.id, date: s.date, self: false }); });
  const withYear = tlEvents.map(ev => ({ ...ev, year: parseYear(ev.date) })).filter(ev => ev.year != null);
  withYear.sort((a, b) => a.year - b.year);
  let tlHtml = '';
  if (withYear.length) {
    const minY = withYear[0].year, maxY = withYear[withYear.length - 1].year;
    const span = Math.max(1, maxY - minY);
    tlHtml = `<div class="tl-track"><div class="tl-line"></div>` + withYear.map(ev => {
      const pct = ((ev.year - minY) / span) * 100;
      return `<div class="tl-dot ${ev.self ? 'self' : ''}" style="left:${pct}%;" title="${escapeHtml(ev.id)} (${ev.year})"></div>
              <div class="tl-year" style="left:${pct}%;">${ev.year}</div>`;
    }).join('') + `</div>`;
  } else {
    tlHtml = `<div style="color:#8b93a8;">Ei riittävästi päivämäärätietoa aikajanalle.</div>`;
  }

  return `
    <div class="card hero">
      <div class="card-body">
        <div class="name">${escapeHtml(n.name)}</div>
        <div class="citation">${escapeHtml(n.id)}</div>
        <span class="status-badge status-${n.status}">${STATUS_LABELS[n.status] || n.status}</span>
        <div class="breadcrumb" style="margin-top:10px;">${cat || '<span>Luokittelematon</span>'}</div>
      </div>
    </div>
    <div class="card open">
      <div class="card-head" data-toggle>Yleiskatsaus <span>▾</span></div>
      <div class="card-body">
        <p style="margin:0 0 8px;">Päivämäärä: ${n.date || '—'}</p>
        <p style="margin:0 0 8px;">Pykäliä indeksoitu: ${n.section_count ?? '—'}</p>
        ${n.url ? `<a class="finlex-link" href="${n.url}" target="_blank" rel="noopener">Avaa finlex.fi:ssä ↗</a>` : ''}
        <div class="impact-line">Tämä laki vaikuttaa suoraan <strong>${directCount}</strong> lakiin ja välillisesti <strong>${indirectCount}</strong> lakiin.</div>
      </div>
    </div>
    <div class="card open">
      <div class="card-head" data-toggle>Aikajana <span>▾</span></div>
      <div class="card-body">${tlHtml}</div>
    </div>
    <div class="card ${out.length ? 'open' : ''}">
      <div class="card-head" data-toggle>Viittaukset ulos (${out.length}) <span>▾</span></div>
      <div class="card-body"><ul class="ref-list">${out.map(e => refLine(e.target, e.label)).join('') || '<li>Ei tallennettuja</li>'}</ul></div>
    </div>
    <div class="card ${inc.length ? 'open' : ''}">
      <div class="card-head" data-toggle>Viitattu tässä (${inc.length}) <span>▾</span></div>
      <div class="card-body"><ul class="ref-list">${inc.map(e => refLine(e.source, e.label)).join('') || '<li>Ei tallennettuja</li>'}</ul></div>
    </div>
  `;
}

function wireDetailsInteractions(root) {
  root.querySelectorAll('[data-toggle]').forEach(el => {
    el.addEventListener('click', () => el.parentElement.classList.toggle('open'));
  });
  root.querySelectorAll('.ref-list li[data-id]').forEach(el => {
    el.addEventListener('click', () => {
      const targetId = el.getAttribute('data-id');
      selectNode(targetId);
      centerOn(targetId);
    });
  });
}

function populateDetails(id) {
  const n = nodesById[id];
  const drawerBody = document.getElementById('drawer-body');
  const bsBody = document.getElementById('bs-body');
  if (!n) {
    const empty = `<div class="empty-state"><div class="glyph">§</div>Valitse laki kartalta nähdäksesi sen tiedot, kategorian ja ristiviittaukset.</div>`;
    drawerBody.innerHTML = empty; bsBody.innerHTML = empty;
    return;
  }
  const html = buildDetailsHtml(n);
  drawerBody.innerHTML = html; wireDetailsInteractions(drawerBody);
  bsBody.innerHTML = html; wireDetailsInteractions(bsBody);
}

function refLine(targetId, label) {
  const t = nodesById[targetId];
  const name = t ? t.name : targetId;
  return `<li data-id="${escapeHtml(targetId)}"><span>${escapeHtml(truncate(name, 34))}</span><span style="color:#8b93a8">${escapeHtml(targetId)}</span></li>`;
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function centerOn(id) {
  const p = nodePositions[id];
  if (!p) return;
  centerViewOnWorld(p.x, p.y);
}

document.getElementById('drawer-close').addEventListener('click', () => selectNode(null));

document.addEventListener('pointerdown', (e) => {
  const drawer = document.getElementById('details-drawer');
  const sheet = document.getElementById('bottom-sheet');
  const clickedInsideDrawer = drawer.contains(e.target) || sheet.contains(e.target);
  const drawerIsOpen = drawer.classList.contains('open') || sheet.classList.contains('open');
  if (drawerIsOpen && !clickedInsideDrawer) selectNode(null);
}, true);

/* bottom sheet drag-to-close/expand */
(function setupBottomSheet() {
  const sheet = document.getElementById('bottom-sheet');
  const handle = document.getElementById('bs-handle-wrap');
  let startY = 0, startTranslate = 0, dragging = false;
  handle.addEventListener('pointerdown', (e) => {
    dragging = true; startY = e.clientY;
    sheet.style.transition = 'none';
    handle.setPointerCapture(e.pointerId);
  });
  handle.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dy = Math.max(0, e.clientY - startY);
    sheet.style.transform = `translateY(${dy}px)`;
  });
  function finishDrag(e) {
    if (!dragging) return;
    dragging = false;
    sheet.style.transition = '';
    const dy = e.clientY - startY;
    sheet.style.transform = '';
    if (dy > 90) selectNode(null);
  }
  handle.addEventListener('pointerup', finishDrag);
  handle.addEventListener('pointercancel', finishDrag);
})();

/* ===================================================================
   SEARCH + AUTOCOMPLETE
=================================================================== */
let acIndex = [];
function buildAutocompleteIndex() {
  acIndex = graphData.nodes.map(n => ({ id: n.id, name: n.name, hay: (n.name + ' ' + n.id).toLowerCase() }));
  const dl = document.getElementById('pf-datalist');
  dl.innerHTML = acIndex.map(n => `<option value="${escapeHtml(n.name)}">`).join('');
}

const searchInput = document.getElementById('search-input');
const autocompleteEl = document.getElementById('autocomplete');
let acActiveIndex = -1;

function runAutocomplete(term) {
  term = term.trim().toLowerCase();
  if (!term) { autocompleteEl.style.display = 'none'; autocompleteEl.innerHTML = ''; return; }
  const matches = acIndex.filter(n => n.hay.includes(term)).slice(0, 8);
  acActiveIndex = -1;
  if (!matches.length) {
    autocompleteEl.innerHTML = `<div class="ac-empty">Ei osumia haulle "${escapeHtml(term)}"</div>`;
    autocompleteEl.style.display = 'block';
    return;
  }
  autocompleteEl.innerHTML = matches.map((m, i) => `
    <div class="ac-item" data-id="${escapeHtml(m.id)}" data-idx="${i}">
      <div class="ac-name">${escapeHtml(m.name)}</div>
      <div class="ac-id">${escapeHtml(m.id)}</div>
    </div>`).join('');
  autocompleteEl.style.display = 'block';
  autocompleteEl.querySelectorAll('.ac-item').forEach(el => {
    el.addEventListener('click', () => pickSearchResult(el.getAttribute('data-id')));
  });
}
function pickSearchResult(id) {
  searchMatches = new Set([id]);
  selectNode(id); centerOn(id);
  autocompleteEl.style.display = 'none';
  searchInput.value = nodesById[id] ? nodesById[id].name : id;
}
searchInput.addEventListener('input', () => runAutocomplete(searchInput.value));
searchInput.addEventListener('focus', () => { if (searchInput.value) runAutocomplete(searchInput.value); });
searchInput.addEventListener('keydown', (e) => {
  const items = [...autocompleteEl.querySelectorAll('.ac-item')];
  if (e.key === 'ArrowDown') { e.preventDefault(); acActiveIndex = Math.min(items.length - 1, acActiveIndex + 1); updateAcActive(items); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); acActiveIndex = Math.max(0, acActiveIndex - 1); updateAcActive(items); }
  else if (e.key === 'Enter') {
    if (acActiveIndex >= 0 && items[acActiveIndex]) pickSearchResult(items[acActiveIndex].getAttribute('data-id'));
    else doSearch();
  } else if (e.key === 'Escape') { autocompleteEl.style.display = 'none'; }
});
function updateAcActive(items) {
  items.forEach((el, i) => el.classList.toggle('active', i === acActiveIndex));
  if (items[acActiveIndex]) items[acActiveIndex].scrollIntoView({ block: 'nearest' });
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) autocompleteEl.style.display = 'none';
});

function doSearch() {
  const term = searchInput.value.trim().toLowerCase();
  searchMatches = new Set();
  if (!term) { requestRender(); return; }
  graphData.nodes.forEach(n => {
    if (!isVisible(n)) return;
    if ((n.name || '').toLowerCase().includes(term) || n.id.includes(term)) searchMatches.add(n.id);
  });
  if (searchMatches.size > 0) {
    const first = [...searchMatches][0];
    selectNode(first); centerOn(first);
  }
  autocompleteEl.style.display = 'none';
  requestRender();
}

/* ===================================================================
   FILTERS / TOGGLES
=================================================================== */
function toggleStatusVisibility(status, hide) {
  if (hide) hiddenStatuses.add(status); else hiddenStatuses.delete(status);
  if (selectedNode && hiddenStatuses.has(nodesById[selectedNode]?.status)) selectNode(null);
  requestRender(); drawMinimap();
}
document.getElementById('toggle-kumottu').addEventListener('change', (e) => toggleStatusVisibility('kumottu', e.target.checked));
document.getElementById('toggle-kumoutunut').addEventListener('change', (e) => toggleStatusVisibility('kumoutunut', e.target.checked));
document.getElementById('toggle-labels').addEventListener('change', (e) => { showLabels = e.target.checked; requestRender(); });
document.getElementById('toggle-animate').addEventListener('change', (e) => { animateGraph = e.target.checked; requestRender(); });
document.getElementById('toggle-colorblind').addEventListener('change', (e) => { document.body.classList.toggle('colorblind', e.target.checked); requestRender(); renderLegend(); });
document.getElementById('toggle-contrast').addEventListener('change', (e) => { document.body.classList.toggle('high-contrast', e.target.checked); requestRender(); renderLegend(); });

/* dropdown open/close helpers */
function setupDropdown(btnId, panelId) {
  const btn = document.getElementById(btnId), panel = document.getElementById(panelId);
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !panel.classList.contains('open');
    document.querySelectorAll('.dropdown-panel.open').forEach(p => p.classList.remove('open'));
    panel.classList.toggle('open', willOpen);
    btn.classList.toggle('active', willOpen);
  });
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== btn) { panel.classList.remove('open'); btn.classList.remove('active'); }
  });
}
setupDropdown('btn-filters', 'filters-panel');
setupDropdown('btn-tools', 'tools-panel');

/* ===================================================================
   LEGEND
=================================================================== */
function renderLegend() {
  const el = document.getElementById('legend');
  const seen = new Set();
  const statusEntries = Object.keys(STATUS_LABELS).filter(k => {
    const label = STATUS_LABELS[k];
    if (seen.has(label)) return false;
    seen.add(label); return true;
  });
  const statusHtml = statusEntries.map(k =>
    `<span class="swatch"><span class="dot" style="background:${cssVar(EDGE_COLOR_TO_STATUS_FALLBACK(k))}"></span>${STATUS_LABELS[k]}</span>`
  ).join('');
  const edgeHtml = Object.keys(EDGE_LABELS).map(k =>
    `<span class="swatch"><span class="ln" style="border-color:${cssVar(EDGE_COLOR_VAR[k])}"></span>${EDGE_LABELS[k]}</span>`
  ).join('') + `<span class="swatch"><span class="ln dashed" style="border-color:${cssVar('--unknown')}"></span>Kumottu/kumoutunut yhteys</span>`;

  el.innerHTML = `
    <div class="lg-section"><div class="lg-title">Tila</div>${statusHtml}</div>
    <div class="lg-section"><div class="lg-title">Yhteystyyppi</div>${edgeHtml}</div>
  `;
}
function EDGE_COLOR_TO_STATUS_FALLBACK(k) {
  return { voimassa: '--voimassa', kumottu: '--kumottu', kumoutunut: '--kumoutunut', unknown: '--voimassa', unscraped: '--unknown' }[k] || '--unknown';
}
document.getElementById('legend-toggle').addEventListener('click', () => {
  document.getElementById('legend').classList.toggle('open');
});

/* ===================================================================
   ZOOM CONTROLS
=================================================================== */
document.getElementById('zoom-in').addEventListener('click', () => { const r = pane.getBoundingClientRect(); zoomAt(r.width/2, r.height/2, 1.2); });
document.getElementById('zoom-out').addEventListener('click', () => { const r = pane.getBoundingClientRect(); zoomAt(r.width/2, r.height/2, 0.8); });
document.getElementById('zoom-home').addEventListener('click', () => resetView());

function resetView() {
  view = { x: 0, y: 0, scale: 1 };
  const rect = pane.getBoundingClientRect();
  view.x = rect.width / 2 - 600; view.y = rect.height / 2 - 420;
  requestRender();
}
/* ===================================================================
   TOOLBAR / LAYOUT SELECT
=================================================================== */
const layoutSelect = document.getElementById('layout-select');
const mmLayoutSelect = document.getElementById('mm-layout-select');
layoutSelect.addEventListener('change', () => { layoutManager.apply(layoutSelect.value, false); mmLayoutSelect.value = layoutSelect.value; });
mmLayoutSelect.addEventListener('change', () => { layoutSelect.value = mmLayoutSelect.value; layoutManager.apply(layoutSelect.value, false); });

document.getElementById('act-reset-view').addEventListener('click', resetView);
document.getElementById('act-reset-pos').addEventListener('click', () => { nodePositions = {}; layoutManager.apply(layoutSelect.value, true); });
document.getElementById('mm-reset-view').addEventListener('click', () => { resetView(); closeMobileMenu(); });
document.getElementById('mm-reset-pos').addEventListener('click', () => { nodePositions = {}; layoutManager.apply(layoutSelect.value, true); closeMobileMenu(); });

/* ===================================================================
   TIME SLIDER
=================================================================== */
let timePlaying = false, timePlayInterval = null;
function setupTimeSlider() {
  const years = graphData.nodes.map(n => parseYear(n.date)).filter(y => y != null);
  if (!years.length) return;
  const min = Math.min(...years), max = Math.max(...years);
  const slider = document.getElementById('time-slider');
  slider.min = min; slider.max = max; slider.value = max;
  document.getElementById('time-year').textContent = max;
}
function openTimeBar() { document.getElementById('time-bar').classList.add('open'); }
function closeTimeBar() {
  document.getElementById('time-bar').classList.remove('open');
  timeCutoffYear = null; stopTimePlay();
  requestRender();
}
document.getElementById('act-toggle-time').addEventListener('click', () => {
  const bar = document.getElementById('time-bar');
  if (bar.classList.contains('open')) closeTimeBar();
  else { openTimeBar(); timeCutoffYear = parseInt(document.getElementById('time-slider').value, 10); requestRender(); }
});
document.getElementById('time-close').addEventListener('click', closeTimeBar);
document.getElementById('time-slider').addEventListener('input', (e) => {
  timeCutoffYear = parseInt(e.target.value, 10);
  document.getElementById('time-year').textContent = timeCutoffYear;
  requestRender(); drawMinimap();
});
function stopTimePlay() {
  timePlaying = false; clearInterval(timePlayInterval);
  document.getElementById('time-play').textContent = '▶';
}
document.getElementById('time-play').addEventListener('click', () => {
  const slider = document.getElementById('time-slider');
  if (timePlaying) { stopTimePlay(); return; }
  timePlaying = true; document.getElementById('time-play').textContent = '⏸';
  timePlayInterval = setInterval(() => {
    let v = parseInt(slider.value, 10) + 1;
    if (v > parseInt(slider.max, 10)) v = parseInt(slider.min, 10);
    slider.value = v;
    timeCutoffYear = v;
    document.getElementById('time-year').textContent = v;
    requestRender(); drawMinimap();
  }, 450);
});

/* ===================================================================
   PATH FINDER
=================================================================== */
function findNodeByQuery(q) {
  q = (q || '').trim().toLowerCase();
  if (!q) return null;
  return graphData.nodes.find(n => n.id.toLowerCase() === q) ||
         graphData.nodes.find(n => n.name.toLowerCase() === q) ||
         graphData.nodes.find(n => n.name.toLowerCase().includes(q) || n.id.toLowerCase().includes(q));
}
function shortestPath(fromId, toId) {
  if (fromId === toId) return [fromId];
  const prev = new Map();
  const visited = new Set([fromId]);
  const queue = [fromId];
  while (queue.length) {
    const cur = queue.shift();
    for (const nb of neighborsOf(cur)) {
      if (!visited.has(nb)) {
        visited.add(nb); prev.set(nb, cur); queue.push(nb);
        if (nb === toId) {
          const path = [toId]; let c = toId;
          while (prev.has(c)) { c = prev.get(c); path.unshift(c); }
          return path;
        }
      }
    }
  }
  return null;
}
document.getElementById('act-toggle-path').addEventListener('click', () => {
  document.getElementById('path-panel').classList.toggle('open');
});
document.getElementById('path-close').addEventListener('click', () => document.getElementById('path-panel').classList.remove('open'));
document.getElementById('path-find-btn').addEventListener('click', () => {
  const a = findNodeByQuery(document.getElementById('path-from').value);
  const b = findNodeByQuery(document.getElementById('path-to').value);
  const resultEl = document.getElementById('path-result');
  if (!a || !b) { resultEl.textContent = 'Molemmat lait täytyy löytyä hausta.'; return; }
  const path = shortestPath(a.id, b.id);
  if (!path) {
    resultEl.textContent = `Reittiä lakien ${a.id} ja ${b.id} välillä ei löytynyt.`;
    pathHighlightNodes = new Set(); pathHighlightEdges = new Set();
  } else {
    pathHighlightNodes = new Set(path);
    pathHighlightEdges = new Set();
    for (let i = 0; i < path.length - 1; i++) pathHighlightEdges.add(path[i] + '|' + path[i+1]);
    resultEl.innerHTML = `Reitti (${path.length - 1} askelta):<br>` + path.map(id => escapeHtml(nodesById[id]?.name || id)).join(' → ');
  }
  requestRender();
});

/* ===================================================================
   MINIMAP TOGGLE
=================================================================== */
document.getElementById('act-toggle-minimap').addEventListener('click', () => {
  const wrap = document.getElementById('minimap-wrap');
  wrap.style.display = (wrap.style.display === 'none') ? 'block' : 'none';
  drawMinimap();
});

/* ===================================================================
   SAVED VIEWS (localStorage)
=================================================================== */
const SAVED_VIEWS_KEY = 'saadoskartta_saved_views';
function getSavedViews() {
  try { return JSON.parse(localStorage.getItem(SAVED_VIEWS_KEY) || '[]'); } catch (e) { return []; }
}
function setSavedViews(list) { localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(list)); }
function renderSavedViewsList() {
  const container = document.getElementById('saved-views-list');
  const views = getSavedViews();
  if (!views.length) { container.innerHTML = `<div style="padding:6px 6px;color:#8b93a8;font-size:11.5px;">Ei tallennettuja näkymiä.</div>`; return; }
  container.innerHTML = views.map((v, i) => `
    <div class="dp-row" style="gap:4px;">
      <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(v.name)}</span>
      <button class="dp-action" style="width:auto;padding:3px 8px;" data-load="${i}">Avaa</button>
      <button class="dp-action" style="width:auto;padding:3px 8px;color:var(--accent);" data-del="${i}">✕</button>
    </div>`).join('');
  container.querySelectorAll('[data-load]').forEach(btn => btn.addEventListener('click', () => loadSavedView(parseInt(btn.getAttribute('data-load'), 10))));
  container.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => {
    const list = getSavedViews(); list.splice(parseInt(btn.getAttribute('data-del'), 10), 1); setSavedViews(list); renderSavedViewsList();
  }));
}
function loadSavedView(i) {
  const v = getSavedViews()[i]; if (!v) return;
  layoutSelect.value = v.layout; layoutManager.apply(v.layout, false);
  view = { ...v.view };
  hiddenStatuses.clear(); (v.hiddenStatuses || []).forEach(s => hiddenStatuses.add(s));
  document.getElementById('toggle-kumottu').checked = hiddenStatuses.has('kumottu');
  document.getElementById('toggle-kumoutunut').checked = hiddenStatuses.has('kumoutunut');
  requestRender(); drawMinimap();
}
document.getElementById('act-save-view').addEventListener('click', () => {
  const name = prompt('Anna näkymälle nimi:');
  if (!name) return;
  const views = getSavedViews();
  views.push({ name, layout: layoutSelect.value, view: { ...view }, hiddenStatuses: [...hiddenStatuses] });
  setSavedViews(views); renderSavedViewsList();
});
renderSavedViewsList();

/* ===================================================================
   HELP MODAL
=================================================================== */
document.getElementById('btn-help').addEventListener('click', () => document.getElementById('help-overlay').classList.add('open'));
document.getElementById('help-close').addEventListener('click', () => document.getElementById('help-overlay').classList.remove('open'));
document.getElementById('help-overlay').addEventListener('click', (e) => { if (e.target.id === 'help-overlay') e.currentTarget.classList.remove('open'); });

/* ===================================================================
   MOBILE MENU + FAB
=================================================================== */
function openMobileMenu() { document.getElementById('mobile-menu').classList.add('open'); }
function closeMobileMenu() { document.getElementById('mobile-menu').classList.remove('open'); }
document.getElementById('btn-hamburger').addEventListener('click', openMobileMenu);
document.getElementById('mm-close').addEventListener('click', closeMobileMenu);
document.getElementById('mobile-menu').addEventListener('click', (e) => { if (e.target.id === 'mobile-menu') closeMobileMenu(); });
document.getElementById('mm-search').addEventListener('click', () => { closeMobileMenu(); searchInput.focus(); });
document.getElementById('mm-filters').addEventListener('click', () => { closeMobileMenu(); document.getElementById('filters-panel').classList.add('open'); });
document.getElementById('mm-legend').addEventListener('click', () => { closeMobileMenu(); document.getElementById('legend').classList.toggle('open'); });
document.getElementById('mm-time').addEventListener('click', () => { closeMobileMenu(); document.getElementById('act-toggle-time').click(); });
document.getElementById('mm-path').addEventListener('click', () => { closeMobileMenu(); document.getElementById('path-panel').classList.add('open'); });
document.getElementById('mm-help').addEventListener('click', () => { closeMobileMenu(); document.getElementById('help-overlay').classList.add('open'); });

const fab = document.getElementById('fab');
document.getElementById('fab-main').addEventListener('click', () => fab.classList.toggle('open'));
document.getElementById('fab-search').addEventListener('click', () => { fab.classList.remove('open'); searchInput.focus(); });
document.getElementById('fab-filters').addEventListener('click', () => { fab.classList.remove('open'); document.getElementById('filters-panel').classList.add('open'); });
document.getElementById('fab-center').addEventListener('click', () => { fab.classList.remove('open'); resetView(); });
document.getElementById('fab-legend').addEventListener('click', () => { fab.classList.remove('open'); document.getElementById('legend').classList.toggle('open'); });

/* ===================================================================
   INIT
=================================================================== */
resizeCanvas();
resetView();
loadGraph();
renderLoop();
