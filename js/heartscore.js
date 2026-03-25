let selectedScores = {
    history: null,
    ekg: null,
    age: null,
    riskfactors: null,  // Note the key here
    troponin: null
};

function handleButtonClick(button, characteristic, score, outputText) {
    const section = button.parentElement.querySelector('h3').innerText.toLowerCase().replace(/ /g, '');
    const buttons = button.parentElement.querySelectorAll('button');

    if (button.classList.contains('pressed')) {
        // Unselect the button
        button.classList.remove('pressed');
        selectedScores[section] = null;
    } else {
        // Unselect all other buttons in the section
        buttons.forEach(btn => btn.classList.remove('pressed'));

        // Select the clicked button
        button.classList.add('pressed');
        selectedScores[section] = { characteristic, score, outputText };
    }

    updateHeartScoreOutput();
}

function updateHeartScoreOutput() {
    const outputArea = document.getElementById('heartScoreOutput');
    const scoreDetails = [];
    let totalScore = 0;

    for (const key in selectedScores) {
        if (selectedScores[key]) {
            const { outputText, score } = selectedScores[key];
            scoreDetails.push(`${outputText} (${score})`);
            totalScore += score;
        }
    }

    let riskMessage = '';
    if (totalScore >= 0 && totalScore <= 3) {
        riskMessage = `<b>HEART score <= 3: Risk of MACE of 0.9-1.7%.</b>`;
    } else if (totalScore > 3) {
        riskMessage = `<b>HEART score > 3: Risk of MACE is >12%.</b>`;
    }

    if (scoreDetails.length > 0) {
        outputArea.innerHTML = `<strong>HEART Score for Major Cardiac Events</strong><br><br>HEART Score: ${totalScore}<br>${riskMessage}<br>${scoreDetails.join('; ')}`;
    } else {
        outputArea.innerHTML = '';
    }
}

function clearOutput() {
    // Reset the selectedScores object
    selectedScores = {
        history: null,
        ekg: null,
        age: null,
        riskfactors: null,  // Note the key here
        troponin: null
    };

    // Unpress all buttons
    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));

    // Clear the output area
    document.getElementById('heartScoreOutput').innerHTML = '';
}

// Function to copy the output text to the clipboard
function copyToClipboard() {
    const heartScoreOutput = document.getElementById('heartScoreOutput');
    const range = document.createRange();
    range.selectNode(heartScoreOutput);
    window.getSelection().removeAllRanges(); // Clear current selection
    window.getSelection().addRange(range); // Select the text
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // Deselect the text
}
