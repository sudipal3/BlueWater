let rhythmStripSections = {
    'Time of Rhythm Strip': null,
    'Time of Interpretation': null,
    'Type': [],
    'Interpretation': [],
    'Prior Comparison': []
};

// Handle button clicks
function handleButtonClick(button, section, description) {
    const buttons = button.parentElement.querySelectorAll('button');

    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        rhythmStripSections[section] = rhythmStripSections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');
        rhythmStripSections[section].push(description);
    }
    updateRhythmStripOutput();
}

// Handle time button clicks
function handleTimeButtonClick(button, section, textAreaId) {
    const time = new Date();
    const formattedTime = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    document.getElementById(textAreaId).value = formattedTime;
    rhythmStripSections[section] = formattedTime;
    updateRhythmStripOutput();
}

// Update output
function updateRhythmStripOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = '';

    const header = document.createElement('h2');
    header.textContent = 'Procedure Note: Rhythm Strip Analysis';
    outputArea.appendChild(header);

    for (const section in rhythmStripSections) {
        if (rhythmStripSections[section] && (Array.isArray(rhythmStripSections[section]) ? rhythmStripSections[section].length > 0 : rhythmStripSections[section])) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<strong>${section}:</strong> ${Array.isArray(rhythmStripSections[section]) ? rhythmStripSections[section].join(', ') : rhythmStripSections[section]}`;
            outputArea.appendChild(sectionDiv);
        }
    }
}

// Handle free text
function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();
    if (textValue) {
        if (Array.isArray(rhythmStripSections[section])) {
            rhythmStripSections[section].push(textValue);
        } else {
            rhythmStripSections[section] = (rhythmStripSections[section] ? rhythmStripSections[section] + ', ' : '') + textValue;
        }
    } else {
        rhythmStripSections[section] = [];
    }
    updateRhythmStripOutput();
}

// Clear output
function clearOutput() {
    rhythmStripSections = {
        'Time of Rhythm Strip': null,
        'Time of Interpretation': null,
        'Type': [],
        'Interpretation': [],
        'Prior Comparison': []
    };
    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));
    document.getElementById('outputArea').innerHTML = '';
}

// Copy to clipboard
function copyToClipboard() {
    const range = document.createRange();
    range.selectNode(document.getElementById('outputArea'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
}
