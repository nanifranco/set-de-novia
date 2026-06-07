// Squiggle / wave effect — horizontal sine waves with amplitude driven by darkness

const SquiggleEffect = {
    id: 'squiggle',
    name: 'Garabato',
    icon: '∿',
    description: 'Ondas sinuosas continuas que crean densidad',
    paramsConfig: [
        { id: 'rowSpacing',    label: 'Espaciado filas',  type: 'range', min: 2,   max: 16,  value: 5,  step: 1 },
        { id: 'maxAmplitude',  label: 'Amplitud máxima',  type: 'range', min: 3,   max: 40,  value: 16, step: 1 },
        { id: 'wavelength',    label: 'Longitud de onda', type: 'range', min: 8,   max: 80,  value: 28, step: 2 },
        { id: 'freqMod',       label: 'Modulación freq.', type: 'range', min: 0,   max: 200, value: 80, step: 10 },
        { id: 'smooth',        label: 'Curvas suaves',    type: 'checkbox', value: true },
        { id: 'lineWidth',     label: 'Grosor línea',     type: 'range', min: 0.3, max: 2.5, value: 0.7, step: 0.1 },
    ],

    _buildRows(data, width, height, params) {
        const { rowSpacing, maxAmplitude, wavelength, freqMod } = params;
        const dx = 2; // horizontal step in pixels
        const fModFactor = freqMod / 100;
        const rows = [];

        for (let baseY = rowSpacing / 2; baseY < height; baseY += rowSpacing) {
            const points = [];
            let phase = 0;
            for (let x = 0; x <= width; x += dx) {
                const b = sampleBrightness(data, x, baseY, width, height);
                const dark = 1 - b;
                const amp = dark * maxAmplitude;
                // frequency also increases in dark areas
                const freq = (1 + dark * fModFactor);
                phase += (2 * Math.PI / wavelength) * freq * dx;
                const y = baseY + amp * Math.sin(phase);
                points.push([x, y]);
            }
            rows.push(points);
        }
        return rows;
    },

    render(ctx, data, width, height, params, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = params.lineWidth || 0.7;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const rows = this._buildRows(data, width, height, params);
        const useSmooth = params.smooth !== false;

        for (const pts of rows) {
            if (pts.length < 2) continue;
            ctx.beginPath();
            ctx.moveTo(pts[0][0], pts[0][1]);
            if (useSmooth) {
                for (let i = 1; i < pts.length - 1; i++) {
                    const mx = (pts[i][0] + pts[i + 1][0]) / 2;
                    const my = (pts[i][1] + pts[i + 1][1]) / 2;
                    ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
                }
                const last = pts[pts.length - 1];
                ctx.lineTo(last[0], last[1]);
            } else {
                for (let i = 1; i < pts.length; i++) {
                    ctx.lineTo(pts[i][0], pts[i][1]);
                }
            }
            ctx.stroke();
        }
    },

    generateSVGPaths(data, width, height, params, color, lw) {
        const rows = this._buildRows(data, width, height, params);
        const useSmooth = params.smooth !== false;
        const pathStrs = [];

        for (const pts of rows) {
            if (pts.length < 2) continue;
            let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
            if (useSmooth) {
                for (let i = 1; i < pts.length - 1; i++) {
                    const mx = ((pts[i][0] + pts[i + 1][0]) / 2).toFixed(1);
                    const my = ((pts[i][1] + pts[i + 1][1]) / 2).toFixed(1);
                    d += ` Q${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} ${mx},${my}`;
                }
                const last = pts[pts.length - 1];
                d += ` L${last[0].toFixed(1)},${last[1].toFixed(1)}`;
            } else {
                for (let i = 1; i < pts.length; i++) {
                    d += ` L${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)}`;
                }
            }
            pathStrs.push(d);
        }

        const combined = pathStrs.join(' ');
        return [`<path d="${combined}" stroke="${color}" stroke-width="${lw || 0.7}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`];
    }
};
