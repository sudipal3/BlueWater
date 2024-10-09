// Initialize score tracking object
let selectedScores = {
    age: null,
    sex: null,
    chfhistory: null,
    hypertensionhistory: null,
    stroketiahistory: null,
    vasculardiseasehistory: null,
    diabeteshistory: null
};

// Define section title mappings for proper grammar and formatting
const sectionTitleMapping = {
    age: 'Age',
    sex: 'Sex',
    chfhistory: 'CHF history',
    hypertensionhistory: 'Hypertension history',
    stroketiahistory: 'Stroke/TIA history',
    vasculardiseasehistory: 'Vascular disease history',
    diabeteshistory: 'Diabetes history'
};

// Function to handle button clicks
function handleButtonClick(button, section, option, score) {
    const sectionKey = section.toLowerCase().replace(/[^a-z]/g, '');
    const buttons = button.parentElement.querySelectorAll('button');

    // Deselect all buttons in the section
    buttons.forEach(btn => btn.classList.remove('pressed'));

    // Select the clicked button and update the score
    button.classList.add('pressed');
    selectedScores[sectionKey] = { option, score };

    // Update the output
    updateCHA2DS2VascScoreOutput();
}

// Function to update the score and output display
function updateCHA2DS2VascScoreOutput() {
    const outputArea = document.getElementById('cha2ds2VascScoreOutput');
    let totalScore = 0;
    const scoreDetails = [];

    // Calculate the total score and create output details for each section
    for (const section in selectedScores) {
        if (selectedScores[section]) {
            const { option, score } = selectedScores[section];
            const sectionTitle = sectionTitleMapping[section] || capitalize(section);
            scoreDetails.push(`${sectionTitle}: ${option}, ${score}`);
            totalScore += score;
        }
    }

    // Determine the stroke risk message based on the total score
    let riskMessage = '';
    switch (totalScore) {
        case 0:
            riskMessage = `CHA2DS2-VASc Score 0: Stroke risk is 0.2%; stroke/TIA/thromboembolism is 0.3%.`;
            break;
        case 1:
            riskMessage = `CHA2DS2-VASc Score 1: Stroke risk is 0.6%; stroke/TIA/thromboembolism is 0.9%.`;
            break;
        case 2:
            riskMessage = `CHA2DS2-VASc Score 2: Stroke risk is 2.2%; stroke/TIA/thromboembolism is 2.9%.`;
            break;
        case 3:
            riskMessage = `CHA2DS2-VASc Score 3: Stroke risk is 3.2%; stroke/TIA/thromboembolism is 4.6%.`;
            break;
        case 4:
            riskMessage = `CHA2DS2-VASc Score 4: Stroke risk is 4.8%; stroke/TIA/thromboembolism is 6.7%.`;
            break;
        case 5:
            riskMessage = `CHA2DS2-VASc Score 5: Stroke risk is 7.2%; stroke/TIA/thromboembolism is 10.0%.`;
            break;
        case 6:
            riskMessage = `CHA2DS2-VASc Score 6: Stroke risk is 9.7%; stroke/TIA/thromboembolism is 13.6%.`;
            break;
        case 7:
            riskMessage = `CHA2DS2-VASc Score 7: Stroke risk is 11.2%; stroke/TIA/thromboembolism is 15.7%.`;
            break;
        case 8:
            riskMessage = `CHA2DS2-VASc Score 8: Stroke risk is 10.8%; stroke/TIA/thromboembolism is 15.2%.`;
            break;
        case 9:
            riskMessage = `CHA2DS2-VASc Score 9: Stroke risk is 12.2%; stroke/TIA/thromboembolism is 17.4%.`;
            break;
    }

    // Create the final output with recommendations
    const recommendation = `Recommendations suggest a 0 score for men or 1 score for women (no clinical risk factors) is “low” risk and may not require anticoagulation; a 1 score for men or 2 score for women is “low-moderate” risk and should consider anticoagulation; and a score ≥2 for men or ≥3 for women is “moderate-high” risk and should otherwise be an anticoagulation candidate.`;

    // Display the output
    if (scoreDetails.length > 0) {
        outputArea.innerHTML = `<strong>CHA2DS2-VASc Score for Atrial Fibrillation</strong><br><br>CHA2DS2-VASc Score: ${totalScore}<br><br>${scoreDetails.join('<br>')}<br><br>${riskMessage}<br><br>${recommendation}`;
    } else {
        outputArea.innerHTML = '';
    }
}

// Utility function to capitalize and format the section names
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to clear the output and reset all buttons
function clearOutput() {
    // Reset all selections
    selectedScores = {
        age: null,
        sex: null,
        chfhistory: null,
        hypertensionhistory: null,
        stroketiahistory: null,
        vasculardiseasehistory: null,
        diabeteshistory: null
    };

    // Unselect all buttons
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));

    // Clear the output area
    document.getElementById('cha2ds2VascScoreOutput').innerHTML = '';
}

// Function to copy the output text to the clipboard
function copyToClipboard() {
    const outputArea = document.getElementById('cha2ds2VascScoreOutput');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges(); // Clear current selection
    window.getSelection().addRange(range); // Select the text
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // Deselect the text
}
