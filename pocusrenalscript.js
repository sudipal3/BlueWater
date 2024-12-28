const sectionOrder = ['time', 'indication', 'views', 'findings', 'interpretation'];

// Function to handle adding text when a button is pressed
function addText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${capitalize(formatSectionName(sectionName))}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');
    if (!outputText.textContent.includes(text)) {
        outputText.textContent += (outputText.textContent ? ', ' : '') + text;
    }

    button.classList.add('pressed');
    reorderSections(outputArea);
    addMainHeader();
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

function handleTimeButtonClick(button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${capitalize(formatSectionName(sectionName))}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    if (!outputText.textContent.includes(currentTime)) {
        outputText.textContent = currentTime;
    }

    reorderSections(outputArea);
    addMainHeader();
}

function updateRealTimeText(sectionTitle, textareaId) {
    const textarea = document.getElementById(textareaId);
    const sectionName = textareaId.replace('Text', '');
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
        if (!outputText.textContent.includes(newText)) {
            outputText.textContent += (outputText.textContent ? ', ' : '') + newText;
        }
    } else {
        sectionDiv.remove();
        const buttons = document.querySelectorAll(`button[data-section="${sectionName}"]`);
        buttons.forEach(button => button.classList.remove('pressed'));
    }

    reorderSections(outputArea);
    addMainHeader();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatSectionName(section) {
    return section.replace(/([A-Z])/g, ' $1').replace(/^[a-z]/, match => match.toUpperCase()).trim();
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
        outputArea.insertAdjacentHTML('afterbegin', `<h2>POCUS: Renal</h2><br>`);
    }
}

function removeMainHeader() {
    const outputArea = document.getElementById('outputArea');
    if (!outputArea.innerHTML.trim()) {
        const header = outputArea.querySelector('h2');
        if (header) {
            header.remove();
        }
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
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = '';
    document.querySelectorAll('.pressed').forEach(button => {
        button.classList.remove('pressed');
    });
    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.value = '';
    });
    removeMainHeader();
}
