// Initialize the NIH scores object for all sections except "Time"
let nihScores = {
    levelOfConsciousness: null,
    locQuestions: null,
    locCommands: null,
    horizontalExtraocularMovements: null,
    visualFields: null,
    facialPalsy: null,
    leftArmMotorDrift: null,
    rightArmMotorDrift: null,
    leftLegMotorDrift: null,
    rightLegMotorDrift: null,
    limbAtaxia: null,
    sensation: null,
    languageAphasia: null,
    dysarthria: null,
    extinctionInattention: null
};

// Object to handle "Time" separately
let timeEntry = "";

// Function to handle button clicks for scoring sections
function handleNIHButtonClick(button, section, score, description) {
    const buttons = button.parentElement.querySelectorAll('button');

    // Unselect all buttons in the section
    buttons.forEach(btn => btn.classList.remove('pressed'));

    // Select the clicked button and update score
    button.classList.add('pressed');
    nihScores[section] = { description, score };

    // Update the output with the new scores
    updateNIHScoreOutput();
}

// Function to handle the time button click separately
function handleTimeButtonClick(button) {
    const time = new Date();
    const formattedTime = time.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById('timeText').value = formattedTime;

    // Store the time entry separately and update the output
    timeEntry = `Time: ${formattedTime}`;
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
function clearOutput() {
    // Reset all scores and time entry
    nihScores = {
        levelOfConsciousness: null,
        locQuestions: null,
        locCommands: null,
        horizontalExtraocularMovements: null,
        visualFields: null,
        facialPalsy: null,
        leftArmMotorDrift: null,
        rightArmMotorDrift: null,
        leftLegMotorDrift: null,
        rightLegMotorDrift: null,
        limbAtaxia: null,
        sensation: null,
        languageAphasia: null,
        dysarthria: null,
        extinctionInattention: null
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
    // Define all the section names that should be set to a score of 0
    const sectionsToZero = [
        'Level of consciousness',
        'LOC Questions',
        'LOC Commands',
        'Horizontal extraocular movements',
        'Visual fields',
        'Facial palsy',
        'Left arm motor drift',
        'Right arm motor drift',
        'Left leg motor drift',
        'Right leg motor drift',
        'Limb Ataxia',
        'Sensation',
        'Language/aphasia',
        'Dysarthria',
        'Extinction/inattention'
    ];

    // Loop through each section and set it to its zero score button
    sectionsToZero.forEach(section => {
        // Query for the zero-score button within this section
        const zeroButton = document.querySelector(`button[onclick*="'${section}', 0"]`);
        if (zeroButton && !zeroButton.classList.contains('pressed')) {
            zeroButton.click(); // Simulate a click on the zero score button
        }
    });

    // Update the NIH score output to reflect all zero scores
    updateNIHScoreOutput();
}
