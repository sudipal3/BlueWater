// Initialize the answers object for the Westley Croup Score
let westleyCroupSelectedAnswers = {
    retractions: null,
    stridor: null,
    cyanosis: null,
    consciousness: null,
    airEntry: null
};

// Handle button clicks for the Westley Croup tool
function handleWestleyCroupButtonClick(button, criterion, answer) {
    const buttons = button.parentElement.querySelectorAll('button');

    // If clicked button is already pressed, unselect it
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        westleyCroupSelectedAnswers[criterion] = null;
    } else {
        // Unselect all other buttons in the section
        buttons.forEach(btn => btn.classList.remove('pressed'));

        // Select clicked button
        button.classList.add('pressed');
        westleyCroupSelectedAnswers[criterion] = answer;
    }

    updateWestleyCroupOutput();
}

// Function to update the Westley Croup output based on answers
function updateWestleyCroupOutput() {
    const outputArea = document.getElementById('westleyCroupScoreOutput');

    const selectedCriteria = [];
    const totalScore = calculateWestleyCroupScore();
    const severityText = getWestleyCroupSeverity(totalScore);

    // If nothing is selected, clear output
    const anySelected = Object.values(westleyCroupSelectedAnswers).some(answer => answer !== null);
    if (!anySelected) {
        outputArea.innerHTML = '';
        return;
    }

    // Build selected criteria list
    for (const key in westleyCroupSelectedAnswers) {
        if (westleyCroupSelectedAnswers[key] !== null) {
            selectedCriteria.push(`${formatWestleyCriterionText(key)}: ${westleyCroupSelectedAnswers[key]} (${getWestleyPoints(key, westleyCroupSelectedAnswers[key])})`);
        }
    }

    const selectedCriteriaText = selectedCriteria.length > 0
        ? `Selected Criteria: ${selectedCriteria.join('; ')}`
        : 'Selected Criteria: none';

    outputArea.innerHTML = `<strong>Westley Croup Score:</strong><br><br>${severityText}<br><br><strong>Total Score:</strong> ${totalScore}<br><br>${selectedCriteriaText}`;
}

// Function to calculate total Westley score
function calculateWestleyCroupScore() {
    let total = 0;

    for (const key in westleyCroupSelectedAnswers) {
        if (westleyCroupSelectedAnswers[key] !== null) {
            total += getWestleyPoints(key, westleyCroupSelectedAnswers[key]);
        }
    }

    return total;
}

// Function to assign points
function getWestleyPoints(criterion, answer) {
    const pointsMap = {
        retractions: {
            'None': 0,
            'Mild': 1,
            'Moderate': 2,
            'Severe': 3
        },
        stridor: {
            'None': 0,
            'With agitation': 1,
            'At rest': 2
        },
        cyanosis: {
            'None': 0,
            'With agitation': 4,
            'At rest': 5
        },
        consciousness: {
            'Normal': 0,
            'Disoriented': 5
        },
        airEntry: {
            'Normal': 0,
            'Decreased': 1,
            'Markedly decreased': 2
        }
    };

    return pointsMap[criterion][answer] || 0;
}

// Function to interpret total score
function getWestleyCroupSeverity(score) {
    if (score >= 0 && score <= 2) {
        return 'Mild croup per Westley Score';
    } else if (score >= 3 && score <= 5) {
        return 'Moderate croup per Westley Score';
    } else if (score >= 6 && score <= 11) {
        return 'Severe croup per Westley Score, admission recommended.';
    } else {
        return 'The Westley Score suggests severe croup with impending respiratory failure.';
    }
}

// Function to format criterion text
function formatWestleyCriterionText(key) {
    const criteriaTextMap = {
        retractions: 'Chest wall retractions',
        stridor: 'Stridor',
        cyanosis: 'Cyanosis',
        consciousness: 'Level of consciousness',
        airEntry: 'Air entry'
    };
    return criteriaTextMap[key];
}

// Function to clear the Westley Croup output
function clearWestleyCroupOutput() {
    westleyCroupSelectedAnswers = {
        retractions: null,
        stridor: null,
        cyanosis: null,
        consciousness: null,
        airEntry: null
    };

    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));
    document.getElementById('westleyCroupScoreOutput').innerHTML = '';
}

// Function to copy the output text to the clipboard
function copyToClipboard(elementId) {
    const output = document.getElementById(elementId);
    const range = document.createRange();
    range.selectNode(output);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}

// Macro to set all fields to a mild croup profile
function triggerWestleyCroupMacro() {
    const macroSelections = {
        retractions: 'None',
        stridor: 'None',
        cyanosis: 'None',
        consciousness: 'Normal',
        airEntry: 'Normal'
    };

    Object.keys(macroSelections).forEach(criterion => {
        const buttons = document.querySelectorAll(`[onclick*="handleWestleyCroupButtonClick(this, '${criterion}'"]`);
        buttons.forEach(button => {
            if (button.textContent === macroSelections[criterion] && !button.classList.contains('pressed')) {
                button.click();
            }
        });
    });
}