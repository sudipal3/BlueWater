let genevaSelectedAnswers = {
    age: null,
    dvtPE: null,
    surgery: null,
    malignancy: null,
    limbPain: null,
    hemoptysis: null,
    heartRate: null,
    palpationPain: null
};

// Mapping of criterion keys to their display texts and point values
const genevaCriterionTextMap = {
    age: { text: 'Age >65', points: 1 },
    dvtPE: { text: 'Previous DVT or PE', points: 3 },
    surgery: { text: 'Surgery or lower limb fracture in past month', points: 2 },
    malignancy: { text: 'Active malignant condition', points: 2 },
    limbPain: { text: 'Unilateral lower limb pain', points: 3 },
    hemoptysis: { text: 'Hemoptysis', points: 2 },
    heartRate: { text: 'Heart rate', points: [0, 3, 5] },
    palpationPain: { text: 'Pain on lower limb palpation and unilateral edema', points: 4 }
};

function handleGenevaButtonClick(button, criterion, points) {
    const buttons = button.parentElement.querySelectorAll('button');

    // Unselect all other buttons in the section
    buttons.forEach(btn => btn.classList.remove('pressed'));

    // Select or unselect the clicked button
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        genevaSelectedAnswers[criterion] = null;
    } else {
        button.classList.add('pressed');
        genevaSelectedAnswers[criterion] = points;
    }

    updateGenevaScoreOutput();
}

function updateGenevaScoreOutput() {
    const outputArea = document.getElementById('genevaScoreOutput');
    const scoreDetails = [];
    let totalScore = 0;

    // Calculate the total score and prepare details for output
    for (const key in genevaSelectedAnswers) {
        if (genevaSelectedAnswers[key] !== null) {
            const displayText = genevaCriterionTextMap[key].text;
            const points = genevaSelectedAnswers[key];
            scoreDetails.push(`${displayText}: ${points > 0 ? `Yes (+${points} points)` : 'No'}`);
            totalScore += points;
        }
    }

    // Determine risk group based on the total score
    let riskMessage = '';
    if (totalScore >= 0 && totalScore <= 3) {
        riskMessage = `<b>The patient is considered low risk (Score 0-3) with a <10% incidence of PE.</b>`;
    } else if (totalScore >= 4 && totalScore <= 10) {
        riskMessage = `<b>The patient is considered intermediate risk (Score 4-10). If a D-dimer is negative, consider stopping the workup; if it is positive, consider a US and/or CT scan.</b>`;
    } else if (totalScore >= 11) {
        riskMessage = `<b>The patient is considered high risk (>60% incidence of PE), consider CT/US and empiric treatment.</b>`;
    }

    // Update the output area with the total score, risk message, and score details
    if (scoreDetails.length > 0) {
        outputArea.innerHTML = `<h3>Geneva Score for Pulmonary Embolism</h3><br>Geneva Score: ${totalScore}<br>${riskMessage}<br>${scoreDetails.join('; ')}`;
    } else {
        outputArea.innerHTML = '';
    }
}

function clearGenevaOutput() {
    // Reset the genevaSelectedAnswers object
    genevaSelectedAnswers = {
        age: null,
        dvtPE: null,
        surgery: null,
        malignancy: null,
        limbPain: null,
        hemoptysis: null,
        heartRate: null,
        palpationPain: null
    };

    // Unpress all buttons
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));

    // Clear the output area
    document.getElementById('genevaScoreOutput').innerHTML = '';
}

// Function to copy the output text to the clipboard
function copyToClipboard(elementId) {
    const output = document.getElementById(elementId);
    const range = document.createRange();
    range.selectNode(output);
    window.getSelection().removeAllRanges(); // Clear current selection
    window.getSelection().addRange(range); // Select the text
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // Deselect the text
}
