let gcsScores = {
    'Eye': null,
    'Verbal': null,
    'Motor': null
};

let gcsTime = "";

function handleGCSButtonClick(button, category, score, description) {
    const buttons = button.parentElement.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('pressed'));
    button.classList.add('pressed');

    gcsScores[category] = { score, description };
    updateGCSOutput();
}

function handleTimeNow() {
    const now = new Date();
    const formatted = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    document.getElementById('timeText').value = formatted;
    gcsTime = `Time: ${formatted}`;
    updateGCSOutput();
}

function updateTimeText() {
    const val = document.getElementById('timeText').value.trim();
    gcsTime = val ? `Time: ${val}` : "";
    updateGCSOutput();
}

function updateGCSOutput() {
    const output = document.getElementById('gcsOutput');
    let total = 0;
    let lines = [];

    for (const category in gcsScores) {
        const entry = gcsScores[category];
        if (entry) {
            total += entry.score;
            lines.push(`<strong>${category} response:</strong> ${entry.description} (+${entry.score})`);
        }
    }

    let fullOutput = `<strong>Glasgow coma score: ${total}</strong><br><br>${lines.join('<br>')}`;
    if (gcsTime) fullOutput = `${gcsTime}<br><br>` + fullOutput;

    output.innerHTML = fullOutput;
}

function clearGCS() {
    gcsScores = {
        'Eye': null,
        'Verbal': null,
        'Motor': null
    };
    gcsTime = "";
    document.getElementById('timeText').value = "";
    document.querySelectorAll('.pressed').forEach(btn => btn.classList.remove('pressed'));
    document.getElementById('gcsOutput').innerHTML = '';
}

function copyToClipboard() {
    const outputArea = document.getElementById('gcsOutput');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}
