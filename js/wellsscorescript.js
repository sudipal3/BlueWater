let wellsSelectedAnswers = {
    dvt: null,
    peDiagnosis: null,
    heartRate: null,
    immobilization: null,
    previousPEorDVT: null,
    hemoptysis: null,
    malignancy: null
};

// Mapping of criterion keys to their display texts and point values
const wellsCriterionTextMap = {
    dvt: { text: 'Clinical signs and symptoms of DVT', points: 3 },
    peDiagnosis: { text: 'PE is #1 diagnosis OR equally likely', points: 3 },
    heartRate: { text: 'Heart rate > 100', points: 1.5 },
    immobilization: { text: 'Immobilization at least 3 days OR surgery in the previous 4 weeks', points: 1.5 },
    previousPEorDVT: { text: 'Previous, objectively diagnosed PE or DVT', points: 1.5 },
    hemoptysis: { text: 'Hemoptysis', points: 1 },
    malignancy: { text: 'Malignancy w/ treatment within 6 months or palliative', points: 1 }
};

function handleWellsButtonClick(button, criterion, points) {
    const buttons = button.parentElement.querySelectorAll('button');

    // Unselect all other buttons in the section
    buttons.forEach(btn => btn.classList.remove('pressed'));

    // Select or unselect the clicked button
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        wellsSelectedAnswers[criterion] = null;
    } else {
        button.classList.add('pressed');
        wellsSelectedAnswers[criterion] = points;
    }

    updateWellsScoreOutput();
}

function updateWellsScoreOutput() {
    const outputArea = document.getElementById('wellsScoreOutput');
    const scoreDetails = [];
    let totalScore = 0;

    // Calculate the total score and prepare details for output
    for (const key in wellsSelectedAnswers) {
        if (wellsSelectedAnswers[key] !== null) {
            const displayText = wellsCriterionTextMap[key].text;
            const points = wellsSelectedAnswers[key];
            scoreDetails.push(`${displayText}: ${points > 0 ? `Yes (+${points} points)` : 'No'}`);
            totalScore += points;
        }
    }

    // Determine risk group based on the total score
    let riskMessage = '';
    if (totalScore < 2) {
        riskMessage = `<b>Low risk group: 1.3% chance of PE in an ED population.</b>`;
    } else if (totalScore <= 6) {
        riskMessage = `<b>Moderate risk group: 16.2% chance of PE in an ED population.</b>`;
    } else {
        riskMessage = `<b>High risk group: 40.6% chance of PE in an ED population.</b>`;
    }

    // Update the output area with the total score, risk message, and score details
    if (scoreDetails.length > 0) {
        outputArea.innerHTML = `<h3>Wells' Criteria for PE</h3><br>Wells' Score: ${totalScore.toFixed(1)}<br>${riskMessage}<br>${scoreDetails.join('; ')}`;
    } else {
        outputArea.innerHTML = '';
    }
}

function clearWellsOutput() {
    // Reset the wellsSelectedAnswers object
    wellsSelectedAnswers = {
        dvt: null,
        peDiagnosis: null,
        heartRate: null,
        immobilization: null,
        previousPEorDVT: null,
        hemoptysis: null,
        malignancy: null
    };

    // Unpress all buttons
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));

    // Clear the output area
    document.getElementById('wellsScoreOutput').innerHTML = '';
}

// Function to copy the output text to the clipboard
function copyToClipboard(elementId) {
    const wellsScoreOutput = document.getElementById(elementId);
    const range = document.createRange();
    range.selectNode(wellsScoreOutput);
    window.getSelection().removeAllRanges(); // Clear current selection
    window.getSelection().addRange(range); // Select the text
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // Deselect the text
}

// Function to trigger the "No" macro for all criteria
function triggerWellsMacro() {
    const noButtons = document.querySelectorAll('button[onclick*="0"]');
    noButtons.forEach(button => {
        if (!button.classList.contains('pressed')) {
            button.click();
        }
    });
}
