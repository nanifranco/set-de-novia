// Hatching effect — short directional strokes with multi-layer density

const HatchingEffect = {
    id: 'hatching',
    name: 'Hatching',
    icon: '⟋',
    description: 'Trazos cortos y diagonales que crean textura',
    paramsConfig: [
        { id: 'spacing',   label: 'Espaciado',      type: 'range', min: 4,   max: 24,  value: 10, step: 1 },
        { id: 'strokeLen', label: 'Largo del trazo', type: 'range', min: 5,   max: 35,  value: 14, step: 1 },
        { id: 'maxLayers', label: 'Capas máximas',   type: 'range', min: 1,   max: 4,   value: 3,  step: 1 },
        { id: 'angle',     label: 'Ángulo base (°)', type: 'range', min: 0,   max: 170, value: 45, step: 5 },
        { id: 'jitter',    label: 'Variación pos.',  type: 'range', min: 0,   max: 100, value: 35, step: 5 },
        { id: 'lineWidth', label: 'Grosor línea',    type: 'range', min: 0.3, max: 2.5, value: 0.8, step: 0.1 },
    ],

    _buildStrokes(data, width, height, params) {
        const { spacing, strokeLen, maxLayers, angle, jitter } = params;
        const baseAngle = angle * Math.PI / 180;
        const jitterAmt = jitter / 100 * spacing * 0.9;
        const rng = seededRandom(7);
        const strokes = [];

        for (let y = spacing / 2; y < height; y += spacing) {
            for (let x = spacing / 2; x < width; x += spacing) {
                const brightness = sampleAreaBrightness(data, x - spacing/2, y - spacing/2, spacing, spacing, width, height);
                const numLayers = Math.round((1 - brightness) * maxLayers);
                for (let l = 0; l < numLayers; l++) {
                    const a = baseAngle + l * (Math.PI / 4);
                    const jx = (rng() - 0.5) * jitterAmt * 2;
                    const jy = (rng() - 0.5) * jitterAmt * 2;
                    const len = strokeLen * (0.75 + 0.5 * rng()) * (0.6 + 0.4 * (1 - brightness));
                    const cx = x + jx, cy = y + jy;
                    const dx = Math.cos(a) * len / 2;
                    const dy = Math.sin(a) * len / 2;
                    strokes.push([cx - dx, cy - dy, cx + dx, cy + dy]);
                }
            }
        }
        return strokes;
    },

    render(ctx, data, width, height, params, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = params.lineWidth || 0.8;
        ctx.lineCap = 'round';
        const strokes = this._buildStrokes(data, width, height, params);
        ctx.beginPath();
        for (const [x1, y1, x2, y2] of strokes) {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
        }
        ctx.stroke();
    },

    generateSVGPaths(data, width, height, params, color, lw) {
        const strokes = this._buildStrokes(data, width, height, params);
        const d = strokes.map(([x1,y1,x2,y2]) =>
            `M${x1.toFixed(1)},${y1.toFixed(1)}L${x2.toFixed(1)},${y2.toFixed(1)}`
        ).join(' ');
        return [`<path d="${d}" stroke="${color}" stroke-width="${lw || 0.8}" fill="none" stroke-linecap="round"/>`];
    }
};
