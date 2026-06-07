// Stipple effect — dots sampled by brightness, optionally connected by nearest-neighbor path

const StippleEffect = {
    id: 'stipple',
    name: 'Puntillismo',
    icon: '∷',
    description: 'Puntos densos en áreas oscuras, conectables para plotter',
    paramsConfig: [
        { id: 'cellSize',    label: 'Tamaño celda',      type: 'range',    min: 3,   max: 20,  value: 7,  step: 1 },
        { id: 'maxDots',     label: 'Puntos por celda',  type: 'range',    min: 1,   max: 5,   value: 2,  step: 1 },
        { id: 'dotRadius',   label: 'Radio punto',       type: 'range',    min: 0.3, max: 4,   value: 1,  step: 0.1 },
        { id: 'threshold',   label: 'Umbral de luz',     type: 'range',    min: 50,  max: 100, value: 90, step: 5 },
        { id: 'connectPath', label: 'Conectar con línea',type: 'checkbox', value: false },
        { id: 'seed',        label: 'Semilla aleatoria', type: 'range',    min: 1,   max: 999, value: 99, step: 1 },
    ],

    _buildDots(data, width, height, params) {
        const { cellSize, maxDots, threshold, seed } = params;
        const rng = seededRandom(seed);
        const brightLimit = threshold / 100;
        const dots = [];

        for (let y = 0; y < height; y += cellSize) {
            for (let x = 0; x < width; x += cellSize) {
                const b = sampleAreaBrightness(data, x, y, cellSize, cellSize, width, height);
                if (b >= brightLimit) continue;
                const numDots = Math.max(1, Math.round((1 - b / brightLimit) * maxDots));
                for (let d = 0; d < numDots; d++) {
                    const dx = rng() * cellSize;
                    const dy = rng() * cellSize;
                    const px = Math.min(x + dx, width - 1);
                    const py = Math.min(y + dy, height - 1);
                    dots.push([px, py]);
                }
            }
        }
        return dots;
    },

    _nearestNeighborPath(dots) {
        if (dots.length < 2) return dots;
        const MAX_NN = 2000;
        const pts = dots.length > MAX_NN
            ? dots.filter((_, i) => i % Math.ceil(dots.length / MAX_NN) === 0)
            : dots.slice();

        const visited = new Uint8Array(pts.length);
        const order = [0];
        visited[0] = 1;

        for (let step = 1; step < pts.length; step++) {
            const [cx, cy] = pts[order[step - 1]];
            let bestIdx = -1, bestDist = Infinity;
            for (let j = 0; j < pts.length; j++) {
                if (visited[j]) continue;
                const dx = pts[j][0] - cx, dy = pts[j][1] - cy;
                const dist = dx * dx + dy * dy;
                if (dist < bestDist) { bestDist = dist; bestIdx = j; }
            }
            if (bestIdx === -1) break;
            order.push(bestIdx);
            visited[bestIdx] = 1;
        }
        return order.map(i => pts[i]);
    },

    render(ctx, data, width, height, params, color) {
        const dots = this._buildDots(data, width, height, params);
        const r = params.dotRadius || 1;

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.6;

        if (params.connectPath) {
            const path = this._nearestNeighborPath(dots);
            if (path.length > 1) {
                ctx.beginPath();
                ctx.moveTo(path[0][0], path[0][1]);
                for (let i = 1; i < path.length; i++) ctx.lineTo(path[i][0], path[i][1]);
                ctx.stroke();
            }
        } else {
            ctx.beginPath();
            for (const [x, y] of dots) {
                ctx.moveTo(x + r, y);
                ctx.arc(x, y, r, 0, Math.PI * 2);
            }
            ctx.fill();
        }
    },

    generateSVGPaths(data, width, height, params, color, lw) {
        const dots = this._buildDots(data, width, height, params);
        const r = params.dotRadius || 1;

        if (params.connectPath) {
            const path = this._nearestNeighborPath(dots);
            if (path.length < 2) return [];
            let d = `M${path[0][0].toFixed(1)},${path[0][1].toFixed(1)}`;
            for (let i = 1; i < path.length; i++) {
                d += ` L${path[i][0].toFixed(1)},${path[i][1].toFixed(1)}`;
            }
            return [`<path d="${d}" stroke="${color}" stroke-width="${lw || 0.6}" fill="none" stroke-linecap="round"/>`];
        } else {
            const circles = dots.map(([x, y]) =>
                `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${color}"/>`
            );
            return circles;
        }
    }
};
