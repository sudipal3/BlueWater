// Initialize the answers object for the NEXUS C-spine Rule
let nexusSelectedAnswers = {
    focalNeurologic: null,
    spinalTenderness: null,
    alteredLOC: null,
    intoxication: null,
    distractingInjury: null
};

// Handle button clicks for the NEXUS C-spine tool
function handleNexusButtonClick(button, criterion, answer) {
    const buttons = button.parentElement.querySelectorAll('button');

    // Unselect all other buttons in the section
    buttons.forEach(btn => btn.classList.remove('pressed'));

    // Select or unselect the clicked button
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        nexusSelectedAnswers[criterion] = null;
    } else {
        button.classList.add('pressed');
        nexusSelectedAnswers[criterion] = answer;
    }

    updateNexusOutput();
}

// Function to update the NEXUS C-spine output based on answers
function updateNexusOutput() {
    const outputArea = document.getElementById('nexusScoreOutput');
    const positiveCriteria = [];
    const negativeCriteria = [];

    // Check if any answer is 'Yes'
    const anyYes = Object.values(nexusSelectedAnswers).some(answer => answer === 'Yes');

    // Categorize the criteria
    for (const key in nexusSelectedAnswers) {
        if (nexusSelectedAnswers[key] !== null) {
            if (nexusSelectedAnswers[key] === 'Yes') {
                positiveCriteria.push(`Yes: ${formatCriterionText(key)}`);
            } else {
                negativeCriteria.push(`No: ${formatCriterionText(key)}`);
            }
        }
    }

    // Prepare the output message
    let message = '';
    if (anyYes) {
        message = 'The patient cannot be cleared clinically by the NEXUS rule due to the presence of positive criteria.';
    } else {
        message = 'Per the NEXUS C-spine rule, the C-spine can be cleared clinically.';
    }

    // Set default text if no positive criteria
    const positiveCriteriaText = positiveCriteria.length > 0 ? `Positive Criteria: ${positiveCriteria.join('; ')}` : 'Positive Criteria: none';

    // Update the output area
    outputArea.innerHTML = `<strong>NEXUS C-spine Rule:</strong><br><br>${message}<br><br>${positiveCriteriaText}<br>Negative Criteria: ${negativeCriteria.join('; ')}`;
}

// Function to format the criterion text
function formatCriterionText(key) {
    const criteriaTextMap = {
        focalNeurologic: 'Focal neurologic deficit present',
        spinalTenderness: 'Midline spinal tenderness present',
        alteredLOC: 'Altered level of consciousness present',
        intoxication: 'Intoxication present',
        distractingInjury: 'Distracting injury present'
    };
    return criteriaTextMap[key];
}

// Function to clear the NEXUS output
function clearNexusOutput() {
    // Reset the answers
    nexusSelectedAnswers = {
        focalNeurologic: null,
        spinalTenderness: null,
        alteredLOC: null,
        intoxication: null,
        distractingInjury: null
    };

    // Reset all button states
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));

    // Clear the output area
    document.getElementById('nexusScoreOutput').innerHTML = '';
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

// Function to trigger all criteria as "No" for the NEXUS rule neg macro
function triggerNexusMacro() {
    Object.keys(nexusSelectedAnswers).forEach(criterion => {
        const buttons = document.querySelectorAll(`[onclick*="handleNexusButtonClick(this, '${criterion}'"]`);
        buttons.forEach(button => {
            if (button.textContent === 'No' && !button.classList.contains('pressed')) {
                button.click();
            }
        });
    });
}
