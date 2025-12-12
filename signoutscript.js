// Define the order of sections
const sectionOrder = ['ActiveProblem', 'VitalSignsReviewed', 'LabsReviewed', 'ImagingReviewed', 'GeneralCareComponents'];

// Function to initialize the output with the intro text
function initializeOutput() {
    const outputArea = document.getElementById('outputArea');
    const introTextId = 'introText';

    // Ensure the introText always exists
    if (!document.getElementById(introTextId)) {
        const introDiv = document.createElement('div');
        introDiv.id = introTextId;
        introDiv.innerHTML = `
            <h2>Signout Note</h2>
            <p>
                I have accepted signout on this patient at shift change. I have discussed their presentation and care to this point with the outgoing provider and have reviewed their chart with the following notable elements:
            </p>
        `;
        outputArea.appendChild(introDiv);
    }
}

// Function to add button-generated text
function addText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    // Find or create the section div
    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${formatSectionName(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');

    // Add button-generated text, ensuring no duplicates
    if (!outputText.textContent.includes(text)) {
        outputText.textContent += (outputText.textContent ? ', ' : '') + text;
    }
    
    // Ensure the sections are in the correct order
    reorderSections(outputArea);

    // Mark the button as pressed
    button.classList.add('pressed');
}

// Function to remove button-generated text
function removeText(text, button) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const sectionDiv = document.getElementById(sectionId);

    if (sectionDiv) {
        const outputText = sectionDiv.querySelector('.output-text');

        // Remove the button-generated text
        const updatedText = outputText.textContent
            .split(', ')
            .filter(item => item !== text)
            .join(', ');

        outputText.textContent = updatedText;

        // If no text remains, remove the section
        if (!updatedText.trim()) {
            sectionDiv.remove();
        }
    }

    // Unmark the button as pressed
    button.classList.remove('pressed');
}

// Function to handle button clicks
function handleButtonClick(button, text) {
    if (button.classList.contains('pressed')) {
        removeText(text, button);
    } else {
        addText(text, button);
    }
}

// Function to handle free text updates
function updateRealTimeText(sectionTitle, textareaId) {
    const textarea = document.getElementById(textareaId);
    const sectionId = `output-${textareaId.replace('Text', '')}`;
    const outputArea = document.getElementById('outputArea');

    // Find or create the section div
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
    }
}

// Function to format section names
function formatSectionName(section) {
    return section.replace(/([A-Z])/g, ' $1').trim();
}

// Function to reorder sections according to the predefined order
function reorderSections(outputArea) {
    sectionOrder.forEach(section => {
        const sectionDiv = document.getElementById(`output-${section}`);
        if (sectionDiv) {
            outputArea.appendChild(sectionDiv);
        }
    });
}

// Ensure the sections are in the correct order
reorderSections(outputArea);

// Function to copy output to clipboard
function copyToClipboard() {
    const outputArea = document.getElementById('outputArea');
    const tempElement = document.createElement('textarea');
    tempElement.value = outputArea.innerText;
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement);
}

// Function to clear the output area (except for introText)
function clearOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = '';
    initializeOutput();
    document.querySelectorAll('textarea').forEach(textarea => (textarea.value = ''));
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));
}

// Initialize the output on page load
document.addEventListener('DOMContentLoaded', initializeOutput);
