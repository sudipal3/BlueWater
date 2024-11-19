// Define the order of sections
const sectionOrder = ['Screening', 'BriefIntervention', 'MAT', 'Referral', 'TotalTimeSpent'];

// Function to initialize the output
function initializeOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = ''; // Clear existing output on load
}

// Function to ensure the header is present
function ensureHeader(outputArea) {
    const headerId = 'sbirtHeader';
    if (!document.getElementById(headerId)) {
        const headerDiv = document.createElement('div');
        headerDiv.id = headerId;
        headerDiv.innerHTML = `<h2>Screening, Brief Intervention, and Referral to Treatment (SBIRT) Note</h2><br>`;
        outputArea.insertAdjacentElement('afterbegin', headerDiv);
    }
}

// Function to handle button clicks
function handleButtonClick(button, text) {
    const sectionName = button.getAttribute('data-section');
    const sectionId = `output-${sectionName}`;
    const outputArea = document.getElementById('outputArea');

    // Ensure the header exists
    ensureHeader(outputArea);

    // Find or create the section div
    let sectionDiv = document.getElementById(sectionId);
    if (!sectionDiv) {
        sectionDiv = document.createElement('div');
        sectionDiv.id = sectionId;
        sectionDiv.innerHTML = `<strong>${formatSectionName(sectionName)}:</strong> <span class="output-text"></span><br>`;
        outputArea.appendChild(sectionDiv);
    }

    const outputText = sectionDiv.querySelector('.output-text');

    if (button.classList.contains('pressed')) {
        // Remove text if the button is unpressed
        const updatedText = outputText.textContent
            .split(', ')
            .filter(item => item !== text)
            .join(', ');
        outputText.textContent = updatedText;

        // Remove section if no text remains
        if (!updatedText.trim()) {
            sectionDiv.remove();
        }
        button.classList.remove('pressed');
    } else {
        // Add text and mark button as pressed
        if (!outputText.textContent.includes(text)) {
            outputText.textContent += (outputText.textContent ? ', ' : '') + text;
        }
        button.classList.add('pressed');
    }
}

// Function to handle real-time text updates
function updateRealTimeText(sectionTitle, textareaId) {
    const textarea = document.getElementById(textareaId);
    const sectionId = `output-${textareaId.replace('Text', '')}`;
    const outputArea = document.getElementById('outputArea');

    // Ensure the header exists
    ensureHeader(outputArea);

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
    if (section === 'MAT') return 'MAT'; // Special handling for MAT
    return section.replace(/([A-Z])/g, ' $1').trim();
}

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

// Function to clear the output area
function clearOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = '';
    initializeOutput();
    document.querySelectorAll('textarea').forEach(textarea => (textarea.value = ''));
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));
}

// Initialize the output on page load
document.addEventListener('DOMContentLoaded', initializeOutput);
