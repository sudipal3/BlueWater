// Define the POCUS E-FAST sections object to store the pressed button values
let pocusFASTSections = {
    'Time': null,
    'Indication': [],
    'Hepatorenal view (RUQ)': [],
    'Cardiac view': [],
    'Splenorenal (LUQ)': [],
    'Bladder view': [],
    'Lung views': [],
    'Interpretation': []
};

// Function to handle button clicks for POCUS E-FAST sections with multiple selections
function handleButtonClick(button, description) {
    const section = button.getAttribute('data-section');

    // Toggle the button's pressed state
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');

        // Remove the description from the pocusFASTSections array for this section
        pocusFASTSections[section] = pocusFASTSections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');

        // Add the description to the pocusFASTSections array for this section
        pocusFASTSections[section].push(description);
    }

    // Update the POCUS E-FAST output with the new values
    updatePOCUSFASTOutput();
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
    pocusFASTSections[section] = formattedTime;

    // Update the POCUS E-FAST output
    updatePOCUSFASTOutput();
}

// Function to handle real-time text input (free text) and append to existing output
function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();

    // Append the new text to existing button-generated output if any
    if (textValue) {
        if (Array.isArray(pocusFASTSections[section])) {
            pocusFASTSections[section].push(textValue);
        } else {
            pocusFASTSections[section] = (pocusFASTSections[section] ? pocusFASTSections[section] + ', ' : '') + textValue;
        }
    } else {
        pocusFASTSections[section] = pocusFASTSections[section].filter(item => !item.includes(textValue));
    }

    // Update the POCUS E-FAST output
    updatePOCUSFASTOutput();
}

// Function to update the POCUS E-FAST Output
function updatePOCUSFASTOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = ''; // Clear the existing output

    // Create the main POCUS E-FAST Interpretation header
    const mainHeader = document.createElement('h2');
    mainHeader.textContent = 'POCUS E-FAST Interpretation';
    outputArea.appendChild(mainHeader);

    // Generate detailed outputs for each section
    for (const section in pocusFASTSections) {
        if (pocusFASTSections[section] && (Array.isArray(pocusFASTSections[section]) ? pocusFASTSections[section].length > 0 : pocusFASTSections[section])) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<strong>${section}:</strong> ${Array.isArray(pocusFASTSections[section]) ? pocusFASTSections[section].join(', ') : pocusFASTSections[section]}`;
            outputArea.appendChild(sectionDiv);
        }
    }
}

// Function to trigger the "FAST neg" macro
function triggerFASTNegMacro() {
    // Define the map of sections with the corresponding "negative" button text
    const negativeButtonMap = {
        'Time': 'Now',
        'Indication': 'blunt trauma',
        'Hepatorenal view (RUQ)': 'negative',
        'Cardiac view': 'negative',
        'Splenorenal (LUQ)': 'negative',
        'Bladder view': 'negative',
        'Lung views': ['Right lung normal', 'Left lung normal'],
        'Interpretation': 'normal'
    };

    // Iterate through each section and find the corresponding "negative" button(s) to click
    for (const section in negativeButtonMap) {
        const buttonLabels = Array.isArray(negativeButtonMap[section]) ? negativeButtonMap[section] : [negativeButtonMap[section]];

        buttonLabels.forEach(label => {
            const buttons = document.querySelectorAll(`button[data-section="${section}"]`);
            buttons.forEach(button => {
                if (button.innerText.trim() === label && !button.classList.contains('pressed')) {
                    button.click();
                }
            });
        });
    }

    // Update the POCUS E-FAST output after the macro is applied
    updatePOCUSFASTOutput();
}

// Function to clear the POCUS E-FAST output and reset the buttons
function clearOutput() {
    // Reset all sections
    pocusFASTSections = {
        'Time': null,
        'Indication': [],
        'Hepatorenal view (RUQ)': [],
        'Cardiac view': [],
        'Splenorenal (LUQ)': [],
        'Bladder view': [],
        'Lung views': [],
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
