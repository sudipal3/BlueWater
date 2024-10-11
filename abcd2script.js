let selectedScores = {
    age: null,
    bp: null,
    clinicalfeatures: null,
    duration: null,
    diabetes: null
};

function handleButtonClick(button, characteristic, score, outputText) {
    const section = button.parentElement.querySelector('h3').innerText.toLowerCase().replace(/[^a-zA-Z]+/g, '');
    const buttons = button.parentElement.querySelectorAll('button');

    // Toggle the button state
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        selectedScores[section] = null;
    } else {
        // Unpress all other buttons in the section
        buttons.forEach(btn => btn.classList.remove('pressed'));

        // Mark the clicked button as pressed and store the score
        button.classList.add('pressed');
        selectedScores[section] = { characteristic, score, outputText };
    }

    updateAbcd2ScoreOutput();
}

function updateAbcd2ScoreOutput() {
    const outputArea = document.getElementById('abcd2ScoreOutput');
    const scoreDetails = [];
    let totalScore = 0;

    for (const key in selectedScores) {
        if (selectedScores[key]) {
            const { outputText, score } = selectedScores[key];
            scoreDetails.push(`${outputText}`);
            totalScore += score;
        }
    }

    let riskMessage = '';
    if (totalScore <= 3) {
        riskMessage = `<b>Low risk</b>: Per the validation study, 2-Day Stroke Risk: 1.0%, 7-Day Stroke Risk: 1.2%, 90-Day Stroke Risk: 3.1%.`;
    } else if (totalScore == 4) {
        riskMessage = `<b>Medium risk</b>: Per the validation study, 2-Day Stroke Risk: 4.1%, 7-Day Stroke Risk: 5.9%, 90-Day Stroke Risk: 9.8%.`;
    } else if (totalScore >= 5) {
        riskMessage = `<b>High risk</b>: Per the validation study, 2-Day Stroke Risk: 8.1%, 7-Day Stroke Risk: 11.7%, 90-Day Stroke Risk: 17.8%.`;
    }

    if (scoreDetails.length > 0) {
        outputArea.innerHTML = `<strong>ABCD2 Score for TIA</strong><br><br>ABCD2 Score: ${totalScore}<br>${scoreDetails.join('<br>')}<br><br>${riskMessage}`;
    } else {
        outputArea.innerHTML = '';
    }
}

function clearOutput() {
    // Reset selected scores
    selectedScores = {
        age: null,
        bp: null,
        clinicalfeatures: null,
        duration: null,
        diabetes: null
    };

    // Unpress all buttons
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));

    // Clear the output area
    document.getElementById('abcd2ScoreOutput').innerHTML = '';
}

function copyToClipboard() {
    const abcd2ScoreOutput = document.getElementById('abcd2ScoreOutput');
    const range = document.createRange();
    range.selectNode(abcd2ScoreOutput);
    window.getSelection().removeAllRanges(); // Clear the current selection
    window.getSelection().addRange(range); // Select the text
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // Deselect the text
}
