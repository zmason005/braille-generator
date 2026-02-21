importScripts('https://na01.safelinks.protection.outlook.com/?url=https%3A%2F%2Funpkg.com%2Fliblouis-build%2Fliblouis.js&data=05%7C02%7C%7Ca7fcdad6e79542888de808de70dacd9a%7C84df9e7fe9f640afb435aaaaaaaaaaaa%7C1%7C0%7C639072282217653616%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=ZNTnO3kGYHMKs22kMsasVxG3jtuUXNJRUcqItC7XmjE%3D&reserved=0');

// Map Unicode Braille to Cell Numbers
const dotMap = {
    '⠀': '0', '⠁': '1', '⠂': '2', '⠃': '1-2', '⠄': '3', '⠅': '1-3', '⠆': '2-3', '⠇': '1-2-3',
    '⠈': '4', '⠉': '1-4', '⠊': '2-4', '⠋': '1-2-4', '⠌': '3-4', '⠍': '1-3-4', '⠎': '2-3-4', '⠏': '1-2-3-4',
    '⠐': '5', '⠑': '1-5', '⠒': '2-5', '⠓': '1-2-5', '⠔': '3-5', '⠕': '1-3-5', '⠖': '2-3-5', '⠗': '1-2-3-5',
    '⠘': '4-5', '⠙': '1-4-5', '⠚': '2-4-5', '⠛': '1-2-4-5', '⠜': '3-4-5', '⠝': '1-3-4-5', '⠞': '2-3-4-5', '⠟': '1-2-3-4-5',
    '⠠': '6', '⠡': '1-6', '⠢': '2-6', '⠣': '1-2-6', '⠤': '3-6', '⠥': '1-3-6', '⠦': '2-3-6', '⠧': '1-2-3-6',
    '⠨': '4-6', '⠩': '1-4-6', '⠪': '2-4-6', '⠫': '1-2-4-6', '⠬': '3-4-6', '⠭': '1-3-4-6', '⠮': '2-3-4-6', '⠯': '1-2-3-4-6',
    '⠰': '5-6', '⠱': '1-5-6', '⠲': '2-5-6', '⠳': '1-2-5-6', '⠴': '3-5-6', '⠵': '1-3-5-6', '⠶': '2-3-5-6', '⠷': '1-2-3-5-6',
    '⠸': '4-5-6', '⠹': '1-4-5-6', '⠺': '2-4-5-6', '⠻': '1-2-4-5-6', '⠼': '3-4-5-6', '⠽': '1-3-4-5-6', '⠾': '2-3-4-5-6', '⠿': '1-2-3-4-5-6'
};

function toCellNumbers(unicodeStr) {
    return Array.from(unicodeStr).map(char => `(${dotMap[char] || '?'})`).join(' '); }

self.onmessage = async (e) => {
    const lines = e.data.text.split(/\r?\n/);
    const louis = await liblouis;
    const results = new Set(); // Duplicates excluded automatically
    const prefixes = ["", "un", "in", "re", "dis", "de", "pre", "anti", "non", "multi", "over", "sub", "mis"];

    for (let i = 0; i < lines.length; i++) {
        const base = lines[i].trim().toLowerCase();
        if (!/^[a-z]+$/.test(base)) continue;

        for (let p of prefixes) {
            let word = p + base;
            let dots = louis.translateString('en-ueb-g2.ctb', word);
            
            if (dots.length === 5) {
                results.add(`${word}: ${toCellNumbers(dots)}`);
            }
        }

        if (i % 1000 === 0) {
            self.postMessage({ type: 'PROGRESS', progress: (i / lines.length) * 100, count: results.size });
        }
    }

    self.postMessage({ type: 'COMPLETE', result: Array.from(results).join('\n'), count: results.size }); };

