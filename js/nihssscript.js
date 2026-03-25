// Initialize the NIH scores object for all sections except "Time"
let nihScores = {
    'Level of consciousness': null,
    'LOC Questions': null,
    'LOC Commands': null,
    'Horizontal extraocular movements': null,
    'Visual fields': null,
    'Facial palsy': null,
    'Left arm motor drift': null,
    'Right arm motor drift': null,
    'Left leg motor drift': null,
    'Right leg motor drift': null,
    'Limb Ataxia': null,
    'Sensation': null,
    'Language/aphasia': null,
    'Dysarthria': null,
    'Extinction/inattention': null
};

// Separate variable to handle "Time"
let timeEntry = "";

// Function to handle button clicks for scoring sections
function handleNIHButtonClick(button, section, score, description) {
    const buttons = button.parentElement.querySelectorAll('button');

    // Unselect all buttons in the section
    buttons.forEach(btn => btn.classList.remove('pressed'));

    // Select the clicked button and update score
    button.classList.add('pressed');
    nihScores[section] = { description: description.trim(), score: score };

    // Update the output with the new scores
    updateNIHScoreOutput();
}

// Function to handle the time button click and output the formatted time
function handleTimeButtonClick(button) {
    const time = new Date();
    const formattedTime = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Set the time in the associated textarea
    document.getElementById('timeText').value = formattedTime;

    // Update the separate time entry variable
    timeEntry = `Time: ${formattedTime}`;
    updateNIHScoreOutput();
}

// Function to handle real-time text input (free text)
function updateRealTimeText() {
    const textValue = document.getElementById('timeText').value.trim();

    // If free text is present, use it as the time entry, else clear it
    if (textValue) {
        timeEntry = `Time: ${textValue}`;
    } else {
        timeEntry = "";
    }

    // Update the NIH score output
    updateNIHScoreOutput();
}

// Function to update the NIH Score Output
function updateNIHScoreOutput() {
    const outputArea = document.getElementById('nihScoreOutput');
    let totalScore = 0;
    const scoreDetails = [];

    // Calculate the total score and generate detailed outputs for each section
    for (const section in nihScores) {
        if (nihScores[section]) {
            const { description, score } = nihScores[section];
            scoreDetails.push(`<strong>${section}:</strong> ${description} (Score: ${score})`);
            totalScore += score;
        }
    }

    // Generate the output message for NIH Score
    let nihMessage = `<strong>NIH Score: ${totalScore}</strong><br><br>${scoreDetails.join('<br>')}`;

    // Add the time entry separately, if present
    if (timeEntry) {
        nihMessage = `${timeEntry}<br><br>${nihMessage}`;
    }

    // Update the output area
    outputArea.innerHTML = nihMessage;
}

// Function to clear the NIH score and reset the buttons
function clearNIHScore() {
    // Reset all scores and time entry
    nihScores = {
        'Level of consciousness': null,
        'LOC Questions': null,
        'LOC Commands': null,
        'Horizontal extraocular movements': null,
        'Visual fields': null,
        'Facial palsy': null,
        'Left arm motor drift': null,
        'Right arm motor drift': null,
        'Left leg motor drift': null,
        'Right leg motor drift': null,
        'Limb Ataxia': null,
        'Sensation': null,
        'Language/aphasia': null,
        'Dysarthria': null,
        'Extinction/inattention': null
    };
    timeEntry = "";

    // Unpress all buttons
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));

    // Clear text box for time
    document.getElementById('timeText').value = "";

    // Clear the output area
    document.getElementById('nihScoreOutput').innerHTML = '';
}

// Function to copy the output text to the clipboard
function copyToClipboard() {
    const outputArea = document.getElementById('nihScoreOutput');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}

// Function to trigger NIH 0 macro
function triggerNIHZeroMacro() {
    // Define a map of all sections with their "negative" button text
    const negativeButtonMap = {
        'Level of consciousness': 'Alert; keenly responsive',
        'LOC Questions': 'Both questions right',
        'LOC Commands': 'Performs both tasks',
        'Horizontal extraocular movements': 'Normal',
        'Visual fields': 'No visual loss',
        'Facial palsy': 'Normal symmetry',
        'Left arm motor drift': 'No drift for 10 seconds',
        'Right arm motor drift': 'No drift for 10 seconds',
        'Left leg motor drift': 'No drift for 10 seconds',
        'Right leg motor drift': 'No drift for 10 seconds',
        'Limb Ataxia': 'No ataxia',
        'Sensation': 'Normal',
        'Language/aphasia': 'Normal; no aphasia',
        'Dysarthria': 'Normal or unable to test',
        'Extinction/inattention': 'No abnormality'
    };

    // Iterate through each section and find the corresponding "negative" button to click
    for (const section in negativeButtonMap) {
        const buttonText = negativeButtonMap[section];
        const button = document.querySelector(`button[onclick*="${section}"][onclick*="${buttonText}"]`);

        if (button && !button.classList.contains('pressed')) {
            button.click();
        }
    }

    // Ensure the NIH Score output is updated after the macro is applied
    updateNIHScoreOutput();
}
