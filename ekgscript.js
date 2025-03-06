// Define the EKG sections object to store the pressed button values
let ekgSections = {
    'Time of EKG': null,
    'Time of Interpretation': null,
    'Rate': [],
    'Rhythm': [], // Corrected spelling
    'Axis': [],
    'Intervals': [],
    'Conduction': [],
    'Ischemia': [],
    'Prior EKG comparison': []
};

// Function to handle button clicks for EKG sections with multiple selections
function handleButtonClick(button, section, description) {
    const buttons = button.parentElement.querySelectorAll('button');

    // Toggle the button's pressed state
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');

        // Remove the description from the ekgSections array for this section
        ekgSections[section] = ekgSections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');

        // Add the description to the ekgSections array for this section
        ekgSections[section].push(description);
    }

    // Update the EKG output with the new values
    updateEKGOutput();
}

// Function to handle the time button click and output the formatted time
function handleTimeButtonClick(button, section, textAreaId) {
    const time = new Date();
    const formattedTime = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Set the time in the associated text area
    document.getElementById(textAreaId).value = formattedTime;

    // Update the section with the time value
    ekgSections[section] = formattedTime;

    // Update the EKG output
    updateEKGOutput();
}

// Function to handle real-time text input (free text) and append to existing output
function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();

    // Append the new text to existing button-generated output if any
    if (textValue) {
        if (Array.isArray(ekgSections[section])) {
            ekgSections[section].push(textValue);
        } else {
            ekgSections[section] = (ekgSections[section] ? ekgSections[section] + ', ' : '') + textValue;
        }
    } else {
        ekgSections[section] = ekgSections[section].filter(item => !item.includes(textValue));
    }

    // Update the EKG output
    updateEKGOutput();
}

// Function to update the EKG Output
function updateEKGOutput() {
    const outputArea = document.getElementById('ekgOutput');
    outputArea.innerHTML = ''; // Clear the existing output

    // Create the main EKG Interpretation header
    const mainHeader = document.createElement('h2');
    mainHeader.textContent = 'EKG Interpretation';
    outputArea.appendChild(mainHeader);

    // Add the new phrase below the header
    const reviewPhrase = document.createElement('p');
    reviewPhrase.textContent = 'I independently reviewed the EKG with the following interpretation:';
    outputArea.appendChild(reviewPhrase);

    // Generate detailed outputs for each section
    for (const section in ekgSections) {
        if (ekgSections[section] && (Array.isArray(ekgSections[section]) ? ekgSections[section].length > 0 : ekgSections[section])) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<strong>${section}:</strong> ${Array.isArray(ekgSections[section]) ? ekgSections[section].join(', ') : ekgSections[section]}`;
            outputArea.appendChild(sectionDiv);
        }
    }
}

// Function to clear the EKG output and reset the buttons
function clearEKGOutput() {
    // Reset all sections
    ekgSections = {
        'Time of EKG': null,
        'Time of Interpretation': null,
        'Rate': [],
        'Rhythm': [], // Corrected spelling
        'Axis': [],
        'Intervals': [],
        'Conduction': [],
        'Ischemia': [],
        'Prior EKG comparison': []
    };

    // Clear all text areas
    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');

    // Unpress all buttons
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));

    // Clear the output area
    document.getElementById('ekgOutput').innerHTML = '';
}

// Function to copy the output text to the clipboard
function copyToClipboard() {
    const outputArea = document.getElementById('ekgOutput');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges(); // Clear current selection
    window.getSelection().addRange(range); // Select the text
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // Deselect the text
}