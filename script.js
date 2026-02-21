const startBtn = document.getElementById('startBtn');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const status = document.getElementById('status');

const worker = new Worker('worker.js');

const WORD_BANK_URL = "https://na01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fdwyl%2Fenglish-words%2Fmaster%2Fwords_alpha.txt&data=05%7C02%7C%7C5d91c31d2b96484cb48f08de70daf9ec%7C84df9e7fe9f640afb435aaaaaaaaaaaa%7C1%7C0%7C639072282948894080%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=D3%2B%2B%2FS1ErwjDQjsSS13diJBw0iR4UAxJViNssbbAbEU%3D&reserved=0";

startBtn.onclick = async () => {
    startBtn.disabled = true;
    progressContainer.style.display = 'block';
    status.innerText = "Fetching word bank from GitHub...";

    try {
        const response = await fetch(WORD_BANK_URL);
        const text = await response.text();
        status.innerText = "Word bank loaded. Starting background worker...";
        worker.postMessage({ text });
    } catch (err) {
        status.innerText = "Error fetching word bank: " + err.message;
        startBtn.disabled = false;
    }
};

worker.onmessage = (e) => {
    const { type, progress, result, count } = e.data;

    if (type === 'PROGRESS') {
        progressBar.style.width = `${progress}%`;
        status.innerText = `Processing: ${Math.round(progress)}% (Found ${count} matches)`;
    }

    if (type === 'COMPLETE') {
        status.innerText = `Complete! Found ${count} words. Downloading...`;
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ueb_5cell_dots.txt';
        a.click();
        startBtn.disabled = false;
    }
};

