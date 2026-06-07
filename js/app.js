// PlotterArt Studio — main application logic

const EFFECTS = [HatchingEffect, TypewriterEffect, MazeEffect, SquiggleEffect, StippleEffect];

const state = {
    image: null,
    rawData: null,
    processedData: null,
    imgWidth: 0,
    imgHeight: 0,
    currentEffect: EFFECTS[0],
    params: {},
    strokeColor: '#000000',
    contrast: 0,
    brightness: 0,
    invert: false,
    rendering: false,
};

// ─── Bootstrap ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    setupUpload();
    setupStyleButtons();
    buildParamControls(EFFECTS[0]);
    setupGlobalControls();
    setupExport();
});

// ─── Upload ───────────────────────────────────────────────────────────────────

function setupUpload() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) loadImage(file);
    });
    fileInput.addEventListener('change', e => {
        if (e.target.files[0]) loadImage(e.target.files[0]);
    });
}

function loadImage(file) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
        const img = new Image();
        img.onload = () => {
            // Scale for preview (max 900px on longest side)
            const MAX = 900;
            let w = img.width, h = img.height;
            if (w > MAX || h > MAX) {
                const ratio = Math.min(MAX / w, MAX / h);
                w = Math.round(w * ratio);
                h = Math.round(h * ratio);
            }

            const offscreen = document.createElement('canvas');
            offscreen.width = w; offscreen.height = h;
            offscreen.getContext('2d').drawImage(img, 0, 0, w, h);

            state.rawData = offscreen.getContext('2d').getImageData(0, 0, w, h).data;
            state.imgWidth = w;
            state.imgHeight = h;
            state.image = img;

            document.getElementById('source-thumb').src = e.target.result;
            document.getElementById('workspace').classList.remove('hidden');
            document.getElementById('upload-section').classList.add('compact');

            applyAdjustments();
            renderEffect();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ─── Image Adjustments ───────────────────────────────────────────────────────

function applyAdjustments() {
    if (!state.rawData) return;
    state.processedData = preprocessImageData(
        state.rawData, state.imgWidth, state.imgHeight,
        state.contrast, state.brightness, state.invert
    );
}

// ─── Style Buttons ────────────────────────────────────────────────────────────

function setupStyleButtons() {
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const effect = EFFECTS.find(e => e.id === btn.dataset.style);
            if (effect) {
                state.currentEffect = effect;
                buildParamControls(effect);
                renderEffect();
            }
        });
    });
}

// ─── Param Controls ───────────────────────────────────────────────────────────

function buildParamControls(effect) {
    const container = document.getElementById('style-params');
    container.innerHTML = `<h3>${effect.name}</h3><p class="effect-desc">${effect.description}</p>`;

    // Initialize param values from effect defaults
    const currentVals = state.params[effect.id] || {};
    const newVals = {};

    for (const cfg of effect.paramsConfig) {
        newVals[cfg.id] = currentVals[cfg.id] !== undefined ? currentVals[cfg.id] : cfg.value;
    }
    state.params[effect.id] = newVals;

    for (const cfg of effect.paramsConfig) {
        const wrap = document.createElement('label');
        wrap.className = 'param-label';

        if (cfg.type === 'range') {
            const valSpan = document.createElement('span');
            valSpan.className = 'param-value';
            valSpan.textContent = newVals[cfg.id];

            const input = document.createElement('input');
            input.type = 'range';
            input.min = cfg.min; input.max = cfg.max;
            input.step = cfg.step || 1;
            input.value = newVals[cfg.id];
            input.id = `p_${cfg.id}`;

            input.addEventListener('input', () => {
                const v = parseFloat(input.value);
                state.params[state.currentEffect.id][cfg.id] = v;
                valSpan.textContent = v;
            });
            input.addEventListener('change', () => renderEffect());

            wrap.innerHTML = `<span>${cfg.label}</span>`;
            wrap.appendChild(input);
            wrap.appendChild(valSpan);

        } else if (cfg.type === 'checkbox') {
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = newVals[cfg.id];
            input.id = `p_${cfg.id}`;
            input.addEventListener('change', () => {
                state.params[state.currentEffect.id][cfg.id] = input.checked;
                renderEffect();
            });
            wrap.innerHTML = `<span>${cfg.label}</span>`;
            wrap.appendChild(input);

        } else if (cfg.type === 'select') {
            const select = document.createElement('select');
            select.id = `p_${cfg.id}`;
            for (const opt of (cfg.options || [])) {
                const o = document.createElement('option');
                o.value = opt.value; o.textContent = opt.label;
                if (opt.value == newVals[cfg.id]) o.selected = true;
                select.appendChild(o);
            }
            select.addEventListener('change', () => {
                state.params[state.currentEffect.id][cfg.id] = +select.value;
                renderEffect();
            });
            wrap.innerHTML = `<span>${cfg.label}</span>`;
            wrap.appendChild(select);
        }

        container.appendChild(wrap);
    }
}

// ─── Global Controls ──────────────────────────────────────────────────────────

function setupGlobalControls() {
    const bind = (id, prop, transform, extra) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('change', () => {
            state[prop] = transform ? transform(el.value) : el.value;
            if (extra) extra();
            if (state.image) { applyAdjustments(); renderEffect(); }
        });
        if (el.type === 'range') {
            el.addEventListener('input', () => {
                const v = transform ? transform(el.value) : el.value;
                const sp = el.parentElement.querySelector('.param-value');
                if (sp) sp.textContent = v;
            });
        }
    };

    bind('param-contrast',     'contrast',  Number);
    bind('param-brightness',   'brightness', Number);
    bind('param-invert',       'invert',     null,    () => { state.invert = document.getElementById('param-invert').checked; });
    bind('param-stroke-color', 'strokeColor');

    document.getElementById('render-btn').addEventListener('click', () => renderEffect(true));
}

// ─── Render ───────────────────────────────────────────────────────────────────

function renderEffect(force = false) {
    if (!state.processedData || state.rendering) return;
    state.rendering = true;

    const overlay = document.getElementById('render-overlay');
    overlay.classList.remove('hidden');

    setTimeout(() => {
        try {
            const canvas = document.getElementById('preview-canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = state.imgWidth;
            canvas.height = state.imgHeight;

            // White background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const params = state.params[state.currentEffect.id] || {};
            state.currentEffect.render(
                ctx, state.processedData,
                state.imgWidth, state.imgHeight,
                params, state.strokeColor
            );
        } finally {
            state.rendering = false;
            overlay.classList.add('hidden');
        }
    }, 20);
}

// ─── Export ───────────────────────────────────────────────────────────────────

function setupExport() {
    document.getElementById('export-svg-btn').addEventListener('click', exportSVG);
    document.getElementById('export-png-btn').addEventListener('click', exportPNG);
}

function exportSVG() {
    if (!state.processedData) return;
    const params = state.params[state.currentEffect.id] || {};
    const lw = params.lineWidth || 0.8;
    const paths = state.currentEffect.generateSVGPaths(
        state.processedData, state.imgWidth, state.imgHeight,
        params, state.strokeColor, lw
    );
    const svg = buildSVG(paths, state.imgWidth, state.imgHeight, '#ffffff');
    downloadFile(svg, 'plotterart.svg', 'image/svg+xml');
}

function exportPNG() {
    const canvas = document.getElementById('preview-canvas');
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'plotterart.png';
        a.click();
        URL.revokeObjectURL(url);
    });
}

function downloadFile(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
