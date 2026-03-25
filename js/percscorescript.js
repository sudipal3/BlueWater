let percSelectedAnswers = {
    age50: null,
    hr100: null,
    o2sat95: null,
    legswelling: null,
    hemoptysis: null,
    surgerytrauma: null,
    priorpedvt: null,
    hormoneuse: null
};

// Mapping of criterion keys to their display texts
const criterionTextMap = {
    age50: 'Age ≥50',
    hr100: 'HR ≥100',
    o2sat95: 'O2 sat on room air <95%',
    legswelling: 'Unilateral leg swelling',
    hemoptysis: 'Hemoptysis',
    surgerytrauma: 'Recent surgery or trauma (within four weeks)',
    priorpedvt: 'Prior PE or DVT',
    hormoneuse: 'Hormone use (OCPs or hormone replacement)'
};

function handlePERCButtonClick(button, criterion, answer) {
    const buttons = button.parentElement.querySelectorAll('button');

    // Unselect all other buttons in the section
    buttons.forEach(btn => btn.classList.remove('pressed'));

    // Select or unselect the clicked button
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        percSelectedAnswers[criterion] = null;
    } else {
        button.classList.add('pressed');
        percSelectedAnswers[criterion] = answer ? 'Yes' : 'No';
    }

    updatePercScoreOutput();
}

function updatePercScoreOutput() {
    const outputArea = document.getElementById('percScoreOutput');
    const selectedAnswers = [];

    // Check if any answer is 'Yes'
    const anyYes = Object.values(percSelectedAnswers).some(answer => answer === 'Yes');

    for (const key in percSelectedAnswers) {
        if (percSelectedAnswers[key] !== null) {
            // Use the criterion text map to display the correct text
            const displayText = criterionTextMap[key];
            selectedAnswers.push(`${displayText}: ${percSelectedAnswers[key]}`);
        }
    }

    // Prepare the risk message
    let riskMessage = '';
    if (anyYes) {
        riskMessage = 'Despite an initial low pre-test probability for pulmonary embolism, as there is a positive criteria, the PERC rule cannot rule out pulmonary embolism.';
    } else {
        riskMessage = 'The patient has a low pre-test probability (<3%) of PE based on their clinical presentation and risk factors. Given all negative PERC criteria, PE can be effectively ruled out at this time.';
    }

    // Update the output area with the header and results
    if (selectedAnswers.length > 0) {
        outputArea.innerHTML = `<strong>PERC Rule for PE</strong><br><br>${riskMessage}<br>${selectedAnswers.join('; ')}`;
    } else {
        outputArea.innerHTML = '';
    }
}

function clearPERCOutput() {
    // Reset the percSelectedAnswers object
    percSelectedAnswers = {
        age50: null,
        hr100: null,
        o2sat95: null,
        legswelling: null,
        hemoptysis: null,
        surgerytrauma: null,
        priorpedvt: null,
        hormoneuse: null
    };

    // Unpress all buttons
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));

    // Clear the output area
    document.getElementById('percScoreOutput').innerHTML = '';
}

// Function to copy the output text to the clipboard
function copyToClipboard(elementId) {
    const percScoreOutput = document.getElementById(elementId);
    const range = document.createRange();
    range.selectNode(percScoreOutput);
    window.getSelection().removeAllRanges(); // Clear current selection
    window.getSelection().addRange(range); // Select the text
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // Deselect the text
}

// Function to trigger the "PERC neg" macro
function triggerPERCMacro() {
    const noButtons = document.querySelectorAll('button[onclick*="false"]');
    noButtons.forEach(button => {
        if (!button.classList.contains('pressed')) {
            button.click();
        }
    });
}
