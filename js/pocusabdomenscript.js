let pocusAbdomenSections = {
    Time: [],
    Indication: [],
    Views: [],
    Findings: [],
    Interpretation: []
};

// Function to handle button clicks for POCUS sections with multiple selections
function handleButtonClick(button, description) {
    const section = button.getAttribute('data-section');

    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        pocusAbdomenSections[section] = pocusAbdomenSections[section].filter(item => item !== description);
    } else {
        button.classList.add('pressed');
        pocusAbdomenSections[section].push(description);
    }

    updatePOCUSAbdomenOutput();
}

// Function to handle the time button click and add the formatted time to the section
function handleTimeButtonClick(button) {
    const section = button.getAttribute('data-section');
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    if (!pocusAbdomenSections[section].includes(time)) {
        pocusAbdomenSections[section].push(time);
    }

    updatePOCUSAbdomenOutput();
}

// Function to handle real-time text input (free text) and ensure it is added to the correct section
function updateRealTimeText(section, textAreaId) {
    const textValue = document.getElementById(textAreaId).value.trim();

    if (textValue) {
        if (!pocusAbdomenSections[section].includes(textValue)) {
            pocusAbdomenSections[section].push(textValue);
        }
    } else {
        pocusAbdomenSections[section] = pocusAbdomenSections[section].filter(item => item !== textValue);
    }

    updatePOCUSAbdomenOutput();
}

// Function to update the POCUS Abdomen output with the collected data
function updatePOCUSAbdomenOutput() {
    const outputArea = document.getElementById('outputArea');
    outputArea.innerHTML = ''; // Clear the existing output

    const header = document.createElement('h2');
    header.textContent = 'POCUS Abdomen';
    outputArea.appendChild(header);

    for (const section in pocusAbdomenSections) {
        const values = pocusAbdomenSections[section];
        if (values.length > 0) {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${section}:</strong> ${values.join(', ')}`;
            outputArea.appendChild(div);
        }
    }
}

// Function to clear the POCUS Abdomen output and reset the input fields
function clearOutput() {
    pocusAbdomenSections = {
        Time: [],
        Indication: [],
        Views: [],
        Findings: [],
        Interpretation: []
    };

    document.querySelectorAll('textarea').forEach(area => (area.value = ''));
    document.querySelectorAll('.pressed').forEach(btn => btn.classList.remove('pressed'));
    document.getElementById('outputArea').innerHTML = '';
}

// Function to copy the output text to the clipboard
function copyToClipboard() {
    const range = document.createRange();
    range.selectNode(document.getElementById('outputArea'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
}
