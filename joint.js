// Define the order of sections
const sectionOrder = ['consent', 'indication', 'location', 'ultrasound', 'technique', 'fluid', 'medications', 'complications', 'provider'];

// Add text when a button is pressed
function addText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${capitalize(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');
    if (!outputText.textContent.includes(text)) {
        outputText.textContent += (outputText.textContent ? ', ' : '') + text;
    }

    button.classList.add('pressed');
    reorderSections(outputArea);
    addMainHeader(outputArea);

    if (sectionName === 'ultrasound' && text.includes('dynamic ultrasound')) {
        generateAdditionalProcedureNote();
    }
}

// Remove text when a button is unpressed
function removeText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
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
    removeMainHeader(document.getElementById('outputArea'));

    if (sectionName === 'ultrasound' && text.includes('dynamic ultrasound')) {
        removeAdditionalProcedureNote();
    }
}

// Toggle button
function handleButtonClick(button, text) {
    if (button.classList.contains('pressed')) {
        removeText(text, button);
    } else {
        addText(text, button);
    }
}

// Generate extra ultrasound note (same as Paracentesis)
function generateAdditionalProcedureNote() {
    const outputArea = document.getElementById('outputArea');
    const additionalNoteId = 'additional-procedure-note';

    let existingNote = document.getElementById(additionalNoteId);
    if (existingNote) existingNote.remove();

    const additionalNote = document.createElement('div');
    additionalNote.id = additionalNoteId;
    additionalNote.innerHTML = `
        <h3>Procedure: POCUS MSK ultrasound</h3>
        <p><strong>Indication:</strong> evaluation for joint aspiration</p>
        <p><strong>Procedure:</strong> limited MSK/soft tissue ultrasound</p>
        <p><strong>Interpretation:</strong> a fluid collection was visualized for aspiration. Images were saved in medical record and/or PACS.</p>
    `;
    outputArea.appendChild(additionalNote);
}

// Remove ultrasound note
function removeAdditionalProcedureNote() {
    const note = document.getElementById('additional-procedure-note');
    if (note) note.remove();
}

// Handle free text
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
        const buttons = document.querySelectorAll(`button[data-section="${sectionName}"]`);
        buttons.forEach(button => button.classList.remove('pressed'));
    }

    reorderSections(outputArea);
    addMainHeader(outputArea);
    removeMainHeader(outputArea);
}

// Add header if not present
function addMainHeader(outputArea) {
    if (!outputArea.querySelector('h2') && outputArea.innerHTML.trim() !== '') {
        const mainTitle = document.querySelector('.form-section h2').innerText;
        outputArea.insertAdjacentHTML('afterbegin', `<h2>${mainTitle}</h2><br>`);
    }
}

// Remove header if empty
function removeMainHeader(outputArea) {
    if (!outputArea.innerHTML.trim()) {
        const header = outputArea.querySelector('h2');
        if (header) header.remove();
    }
}

// Maintain section order
function reorderSections(outputArea) {
    sectionOrder.forEach(section => {
        const sectionDiv = document.getElementById(`output-${section}`);
        if (sectionDiv) outputArea.appendChild(sectionDiv);
    });

    const additionalNote = document.getElementById('additional-procedure-note');
    if (additionalNote) outputArea.appendChild(additionalNote);
}

// Capitalize helper
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Copy output to clipboard
function copyToClipboard() {
    const outputArea = document.getElementById('outputArea');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}

// Clear output
function clearOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = '';
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));
    removeMainHeader(outputArea);
    removeAdditionalProcedureNote();
}
