// dentalblockscript.js

// Define the order of sections
const sectionOrder = [
    'consent',
    'indication',
    'blocktype',
    'laterality',
    'technique',
    'medication',
    'postprocedure',
    'complications',
    'provider'
];

// Human-readable labels for output sections
const sectionLabelMap = {
    blocktype: 'Block Type',
    postprocedure: 'Post Procedure'
};

// Function to get display label
function getSectionLabel(sectionName) {
    return sectionLabelMap[sectionName] || capitalize(sectionName);
}

// Function to handle adding text when a button is pressed
function addText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${getSectionLabel(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');

    if (!outputText.textContent.includes(text)) {
        outputText.textContent += (outputText.textContent ? ', ' : '') + text;
    }

    button.classList.add('pressed');
    reorderSections(outputArea);
    addMainHeader(outputArea);
}

// Function to handle removing text when a button is unpressed
function removeText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    const sectionDiv = document.getElementById(sectionId);
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
    removeMainHeader(outputArea);
}

// Function to handle button clicks
function handleButtonClick(button, text) {
    if (button.classList.contains('pressed')) {
        removeText(text, button);
    } else {
        addText(text, button);
    }
}

// Function to handle real-time text input (free text)
function updateRealTimeText(sectionTitle, textareaId) {
    const textarea = document.getElementById(textareaId);
    const sectionName = sectionTitle.replace(/\s+/g, '-').toLowerCase();
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${sectionTitle}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');
    const newText = textarea.value.trim();

    if (newText) {
        outputText.textContent = outputText.textContent
            ? `${outputText.textContent}, ${newText}`
            : newText;
    } else {
        sectionDiv.remove();
        document.querySelectorAll(`button[data-section="${sectionName}"]`)
            .forEach(button => button.classList.remove('pressed'));
    }

    reorderSections(outputArea);
    addMainHeader(outputArea);
    removeMainHeader(outputArea);
}

// Header helpers
function addMainHeader(outputArea) {
    if (!outputArea.querySelector('h2') && outputArea.innerHTML.trim() !== '') {
        const mainTitle = document.querySelector('.form-section h2').innerText;
        outputArea.insertAdjacentHTML('afterbegin', `<h2>${mainTitle}</h2><br>`);
    }
}

function removeMainHeader(outputArea) {
    const hasContent = Array.from(outputArea.children).some(child => child.tagName !== 'H2');
    if (!hasContent) {
        const header = outputArea.querySelector('h2');
        if (header) header.remove();
        outputArea.innerHTML = '';
    }
}

// Reorder sections
function reorderSections(outputArea) {
    sectionOrder.forEach(section => {
        const sectionDiv = document.getElementById(`output-${section}`);
        if (sectionDiv) outputArea.appendChild(sectionDiv);
    });
}

// Utility
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Clipboard
function copyToClipboard() {
    const outputArea = document.getElementById('outputArea');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}

// Clear
function clearOutput() {
    document.getElementById('outputArea').innerHTML = '';
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));
}
