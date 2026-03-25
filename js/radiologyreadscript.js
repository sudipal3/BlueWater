// Define the Radiology Interpretation sections object to store the pressed button values
let radiologySections = {
    'Imaging type': [],
    'Time of interpretation': null,
    'Interpretation': []
};

// Function to handle button clicks for Radiology Interpretation sections with multiple selections
function handleButtonClick(button, description) {
    const section = button.getAttribute('data-section');

    // Toggle the button's pressed state
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');

        // Remove the description from the radiologySections array for this section
        radiologySections[section] = radiologySections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');

        // Add the description to the radiologySections array for this section
        radiologySections[section].push(description);
    }

    // Update the Radiology Interpretation output with the new values
    updateRadiologyOutput();
}

// Function to handle the time button click and output the formatted time
function handleTimeButtonClick(button) {
    const section = button.getAttribute('data-section');
    const time = new Date();
    const formattedTime = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Construct the ID of the textarea element based on the section name
    const textAreaId = section.replace(/\s/g, '') + 'Text';

    // Check if the textarea element exists before updating it
    const textAreaElement = document.getElementById(textAreaId);
    if (textAreaElement) {
        textAreaElement.value = formattedTime;
    }

    // Update the corresponding section in the radiologySections object with the formatted time
    radiologySections[section] = formattedTime;

    // Update the Radiology Interpretation output
    updateRadiologyOutput();
}

// Function to handle real-time text input (free text) and append to existing output
function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();

    // Append the new text to existing button-generated output if any
    if (textValue) {
        if (Array.isArray(radiologySections[section])) {
            radiologySections[section].push(textValue);
        } else {
            radiologySections[section] = (radiologySections[section] ? radiologySections[section] + ', ' : '') + textValue;
        }
    }

    // Update the Radiology Interpretation output
    updateRadiologyOutput();
}

// Function to update the Radiology Interpretation Output
function updateRadiologyOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = ''; // Clear the existing output

    // Create the main Radiology Interpretation header if not already present
    const mainHeader = document.createElement('h2');
    mainHeader.textContent = 'Radiology Interpretation';
    outputArea.appendChild(mainHeader);

    // Create a static phrase paragraph below the main header
    const staticPhrase = document.createElement('p');
    staticPhrase.textContent = 'I have independently reviewed and interpreted the following imaging and my interpretation is as follows:';
    staticPhrase.style.fontWeight = 'bold'; // Make the static text bold for emphasis
    outputArea.appendChild(staticPhrase);

    // Log to check the contents of radiologySections for debugging
    console.log('radiologySections:', radiologySections);

    // Generate detailed outputs for each section
    for (const section in radiologySections) {
        if (radiologySections[section] && (Array.isArray(radiologySections[section]) ? radiologySections[section].length > 0 : radiologySections[section])) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<strong>${section}:</strong> ${Array.isArray(radiologySections[section]) ? radiologySections[section].join(', ') : radiologySections[section]}`;
            outputArea.appendChild(sectionDiv);
        }
    }
}

// Function to clear the Radiology Interpretation output and reset the buttons
function clearOutput() {
    // Reset all sections
    radiologySections = {
        'Imaging type': [],
        'Time of interpretation': null,
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
    document.execCommand('copy');
    window.getSelection().removeAllRanges(); // Deselect the text
}
