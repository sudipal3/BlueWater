// Initialize the answers object for the Canadian Head CT Rule
let canadianHeadSelectedAnswers = {
    age: null,
    bloodThinners: null,
    seizure: null,
    gcs: null,
    skullFracture: null,
    basilarFracture: null,
    vomiting: null,
    amnesia: null,
    dangerousMechanism: null
};

// Handle button clicks for the Canadian Head CT tool
function handleCanadianHeadButtonClick(button, criterion, answer) {
    const buttons = button.parentElement.querySelectorAll('button');

    // Unselect all other buttons in the section
    buttons.forEach(btn => btn.classList.remove('pressed'));

    // Select or unselect the clicked button
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        canadianHeadSelectedAnswers[criterion] = null;
    } else {
        button.classList.add('pressed');
        canadianHeadSelectedAnswers[criterion] = answer;
    }

    updateCanadianHeadOutput();
}

// Function to update the Canadian Head CT output based on answers
function updateCanadianHeadOutput() {
    const outputArea = document.getElementById('canadianHeadScoreOutput');
    const positiveCriteria = [];
    const negativeCriteria = [];

    // Check if any answer is 'Yes'
    const anyYes = Object.values(canadianHeadSelectedAnswers).some(answer => answer === 'Yes');

    // Categorize the criteria
    for (const key in canadianHeadSelectedAnswers) {
        if (canadianHeadSelectedAnswers[key] !== null) {
            if (canadianHeadSelectedAnswers[key] === 'Yes') {
                positiveCriteria.push(`Yes: ${formatCriterionText(key)}`);
            } else {
                negativeCriteria.push(`No: ${formatCriterionText(key)}`);
            }
        }
    }

    // Prepare the output message
    let message = '';
    if (anyYes) {
        message = 'The patient cannot be ruled out by the Canadian Head CT rule due to a medium/high risk criteria and/or a lack of applicability of the rule.';
    } else {
        message = 'The Canadian CT Head Rule suggests a head CT is not necessary for this patient (sensitivity 83-100% for all intracranial traumatic findings, sensitivity 100% for findings requiring neurosurgical intervention).';
    }

    // Set default text if no positive criteria
    const positiveCriteriaText = positiveCriteria.length > 0 ? `Positive Criteria: ${positiveCriteria.join('; ')}` : 'Positive Criteria: none';

    // Update the output area
    outputArea.innerHTML = `<strong>Canadian Head CT Rule:</strong><br><br>${message}<br><br>${positiveCriteriaText}<br>Negative Criteria: ${negativeCriteria.join('; ')}`;
}

// Function to format the criterion text
function formatCriterionText(key) {
    const criteriaTextMap = {
        age: 'Age <16 years or ≥65 years',
        bloodThinners: 'Patient on blood thinners',
        seizure: 'Seizure after injury',
        gcs: 'GCS <15 at 2 hours post-injury',
        skullFracture: 'Suspected open or depressed skull fracture',
        basilarFracture: 'Any sign of basilar skull fracture',
        vomiting: '≥2 episodes of vomiting',
        amnesia: 'Retrograde amnesia to the event ≥ 30 minutes',
        dangerousMechanism: '“Dangerous” mechanism (Pedestrian struck by motor vehicle, occupant ejected from motor vehicle, or fall from >3 feet or >5 stairs)'
    };
    return criteriaTextMap[key];
}

// Function to clear the Canadian Head CT output
function clearCanadianHeadOutput() {
    // Reset the answers
    canadianHeadSelectedAnswers = {
        age: null,
        bloodThinners: null,
        seizure: null,
        gcs: null,
        skullFracture: null,
        basilarFracture: null,
        vomiting: null,
        amnesia: null,
        dangerousMechanism: null
    };

    // Reset all button states
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));

    // Clear the output area
    document.getElementById('canadianHeadScoreOutput').innerHTML = '';
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

// Function to trigger all criteria as "No" for the Canadian head neg macro
function triggerCanadianHeadMacro() {
    Object.keys(canadianHeadSelectedAnswers).forEach(criterion => {
        const buttons = document.querySelectorAll(`[onclick*="handleCanadianHeadButtonClick(this, '${criterion}'"]`);
        buttons.forEach(button => {
            if (button.textContent === 'No' && !button.classList.contains('pressed')) {
                button.click();
            }
        });
    });
}
