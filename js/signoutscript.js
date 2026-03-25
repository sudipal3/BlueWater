// signoutscript.js

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

// Ensure a section div exists with separate storage for button-text vs free-text
function ensureSectionDiv(sectionName, sectionTitle) {
    const outputArea = document.getElementById('outputArea');
    const sectionId = `output-${sectionName}`;

    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `
            <strong>${sectionTitle}:</strong>
            <span class="output-text"></span><br>
            <span class="button-store" style="display:none;"></span>
            <span class="free-store" style="display:none;"></span>
        `;
        outputArea.appendChild(sectionDiv);
    }
    return sectionDiv;
}

// Combine stored button-text + free-text into the visible output-text
function renderSection(sectionDiv) {
    const buttonStore = sectionDiv.querySelector('.button-store').textContent.trim();
    const freeStore = sectionDiv.querySelector('.free-store').textContent.trim();

    let combined = '';
    if (buttonStore) combined += buttonStore;
    if (freeStore) combined += (combined ? ', ' : '') + freeStore;

    sectionDiv.querySelector('.output-text').textContent = combined;
}

// Button text handling (adds/removes from button-store, never overwritten by free text)
function addText(text, button) {
    const sectionName = button.dataset.section;
    const sectionTitle = formatSectionName(sectionName);
    const sectionDiv = ensureSectionDiv(sectionName, sectionTitle);

    const buttonStoreEl = sectionDiv.querySelector('.button-store');
    const currentItems = buttonStoreEl.textContent.trim()
        ? buttonStoreEl.textContent.trim().split(', ')
        : [];

    if (!currentItems.includes(text)) currentItems.push(text);

    buttonStoreEl.textContent = currentItems.join(', ');
    renderSection(sectionDiv);

    reorderSections(document.getElementById('outputArea'));
    button.classList.add('pressed');
}

function removeText(text, button) {
    const sectionName = button.dataset.section;
    const sectionDiv = document.getElementById(`output-${sectionName}`);
    if (!sectionDiv) return;

    const buttonStoreEl = sectionDiv.querySelector('.button-store');
    const freeStoreEl = sectionDiv.querySelector('.free-store');

    const newItems = buttonStoreEl.textContent.trim()
        ? buttonStoreEl.textContent.trim().split(', ').filter(item => item !== text)
        : [];

    buttonStoreEl.textContent = newItems.join(', ');
    renderSection(sectionDiv);

    // If BOTH button + free text are empty, remove the whole section
    const hasButtons = buttonStoreEl.textContent.trim().length > 0;
    const hasFree = freeStoreEl.textContent.trim().length > 0;
    if (!hasButtons && !hasFree) sectionDiv.remove();

    button.classList.remove('pressed');
}

function handleButtonClick(button, text) {
    button.classList.contains('pressed')
        ? removeText(text, button)
        : addText(text, button);
}

// Free text updates (stores into free-store, then renders combined output)
function updateRealTimeText(sectionTitle, textareaId) {
    const textarea = document.getElementById(textareaId);
    const sectionName = textareaId.replace('Text', '');
    const outputArea = document.getElementById('outputArea');

    // Only create the section if there's something to show (free text OR button text later)
    const sectionDiv = ensureSectionDiv(sectionName, sectionTitle);

    // Set free-text store (this is the key fix: do NOT overwrite button text)
    const freeStoreEl = sectionDiv.querySelector('.free-store');
    freeStoreEl.textContent = textarea.value.trim();

    renderSection(sectionDiv);

    // If BOTH button + free text are empty, remove the whole section
    const buttonStoreEl = sectionDiv.querySelector('.button-store');
    const hasButtons = buttonStoreEl.textContent.trim().length > 0;
    const hasFree = freeStoreEl.textContent.trim().length > 0;
    if (!hasButtons && !hasFree) sectionDiv.remove();

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
