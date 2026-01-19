// Define the order of sections
const sectionOrder = [
    'TimeOfSignout',
    'PreviousProvider',
    'ActiveProblem',
    'VitalSignsReviewed',
    'LabsReviewed',
    'ImagingReviewed',
    'GeneralCareComponents'
];

// Initialize output with intro text
function initializeOutput() {
    const outputArea = document.getElementById('outputArea');
    if (!document.getElementById('introText')) {
        const introDiv = document.createElement('div');
        introDiv.id = 'introText';
        introDiv.innerHTML = `
            <h2>Signout Note</h2>
            <p>
                I have accepted signout on this patient at shift change. I have discussed their presentation and care to this point with the outgoing provider and have reviewed their chart with the following notable elements:
            </p>
        `;
        outputArea.appendChild(introDiv);
    }
}

// Insert current time for signout
function insertCurrentTime(button) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const textarea = document.getElementById('TimeOfSignoutText');
    textarea.value = timeString;
    updateRealTimeText('Time of signout', 'TimeOfSignoutText');
    button.classList.add('pressed');
}

// Button text handling
function addText(text, button) {
    const sectionName = button.dataset.section;
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${formatSectionName(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');
    if (!outputText.textContent.includes(text)) {
        outputText.textContent += (outputText.textContent ? ', ' : '') + text;
    }

    reorderSections(outputArea);
    button.classList.add('pressed');
}

function removeText(text, button) {
    const sectionName = button.dataset.section;
    const sectionDiv = document.getElementById(`output-${sectionName}`);
    if (!sectionDiv) return;

    const outputText = sectionDiv.querySelector('.output-text');
    outputText.textContent = outputText.textContent
        .split(', ')
        .filter(item => item !== text)
        .join(', ');

    if (!outputText.textContent.trim()) {
        sectionDiv.remove();
    }

    button.classList.remove('pressed');
}

function handleButtonClick(button, text) {
    button.classList.contains('pressed')
        ? removeText(text, button)
        : addText(text, button);
}

// Free text updates
function updateRealTimeText(sectionTitle, textareaId) {
    const textarea = document.getElementById(textareaId);
    const sectionName = textareaId.replace('Text', '');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv && textarea.value.trim()) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${sectionTitle}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    if (sectionDiv) {
        const outputText = sectionDiv.querySelector('.output-text');
        outputText.textContent = textarea.value.trim();
        if (!outputText.textContent) sectionDiv.remove();
    }

    reorderSections(outputArea);
}

// Helpers
function formatSectionName(section) {
    return section.replace(/([A-Z])/g, ' $1').trim();
}

function reorderSections(outputArea) {
    sectionOrder.forEach(section => {
        const div = document.getElementById(`output-${section}`);
        if (div) outputArea.appendChild(div);
    });
}

// Clipboard + Clear
function copyToClipboard() {
    const temp = document.createElement('textarea');
    temp.value = document.getElementById('outputArea').innerText;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
}

function clearOutput() {
    document.getElementById('outputArea').innerHTML = '';
    initializeOutput();
    document.querySelectorAll('textarea').forEach(t => (t.value = ''));
    document.querySelectorAll('.pressed').forEach(b => b.classList.remove('pressed'));
}

document.addEventListener('DOMContentLoaded', initializeOutput);
