// Define the POCUS Soft Tissue sections object to store the pressed button values
let pocusSoftTissueSections = {
    'Time': null,
    'Indication': [],
    'Location': [],
    'Findings': [],
    'Interpretation': []
};

// Function to handle button clicks for POCUS Soft Tissue sections with multiple selections
function handleButtonClick(button, description) {
    const section = button.getAttribute('data-section');

    // Toggle the button's pressed state
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');

        // Remove the description from the pocusSoftTissueSections array for this section
        pocusSoftTissueSections[section] = pocusSoftTissueSections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');

        // Add the description to the pocusSoftTissueSections array for this section
        pocusSoftTissueSections[section].push(description);
    }

    // Update the POCUS Soft Tissue output with the new values
    updatePOCUSSoftTissueOutput();
}

// Function to handle the time button click and output the formatted time
function handleTimeButtonClick(button) {
    const section = button.getAttribute('data-section');
    const time = new Date();
    const formattedTime = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Set the time in the associated textarea
    const textAreaId = section.replace(/\s/g, '') + 'Text';
    document.getElementById(textAreaId).value = formattedTime;

    // Update the section with the time value
    pocusSoftTissueSections[section] = formattedTime;

    // Update the POCUS Soft Tissue output
    updatePOCUSSoftTissueOutput();
}

// Function to handle real-time text input (free text) and append to existing output
function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();

    // Append the new text to existing button-generated output if any
    if (textValue) {
        if (Array.isArray(pocusSoftTissueSections[section])) {
            pocusSoftTissueSections[section].push(textValue);
        } else {
            pocusSoftTissueSections[section] = (pocusSoftTissueSections[section] ? pocusSoftTissueSections[section] + ', ' : '') + textValue;
        }
    }

    // Update the POCUS Soft Tissue output
    updatePOCUSSoftTissueOutput();
}

// Function to update the POCUS Soft Tissue Output
function updatePOCUSSoftTissueOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = ''; // Clear the existing output

    // Create the main POCUS Soft Tissue Interpretation header
    const mainHeader = document.createElement('h2');
    mainHeader.textContent = 'POCUS: Soft Tissue Interpretation';
    outputArea.appendChild(mainHeader);

    // Generate detailed outputs for each section
    for (const section in pocusSoftTissueSections) {
        if (pocusSoftTissueSections[section] && (Array.isArray(pocusSoftTissueSections[section]) ? pocusSoftTissueSections[section].length > 0 : pocusSoftTissueSections[section])) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<strong>${section}:</strong> ${Array.isArray(pocusSoftTissueSections[section]) ? pocusSoftTissueSections[section].join(', ') : pocusSoftTissueSections[section]}`;
            outputArea.appendChild(sectionDiv);
        }
    }
}

// Function to clear the POCUS Soft Tissue output and reset the buttons
function clearOutput() {
    // Reset all sections
    pocusSoftTissueSections = {
        'Time': null,
        'Indication': [],
        'Location': [],
        'Findings': [],
        'Interpretation': []
    };

    // Clear all text areas
    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');

    // Unpress all buttons
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));

    // Clear the output area
    document.getElementById('outputArea').innerHTML = '';
}

// Function to copy the output text to the clipboard
function copyToClipboard() {
    const outputArea = document.getElementById('outputArea');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges(); // Clear current selection
    window.getSelection().addRange(range); // Select the text
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // Deselect the text
}
