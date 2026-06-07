// Typewriter / ASCII art effect

const TypewriterEffect = {
    id: 'typewriter',
    name: 'Typewriter',
    icon: 'Aa',
    description: 'Caracteres ASCII que forman la imagen',
    paramsConfig: [
        { id: 'charSize',    label: 'Tamaño carácter', type: 'range', min: 5,  max: 24,  value: 10, step: 1 },
        { id: 'charSetIdx',  label: 'Juego caracteres', type: 'select',
          options: [
            { value: 0, label: 'Clásico (@#Mvo.)' },
            { value: 1, label: 'Bloques (█▓▒░ )' },
            { value: 2, label: 'Símbolos (!|/;:,. )' },
          ],
          value: 0 },
        { id: 'bold',        label: 'Negrita',           type: 'checkbox', value: false },
        { id: 'spacing',     label: 'Espaciado extra',   type: 'range', min: 0, max: 6, value: 0, step: 1 },
    ],

    CHAR_SETS: [
        // From dark to light (indices 0=darkest ... end=lightest)
        '@WMQB#&8$%XYZFUOo0CJI)(}{][/\\|=+*;:!^,`\'". ',
        '█▓▒░ ',
        '!|/\\(){}[]#;:,.\' ',
    ],

    _getChars(charSetIdx) {
        return this.CHAR_SETS[charSetIdx] || this.CHAR_SETS[0];
    },

    _buildGrid(data, width, height, params) {
        const { charSize, charSetIdx, spacing } = params;
        const colW = charSize * 0.6 + spacing;
        const rowH = charSize + spacing;
        const chars = this._getChars(+charSetIdx);
        const last = chars.length - 1;
        const grid = [];

        for (let y = 0; y + rowH <= height + rowH; y += rowH) {
            const row = [];
            for (let x = 0; x + colW <= width + colW; x += colW) {
                const b = sampleAreaBrightness(data, x, y, colW, rowH, width, height);
                const idx = Math.round(b * last);
                row.push({ x, y, ch: chars[idx] });
            }
            grid.push(row);
        }
        return grid;
    },

    render(ctx, data, width, height, params, color) {
        const { charSize, bold } = params;
        const fontWeight = bold ? 'bold ' : '';
        ctx.font = `${fontWeight}${charSize}px "Courier New", monospace`;
        ctx.fillStyle = color;
        ctx.textBaseline = 'top';
        const grid = this._buildGrid(data, width, height, params);
        for (const row of grid) {
            for (const { x, y, ch } of row) {
                if (ch !== ' ') ctx.fillText(ch, x, y);
            }
        }
    },

    generateSVGPaths(data, width, height, params, color) {
        const { charSize, bold } = params;
        const fontWeight = bold ? 'bold ' : '';
        const grid = this._buildGrid(data, width, height, params);
        const texts = [];
        for (const row of grid) {
            for (const { x, y, ch } of row) {
                if (ch !== ' ') {
                    const escaped = ch.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
                    texts.push(`<text x="${x.toFixed(1)}" y="${(y + charSize).toFixed(1)}" font-size="${charSize}" font-family="Courier New, monospace" font-weight="${bold?'bold':'normal'}" fill="${color}">${escaped}</text>`);
                }
            }
        }
        return texts;
    }
};
