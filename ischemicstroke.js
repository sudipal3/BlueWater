const sectionOrder = ['ct_scan_time', 'nih_score', 'thrombolytics', 'other_factors'];

function addText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');
    addMainHeader();

    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${formatSectionTitle(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');
    if (!outputText.textContent.includes(text)) {
        outputText.textContent += (outputText.textContent ? ', ' : '') + text;
    }

    button.classList.add('pressed');
    reorderSections(outputArea);
}

function removeText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const sectionDiv = document.getElementById(sectionId);

    if (sectionDiv) {
        const outputText = sectionDiv.querySelector('.output-text');
        outputText.textContent = outputText.textContent
            .split(', ')
            .filter(item => item !== text)
            .join(', ');

        if (!outputText.textContent.trim()) {
            sectionDiv.remove();
        }

        button.classList.remove('pressed');
        removeMainHeader();
    }
}

function handleButtonClick(button, text) {
    if (button.classList.contains('pressed')) {
        removeText(text, button);
    } else {
        addText(text, button);
    }
}

function updateRealTimeText(sectionTitle, textareaId) {
    const textarea = document.getElementById(textareaId);
    const sectionName = textareaId.replace('Text', '');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');
    addMainHeader();

    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${formatSectionTitle(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');
    const newText = textarea.value.trim();

    if (newText) {
        if (!outputText.textContent.includes(newText)) {
            outputText.textContent += (outputText.textContent ? ', ' : '') + newText;
        }
    } else {
        sectionDiv.remove();
        const buttons = document.querySelectorAll(`button[data-section="${sectionName}"]`);
        buttons.forEach(button => button.classList.remove('pressed'));
    }

    reorderSections(outputArea);
}

function formatSectionTitle(section) {
    return section
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .replace(/\bCt\b/i, 'CT')
        .replace(/\bNih\b/i, 'NIH');
}

function reorderSections(outputArea) {
    sectionOrder.forEach(section => {
        const sectionDiv = document.getElementById(`output-${section}`);
        if (sectionDiv) {
            outputArea.appendChild(sectionDiv);
        }
    });
}

function addMainHeader() {
    const outputArea = document.getElementById('outputArea');
    if (!outputArea.querySelector('h2')) {
        outputArea.insertAdjacentHTML('afterbegin',
            `<h2>Ischemic Stroke Management</h2><p>Due to a concern for stroke, the following actions were conducted after arrival to the emergency department:</p>`);
    }
}

function removeMainHeader() {
    const outputArea = document.getElementById('outputArea');
    if (outputArea.children.length === 1) {
        const header = outputArea.querySelector('h2');
        const paragraph = outputArea.querySelector('p');
        if (header) header.remove();
        if (paragraph) paragraph.remove();
    }
}

function copyToClipboard() {
    const outputArea = document.getElementById('outputArea');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}

function clearOutput() {
    document.getElementById('outputArea').innerHTML = '';
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));
    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
}
