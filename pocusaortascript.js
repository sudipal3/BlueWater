// Define the POCUS sections object to store the pressed button values
let pocusSections = {
    'Time': null,
    'Indication': [],
    'Views': [],
    'Findings': [],
    'Interpretation': []
};

// Function to handle button clicks for POCUS sections with multiple selections
function handleButtonClick(button, description) {
    const section = button.getAttribute('data-section');

    // Toggle the button's pressed state
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');

        // Remove the description from the pocusSections array for this section
        pocusSections[section] = pocusSections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');

        // Add the description to the pocusSections array for this section
        pocusSections[section].push(description);
    }

    // Update the POCUS output with the new values
    updatePOCUSOutput();
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
    pocusSections[section] = formattedTime;

    // Update the POCUS output
    updatePOCUSOutput();
}

// Function to handle real-time text input (free text) and append to existing output
function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();

    // Append the new text to existing button-generated output if any
    if (textValue) {
        if (Array.isArray(pocusSections[section])) {
            // Replace any previous free-text for this section by:
            // 1) filtering out previous exact matches of textValue (if present),
            // 2) pushing the current textValue
            pocusSections[section] = pocusSections[section].filter(item => item !== textValue);
            pocusSections[section].push(textValue);
        } else {
            pocusSections[section] = (pocusSections[section] ? pocusSections[section] + ', ' : '') + textValue;
        }
    } else if (Array.isArray(pocusSections[section])) {
        // If textarea cleared, remove any items that were exactly the previous text.
        // Since we don't track the old value here, we’ll leave button selections as-is.
        // No change needed to keep button-generated text.
    }

    // Update the POCUS output
    updatePOCUSOutput();
}

// Function to update the POCUS Output
function updatePOCUSOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = ''; // Clear the existing output

    // Create the main POCUS Interpretation header
    const mainHeader = document.createElement('h2');
    mainHeader.textContent = 'POCUS: Aorta';
    outputArea.appendChild(mainHeader);

    // Generate detailed outputs for each section
    for (const section in pocusSections) {
        if (pocusSections[section] && (Array.isArray(pocusSections[section]) ? pocusSections[section].length > 0 : pocusSections[section])) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<strong>${section}:</strong> ${Array.isArray(pocusSections[section]) ? pocusSections[section].join(', ') : pocusSections[section]}`;
            outputArea.appendChild(sectionDiv);
        }
    }
}

// Function to clear the POCUS output and reset the buttons
function clearOutput() {
    // Reset all sections
    pocusSections = {
        'Time': null,
        'Indication': [],
        'Views': [],
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
