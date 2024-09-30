// Define the POCUS IV Access sections object to store the pressed button values
let pocusIVAccessSections = {
    'Time': null,
    'Indication': [],
    'Location': [],
    'Equipment': [],
    'Technique and confirmation': [],
    'Interpretation': []
};

// Function to handle button clicks for POCUS IV Access sections with multiple selections
function handleButtonClick(button, description) {
    const section = button.getAttribute('data-section');

    // Toggle the button's pressed state
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');

        // Remove the description from the pocusIVAccessSections array for this section
        pocusIVAccessSections[section] = pocusIVAccessSections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');

        // Add the description to the pocusIVAccessSections array for this section
        pocusIVAccessSections[section].push(description);
    }

    // Update the POCUS IV Access output with the new values
    updatePOCUSIVAccessOutput();
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
    pocusIVAccessSections[section] = formattedTime;

    // Update the POCUS IV Access output
    updatePOCUSIVAccessOutput();
}

// Function to handle real-time text input (free text) and append to existing output
function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();

    // Append the new text to existing button-generated output if any
    if (textValue) {
        if (Array.isArray(pocusIVAccessSections[section])) {
            pocusIVAccessSections[section].push(textValue);
        } else {
            pocusIVAccessSections[section] = (pocusIVAccessSections[section] ? pocusIVAccessSections[section] + ', ' : '') + textValue;
        }
    } else {
        pocusIVAccessSections[section] = pocusIVAccessSections[section].filter(item => !item.includes(textValue));
    }

    // Update the POCUS IV Access output
    updatePOCUSIVAccessOutput();
}

// Function to update the POCUS IV Access Output
function updatePOCUSIVAccessOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = ''; // Clear the existing output

    // Create the main POCUS IV Access Interpretation header
    const mainHeader = document.createElement('h2');
    mainHeader.textContent = 'POCUS IV Access';
    outputArea.appendChild(mainHeader);

    // Generate detailed outputs for each section
    for (const section in pocusIVAccessSections) {
        if (pocusIVAccessSections[section] && (Array.isArray(pocusIVAccessSections[section]) ? pocusIVAccessSections[section].length > 0 : pocusIVAccessSections[section])) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<strong>${section}:</strong> ${Array.isArray(pocusIVAccessSections[section]) ? pocusIVAccessSections[section].join(', ') : pocusIVAccessSections[section]}`;
            outputArea.appendChild(sectionDiv);
        }
    }
}

// Function to clear the POCUS IV Access output and reset the buttons
function clearOutput() {
    // Reset all sections
    pocusIVAccessSections = {
        'Time': null,
        'Indication': [],
        'Location': [],
        'Equipment': [],
        'Technique and confirmation': [],
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
