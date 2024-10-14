let pocusAbdomenSections = {
    Time: null,
    Indication: [],
    Views: [],
    Findings: [],
    Interpretation: []
};

function handleButtonClick(button, description) {
    const section = button.getAttribute('data-section');

    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        pocusAbdomenSections[section] = pocusAbdomenSections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');
        pocusAbdomenSections[section].push(description);
    }
    updatePOCUSAbdomenOutput();
}

function handleTimeButtonClick(button) {
    const section = button.getAttribute('data-section');
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    document.getElementById(`${section}Text`).value = time;
    pocusAbdomenSections[section] = time;

    updatePOCUSAbdomenOutput();
}

function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();

    if (textValue) {
        pocusAbdomenSections[section].push(textValue);
    }

    updatePOCUSAbdomenOutput();
}

function updatePOCUSAbdomenOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = '';

    const header = document.createElement('h2');
    header.textContent = 'POCUS Abdomen';
    outputArea.appendChild(header);

    for (const section in pocusAbdomenSections) {
        const values = pocusAbdomenSections[section];
        if (values.length > 0 || typeof values === 'string') {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${section}:</strong> ${Array.isArray(values) ? values.join(', ') : values}`;
            outputArea.appendChild(div);
        }
    }
}

function clearOutput() {
    pocusAbdomenSections = { Time: null, Indication: [], Views: [], Findings: [], Interpretation: [] };
    document.querySelectorAll('textarea').forEach(area => (area.value = ''));
    document.querySelectorAll('.pressed').forEach(btn => btn.classList.remove('pressed'));
    document.getElementById('outputArea').innerHTML = '';
}

function copyToClipboard() {
    const range = document.createRange();
    range.selectNode(document.getElementById('outputArea'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
}
