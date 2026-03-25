let pesiSelectedAnswers = {
    age80: null,
    cancer: null,
    cardiopulm: null,
    hr110: null,
    bp100: null,
    o2sat90: null
};

// Mapping of criterion keys to their display texts
const pesiCriterionTextMap = {
    age80: 'Age >80',
    cancer: 'History of cancer',
    cardiopulm: 'History of chronic cardiopulmonary disease',
    hr110: 'Heart rate ≥110',
    bp100: 'Systolic BP <100 mmHg',
    o2sat90: 'O₂ saturation <90%'
};

function handlePESIButtonClick(button, criterion, answer) {
    const buttons = button.parentElement.querySelectorAll('button');

    // Unselect all other buttons in the section
    buttons.forEach(btn => btn.classList.remove('pressed'));

    // Select or unselect the clicked button
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        pesiSelectedAnswers[criterion] = null;
    } else {
        button.classList.add('pressed');
        pesiSelectedAnswers[criterion] = answer ? 'Yes' : 'No';
    }

    updatePesiScoreOutput();
}

function updatePesiScoreOutput() {
    const outputArea = document.getElementById('pesiScoreOutput');
    const selectedAnswers = [];
    let score = 0;

    for (const key in pesiSelectedAnswers) {
        if (pesiSelectedAnswers[key] === 'Yes') {
            score += 1;
            selectedAnswers.push(`${pesiCriterionTextMap[key]}: Yes`);
        } else if (pesiSelectedAnswers[key] === 'No') {
            selectedAnswers.push(`${pesiCriterionTextMap[key]}: No`);
        }
    }

    // Determine the risk message based on the score
    let riskMessage = '';
    if (score === 0) {
        riskMessage = 'A simplified PESI score of 0 is considered “low risk” with a 1.1% risk of death and a 1.5% risk of recurrent thromboembolism or non-fatal bleeding within 30 days.';
    } else {
        riskMessage = 'A simplified PESI score of ≥1 is considered "high risk" with an 8.9% 30-day mortality.';
    }

    // Update the output area with the header, score, and results
    outputArea.innerHTML = `<strong>Simplified PESI Score</strong><br><br>sPESI score: ${score}<br>${selectedAnswers.join('; ')}<br><br>${riskMessage}`;
}

function clearPESIOutput() {
    // Reset the pesiSelectedAnswers object
    pesiSelectedAnswers = {
        age80: null,
        cancer: null,
        cardiopulm: null,
        hr110: null,
        bp100: null,
        o2sat90: null
    };

    // Unpress all buttons
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));

    // Clear the output area
    document.getElementById('pesiScoreOutput').innerHTML = '';
}

// Function to copy the output text to the clipboard
function copyToClipboard(elementId) {
    const pesiScoreOutput = document.getElementById(elementId);
    const range = document.createRange();
    range.selectNode(pesiScoreOutput);
    window.getSelection().removeAllRanges(); // Clear current selection
    window.getSelection().addRange(range); // Select the text
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // Deselect the text
}

// Function to trigger the "PESI 0" macro
function triggerPESIMacro() {
    const noButtons = document.querySelectorAll('button[onclick*="false"]');
    noButtons.forEach(button => {
        if (!button.classList.contains('pressed')) {
            button.click();
        }
    });
}
