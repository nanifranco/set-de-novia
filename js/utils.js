// Utility functions shared across all effects

function getBrightness(data, x, y, width) {
    const i = (y * width + x) * 4;
    return (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
}

function sampleBrightness(data, x, y, width, height) {
    const px = Math.max(0, Math.min(Math.round(x), width - 1));
    const py = Math.max(0, Math.min(Math.round(y), height - 1));
    return getBrightness(data, px, py, width);
}

function sampleAreaBrightness(data, x, y, areaW, areaH, imgW, imgH) {
    let sum = 0, count = 0;
    const step = Math.max(1, Math.floor(Math.min(areaW, areaH) / 4));
    for (let dy = 0; dy < areaH; dy += step) {
        for (let dx = 0; dx < areaW; dx += step) {
            const px = Math.min(Math.floor(x + dx), imgW - 1);
            const py = Math.min(Math.floor(y + dy), imgH - 1);
            if (px >= 0 && py >= 0) {
                sum += getBrightness(data, px, py, imgW);
                count++;
            }
        }
    }
    return count > 0 ? sum / count : 1;
}

function seededRandom(seed) {
    let s = (seed ^ 0x5DEECE66D) >>> 0;
    return () => {
        s = ((Math.imul(s, 1664525) + 1013904223) & 0xFFFFFFFF) >>> 0;
        return s / 0x100000000;
    };
}

function preprocessImageData(originalData, width, height, contrast, brightness, invert) {
    const result = new Uint8ClampedArray(originalData.length);
    const cf = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < originalData.length; i += 4) {
        let r = originalData[i], g = originalData[i + 1], b = originalData[i + 2];
        r = cf * (r - 128) + 128 + brightness;
        g = cf * (g - 128) + 128 + brightness;
        b = cf * (b - 128) + 128 + brightness;
        if (invert) { r = 255 - r; g = 255 - g; b = 255 - b; }
        result[i] = Math.max(0, Math.min(255, r));
        result[i + 1] = Math.max(0, Math.min(255, g));
        result[i + 2] = Math.max(0, Math.min(255, b));
        result[i + 3] = 255;
    }
    return result;
}

function buildSVG(pathElements, width, height, bgColor) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}mm" height="${height}mm">
  <rect width="${width}" height="${height}" fill="${bgColor || 'white'}"/>
  ${pathElements.join('\n  ')}
</svg>`;
}
