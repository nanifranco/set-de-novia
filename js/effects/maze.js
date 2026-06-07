// Maze / Truchet tile effect — connected arcs whose density follows image darkness

const MazeEffect = {
    id: 'maze',
    name: 'Laberinto',
    icon: '⊞',
    description: 'Curvas continuas tipo laberinto',
    paramsConfig: [
        { id: 'cellSize',  label: 'Tamaño celda',     type: 'range', min: 6,   max: 30,  value: 14, step: 2 },
        { id: 'maxRings',  label: 'Anillos máximos',  type: 'range', min: 1,   max: 5,   value: 3,  step: 1 },
        { id: 'threshold', label: 'Umbral de luz',    type: 'range', min: 50,  max: 100, value: 85, step: 5 },
        { id: 'seed',      label: 'Semilla aleatoria',type: 'range', min: 1,   max: 999, value: 42, step: 1 },
        { id: 'lineWidth', label: 'Grosor línea',     type: 'range', min: 0.3, max: 2.5, value: 0.7, step: 0.1 },
    ],

    _buildTiles(data, width, height, params) {
        const { cellSize, maxRings, threshold, seed } = params;
        const rng = seededRandom(seed);
        const brightLimit = threshold / 100;
        const tiles = [];

        const cols = Math.ceil(width / cellSize);
        const rows = Math.ceil(height / cellSize);

        for (let gy = 0; gy < rows; gy++) {
            for (let gx = 0; gx < cols; gx++) {
                const x = gx * cellSize;
                const y = gy * cellSize;
                const c = Math.min(cellSize, width - x, height - y);
                if (c <= 0) continue;

                const b = sampleAreaBrightness(data, x, y, c, c, width, height);
                if (b >= brightLimit) continue;

                const numRings = Math.max(1, Math.round((1 - b / brightLimit) * maxRings));
                // Deterministic tile type: mix position hash with seeded random
                const type = ((gx * 13 + gy * 7) ^ Math.floor(rng() * 4)) % 2;

                tiles.push({ x, y, c, type, numRings });
            }
        }
        return tiles;
    },

    _drawArcs(ctx, x, y, c, type, numRings) {
        for (let ring = 1; ring <= numRings; ring++) {
            const r = (c / 2) * (ring / numRings);
            if (type === 0) {
                // top-edge-mid → left-edge-mid  around top-left corner
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI / 2);
                ctx.stroke();
                // bottom-edge-mid → right-edge-mid  around bottom-right corner
                ctx.beginPath();
                ctx.arc(x + c, y + c, r, Math.PI, 3 * Math.PI / 2);
                ctx.stroke();
            } else {
                // right-edge-mid → top-edge-mid  around top-right corner
                ctx.beginPath();
                ctx.arc(x + c, y, r, Math.PI / 2, Math.PI);
                ctx.stroke();
                // left-edge-mid → bottom-edge-mid  around bottom-left corner
                ctx.beginPath();
                ctx.arc(x, y + c, r, -Math.PI / 2, 0);
                ctx.stroke();
            }
        }
    },

    render(ctx, data, width, height, params, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = params.lineWidth || 0.7;
        ctx.lineCap = 'round';
        const tiles = this._buildTiles(data, width, height, params);
        for (const { x, y, c, type, numRings } of tiles) {
            this._drawArcs(ctx, x, y, c, type, numRings);
        }
    },

    generateSVGPaths(data, width, height, params, color, lw) {
        const tiles = this._buildTiles(data, width, height, params);
        const paths = [];

        for (const { x, y, c, type, numRings } of tiles) {
            for (let ring = 1; ring <= numRings; ring++) {
                const r = (c / 2) * (ring / numRings);
                const rf = r.toFixed(2);
                if (type === 0) {
                    paths.push(`M${(x+r).toFixed(2)},${y.toFixed(2)} A${rf},${rf} 0 0,1 ${x.toFixed(2)},${(y+r).toFixed(2)}`);
                    paths.push(`M${(x+c-r).toFixed(2)},${(y+c).toFixed(2)} A${rf},${rf} 0 0,1 ${(x+c).toFixed(2)},${(y+c-r).toFixed(2)}`);
                } else {
                    paths.push(`M${(x+c).toFixed(2)},${(y+r).toFixed(2)} A${rf},${rf} 0 0,1 ${(x+c-r).toFixed(2)},${y.toFixed(2)}`);
                    paths.push(`M${x.toFixed(2)},${(y+c-r).toFixed(2)} A${rf},${rf} 0 0,1 ${(x+r).toFixed(2)},${(y+c).toFixed(2)}`);
                }
            }
        }

        const d = paths.join(' ');
        return [`<path d="${d}" stroke="${color}" stroke-width="${lw || 0.7}" fill="none" stroke-linecap="round"/>`];
    }
};
