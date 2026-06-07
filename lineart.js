// ─── LCG Pseudo-random generator (seeded, deterministic) ───────────────────
function makeRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = Math.imul(s, 1664525) + 1013904223 >>> 0;
    return s / 0x100000000;
  };
}

// ─── Grayscale data from canvas ────────────────────────────────────────────
function extractGray(canvas, contrastLevel) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const imgData = ctx.getImageData(0, 0, width, height).data;
  const gray = new Float32Array(width * height);

  // Contrast: maps 1→0.25, 5→1.0, 10→2.5
  const factor = Math.pow(contrastLevel / 5, 1.4);

  for (let i = 0; i < gray.length; i++) {
    const r = imgData[i * 4];
    const g = imgData[i * 4 + 1];
    const b = imgData[i * 4 + 2];
    let lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    lum = (lum - 0.5) * factor + 0.5;
    gray[i] = Math.max(0, Math.min(1, lum));
  }
  return gray;
}

function px(gray, w, x, y) {
  return gray[y * w + x];
}

function pxClamped(gray, w, h, x, y) {
  const cx = Math.max(0, Math.min(w - 1, x));
  const cy = Math.max(0, Math.min(h - 1, y));
  return gray[cy * w + cx];
}

// Averaged brightness over a small area
function pxAvg(gray, w, h, x, y, r) {
  let s = 0, n = 0;
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      s += pxClamped(gray, w, h, x + dx, y + dy);
      n++;
    }
  }
  return s / n;
}

// ─── Sobel edge map ─────────────────────────────────────────────────────────
function sobelEdges(gray, w, h) {
  const edges = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const tl = gray[(y - 1) * w + (x - 1)], t = gray[(y - 1) * w + x], tr = gray[(y - 1) * w + (x + 1)];
      const ml = gray[y * w + (x - 1)],                                    mr = gray[y * w + (x + 1)];
      const bl = gray[(y + 1) * w + (x - 1)], b = gray[(y + 1) * w + x], br = gray[(y + 1) * w + (x + 1)];
      const gx = -tl - 2 * ml - bl + tr + 2 * mr + br;
      const gy = -tl - 2 * t  - tr + bl + 2 * b  + br;
      edges[y * w + x] = Math.min(1, Math.sqrt(gx * gx + gy * gy));
    }
  }
  return edges;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLE 1 — ENGRAVING
// Horizontal lines whose half-height at each x = (1-brightness)*maxHW
// ═══════════════════════════════════════════════════════════════════════════
function drawEngraving(ctx, gray, w, h, opts) {
  const { detail, density } = opts;

  // detail 1-10 → spacing 10-2
  const spacing = Math.max(2, Math.round(11 - detail));
  const maxHW   = spacing * 0.48 * (density / 5);
  const smooth  = Math.max(1, Math.round(spacing / 3));

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#000000';

  const halfY = Math.round(spacing / 2);

  for (let y = halfY; y < h; y += spacing) {
    // Build the half-width profile for this line
    const hw = new Float32Array(w);
    for (let x = 0; x < w; x++) {
      hw[x] = (1 - pxAvg(gray, w, h, x, y, smooth)) * maxHW;
    }

    // Check if anything to draw
    let any = false;
    for (let x = 0; x < w; x++) { if (hw[x] > 0.25) { any = true; break; } }
    if (!any) continue;

    // Draw filled shape: top edge L→R then bottom edge R→L
    ctx.beginPath();
    ctx.moveTo(0, y - hw[0]);
    for (let x = 1; x < w; x++) ctx.lineTo(x, y - hw[x]);
    for (let x = w - 1; x >= 0; x--) ctx.lineTo(x, y + hw[x]);
    ctx.closePath();
    ctx.fill();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLE 2 — HATCHING / CROSS-HATCHING
// Short diagonal strokes, denser in darker zones, cross-hatched in very dark
// ═══════════════════════════════════════════════════════════════════════════
function drawHatching(ctx, gray, w, h, opts) {
  const { detail, density } = opts;

  const cellSize  = Math.max(3, Math.round(15 - detail * 1.1));
  const lineW     = Math.max(0.4, 1.0 - detail * 0.04);
  const maxStrokes = Math.round(density * 0.9 + 2);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#000000';
  ctx.lineWidth   = lineW;
  ctx.lineCap     = 'round';

  const rng = makeRng(42);
  const A1  = Math.PI * 0.25;   // 45°
  const A2  = -Math.PI * 0.25;  // 135°
  const A3  = Math.PI * 0.5;    // 90°

  for (let cy = 0; cy < h; cy += cellSize) {
    for (let cx = 0; cx < w; cx += cellSize) {
      const cw = Math.min(cellSize, w - cx);
      const ch = Math.min(cellSize, h - cy);

      // Average brightness of cell
      let sum = 0;
      for (let dy = 0; dy < ch; dy++) {
        for (let dx = 0; dx < cw; dx++) {
          sum += pxClamped(gray, w, h, cx + dx, cy + dy);
        }
      }
      const brightness = sum / (cw * ch);
      const dark = 1 - brightness;

      if (dark < 0.06) continue;

      // Primary 45°
      const n1 = Math.ceil(dark * maxStrokes);
      for (let i = 0; i < n1; i++) strokeLine(ctx, cx, cy, cw, ch, A1, cellSize, rng);

      // Cross 135° for medium-dark
      if (dark > 0.38) {
        const n2 = Math.ceil((dark - 0.38) * maxStrokes * 0.9);
        for (let i = 0; i < n2; i++) strokeLine(ctx, cx, cy, cw, ch, A2, cellSize, rng);
      }

      // Third direction 90° for very dark
      if (dark > 0.65) {
        const n3 = Math.ceil((dark - 0.65) * maxStrokes * 0.7);
        for (let i = 0; i < n3; i++) strokeLine(ctx, cx, cy, cw, ch, A3, cellSize, rng);
      }
    }
  }
}

function strokeLine(ctx, cx, cy, cw, ch, angle, cellSize, rng) {
  const lx  = cx + rng() * cw;
  const ly  = cy + rng() * ch;
  const len = cellSize * (0.55 + rng() * 0.55);
  const a   = angle + (rng() - 0.5) * 0.28;
  const ca  = Math.cos(a), sa = Math.sin(a);
  const half = len / 2;
  ctx.beginPath();
  ctx.moveTo(lx - ca * half, ly - sa * half);
  ctx.lineTo(lx + ca * half, ly + sa * half);
  ctx.stroke();
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLE 3 — SCRIBBLE
// Phase A: trace detected edges with wobbly paths
// Phase B: random-walk fill weighted by darkness
// ═══════════════════════════════════════════════════════════════════════════
function initScribble(ctx, gray, w, h, opts) {
  const { detail, density } = opts;
  const rng = makeRng(99);
  const edges = sobelEdges(gray, w, h);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.lineCap   = 'round';
  ctx.lineJoin  = 'round';

  // Phase A — edge contours
  ctx.strokeStyle = 'rgba(0,0,0,0.72)';
  ctx.lineWidth   = 0.85;
  traceEdges(ctx, edges, gray, w, h, rng, detail);

  // Build walker list for async phase B
  const totalWalkers = Math.round(w * h * density * 0.016);
  const walkers = [];

  for (let i = 0; i < totalWalkers; i++) {
    const x = rng() * w;
    const y = rng() * h;
    const xi = x | 0, yi = y | 0;
    if (xi < 0 || xi >= w || yi < 0 || yi >= h) continue;
    const b = px(gray, w, xi, yi);
    const prob = Math.pow(1 - b, 1.9);
    if (rng() < prob) walkers.push({ x, y, b });
  }

  return { ctx, gray, w, h, rng, walkers };
}

function traceEdges(ctx, edges, gray, w, h, rng, detail) {
  const threshold = Math.max(0.08, 0.32 - detail * 0.018);
  const visited   = new Uint8Array(w * h);
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const maxLen = 18 + Math.round(detail * 4);

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      if (visited[idx] || edges[idx] < threshold) continue;
      if (rng() > 0.22) continue; // sample 22%

      const path = [[x, y]];
      visited[idx] = 1;
      let cx = x, cy = y;

      for (let step = 0; step < maxLen; step++) {
        let bx = -1, by = -1, bv = threshold * 0.7;
        for (const [dy, dx] of dirs) {
          const nx = cx + dx, ny = cy + dy;
          if (nx <= 0 || nx >= w - 1 || ny <= 0 || ny >= h - 1) continue;
          const ni = ny * w + nx;
          if (visited[ni]) continue;
          const v = edges[ni];
          if (v > bv) { bv = v; bx = nx; by = ny; }
        }
        if (bx === -1) break;
        path.push([bx, by]);
        visited[by * w + bx] = 1;
        cx = bx; cy = by;
      }

      if (path.length < 3) continue;

      ctx.beginPath();
      ctx.moveTo(path[0][0] + (rng() - 0.5) * 1.6, path[0][1] + (rng() - 0.5) * 1.6);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i][0] + (rng() - 0.5) * 1.6, path[i][1] + (rng() - 0.5) * 1.6);
      }
      ctx.stroke();
    }
  }
}

function runScribbleWalkers(state, batchSize) {
  const { ctx, gray, w, h, rng, walkers } = state;

  const end = Math.min(state.index + batchSize, walkers.length);
  for (let i = state.index; i < end; i++) {
    const { x, y, b } = walkers[i];
    const alpha = (0.22 + (1 - b) * 0.32).toFixed(2);
    ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
    ctx.lineWidth   = 0.65 + rng() * 0.35;
    scribblePath(ctx, gray, w, h, x, y, rng);
  }

  state.index = end;
  return state.index >= walkers.length;
}

function scribblePath(ctx, gray, w, h, sx, sy, rng) {
  const maxLen = 18 + rng() * 45;
  let x = sx, y = sy;
  let angle = rng() * Math.PI * 2;
  const step = 1.1 + rng() * 0.8;

  ctx.beginPath();
  ctx.moveTo(x, y);

  for (let i = 0; i < maxLen; i++) {
    angle += (rng() - 0.5) * 1.4;
    x += Math.cos(angle) * step;
    y += Math.sin(angle) * step;
    if (x < 0 || x >= w || y < 0 || y >= h) break;
    const b = pxClamped(gray, w, h, x | 0, y | 0);
    if (b > 0.9 && rng() > 0.12) break;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// ═══════════════════════════════════════════════════════════════════════════
// APP — UI logic
// ═══════════════════════════════════════════════════════════════════════════
const $ = id => document.getElementById(id);

const el = {
  uploadZone:    $('uploadZone'),
  fileInput:     $('fileInput'),
  uploadContent: $('uploadContent'),
  uploadPreview: $('uploadPreview'),
  previewImg:    $('previewImg'),
  uploadBtn:     $('uploadBtn'),
  changeBtn:     $('changeBtn'),
  detail:        $('detail'),
  contrast:      $('contrast'),
  density:       $('density'),
  detailValue:   $('detailValue'),
  contrastValue: $('contrastValue'),
  densityValue:  $('densityValue'),
  generateBtn:   $('generateBtn'),
  btnText:       $('btnText'),
  btnLoading:    $('btnLoading'),
  outputSection: $('outputSection'),
  outputCanvas:  $('outputCanvas'),
  downloadBtn:   $('downloadBtn'),
  regenerateBtn: $('regenerateBtn'),
  sourceCanvas:  $('sourceCanvas'),
};

let ready = false;
let generating = false;

// ── File upload ──────────────────────────────────────────────────────────
el.uploadBtn.addEventListener('click', () => el.fileInput.click());
el.changeBtn.addEventListener('click', () => el.fileInput.click());
el.fileInput.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });

el.uploadZone.addEventListener('click', e => {
  if (e.target === el.uploadBtn) return;
  if (!ready) el.fileInput.click();
});

el.uploadZone.addEventListener('dragover', e => {
  e.preventDefault();
  el.uploadZone.classList.add('drag-over');
});

el.uploadZone.addEventListener('dragleave', () => el.uploadZone.classList.remove('drag-over'));

el.uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  el.uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) loadFile(file);
});

function loadFile(file) {
  const reader = new FileReader();
  reader.onload = evt => {
    const img = new Image();
    img.onload = () => {
      // Resize to max 1000px
      const MAX = 1000;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        const r = Math.min(MAX / w, MAX / h);
        w = Math.round(w * r);
        h = Math.round(h * r);
      }
      el.sourceCanvas.width  = w;
      el.sourceCanvas.height = h;
      el.sourceCanvas.getContext('2d').drawImage(img, 0, 0, w, h);

      el.previewImg.src = evt.target.result;
      el.uploadContent.hidden = true;
      el.uploadPreview.hidden = false;
      ready = true;
      el.generateBtn.disabled = false;
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

// ── Sliders ──────────────────────────────────────────────────────────────
['detail', 'contrast', 'density'].forEach(id => {
  el[id].addEventListener('input', () => { el[id + 'Value'].textContent = el[id].value; });
});

// ── Generate ──────────────────────────────────────────────────────────────
el.generateBtn.addEventListener('click', generate);
el.regenerateBtn.addEventListener('click', generate);

async function generate() {
  if (generating || !ready) return;
  generating = true;

  el.btnText.hidden    = true;
  el.btnLoading.hidden = false;
  el.generateBtn.disabled = true;

  // Brief yield so browser repaints the loading state
  await new Promise(r => setTimeout(r, 30));

  try {
    const src     = el.sourceCanvas;
    const { width: w, height: h } = src;
    const detail  = +el.detail.value;
    const contrast = +el.contrast.value;
    const density = +el.density.value;
    const style   = document.querySelector('input[name="style"]:checked').value;

    const gray = extractGray(src, contrast);

    const out = el.outputCanvas;
    out.width  = w;
    out.height = h;
    const ctx = out.getContext('2d');

    if (style === 'engraving') {
      drawEngraving(ctx, gray, w, h, { detail, density });

    } else if (style === 'hatching') {
      drawHatching(ctx, gray, w, h, { detail, density });

    } else {
      // Scribble runs in async batches to keep UI responsive
      await new Promise(resolve => {
        const state = initScribble(ctx, gray, w, h, { detail, density });
        state.index = 0;
        const BATCH = 400;

        function tick() {
          const done = runScribbleWalkers(state, BATCH);
          if (done) resolve(); else requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }

    el.outputSection.hidden = false;
    el.outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (err) {
    console.error(err);
    alert('Ocurrió un error al generar. Prueba con otra imagen.');
  } finally {
    generating = false;
    el.btnText.hidden    = false;
    el.btnLoading.hidden = true;
    el.generateBtn.disabled = false;
  }
}

// ── Download ──────────────────────────────────────────────────────────────
el.downloadBtn.addEventListener('click', () => {
  const a = document.createElement('a');
  a.download = 'lineart.png';
  a.href = el.outputCanvas.toDataURL('image/png');
  a.click();
});
