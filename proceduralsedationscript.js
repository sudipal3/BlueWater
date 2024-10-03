// Define the Procedural Sedation sections object to store the pressed button values
let sedationSections = {
    'Consent': [],
    'Indication': [],
    'Pre-sedation assessment': [],
    'Preparation/monitoring': [],
    'Medication': [],
    'Complications': [],
    'Post-procedure assessment': [],
    'Total time spent at bedside': [],
    'Provider': []
};

// Function to handle button clicks for Procedural Sedation sections with multiple selections
function handleButtonClick(button, description) {
    const section = button.getAttribute('data-section');

    // Toggle the button's pressed state
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');

        // Remove the description from the sedationSections array for this section
        sedationSections[section] = sedationSections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');

        // Add the description to the sedationSections array for this section
        sedationSections[section].push(description);
    }

    // Update the Procedural Sedation output with the new values
    updateSedationOutput();
}

// Function to handle real-time text input (free text) and append to existing output
function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();

    // Append the new text to existing button-generated output if any
    if (textValue) {
        if (Array.isArray(sedationSections[section])) {
            sedationSections[section].push(textValue);
        } else {
            sedationSections[section] = (sedationSections[section] ? sedationSections[section] + ', ' : '') + textValue;
        }
    }

    // Update the Procedural Sedation output
    updateSedationOutput();
}

// Function to update the Procedural Sedation Output
function updateSedationOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = ''; // Clear the existing output

    // Create the main Procedural Sedation Interpretation header
    const mainHeader = document.createElement('h2');
    mainHeader.textContent = 'Procedure Note: Procedural Sedation';
    outputArea.appendChild(mainHeader);

    // Generate detailed outputs for each section
    for (const section in sedationSections) {
        if (sedationSections[section] && (Array.isArray(sedationSections[section]) ? sedationSections[section].length > 0 : sedationSections[section])) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<strong>${section}:</strong> ${Array.isArray(sedationSections[section]) ? sedationSections[section].join(', ') : sedationSections[section]}`;
            outputArea.appendChild(sectionDiv);
        }
    }
}

// Function to clear the Procedural Sedation output and reset the buttons
function clearOutput() {
    // Reset all sections
    sedationSections = {
        'Consent': [],
        'Indication': [],
        'Pre-sedation assessment': [],
        'Preparation/monitoring': [],
        'Medication': [],
        'Complications': [],
        'Post-procedure assessment': [],
        'Total time spent at bedside': [],
        'Provider': []
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
