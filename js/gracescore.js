// Initialize selected scores for the sections
let selectedScores = {
    age: null,
    heartRate: null,
    systolicBP: null,
    creatinine: null,
    cardiacArrest: null,
    stDeviation: null,
    cardiacEnzymes: null,
    killipClass: null
};

// Map section names to correctly formatted titles
const sectionTitles = {
    age: "Age",
    heartRate: "Heart rate",
    systolicBP: "Systolic BP",
    creatinine: "Creatinine",
    cardiacArrest: "Cardiac arrest",
    stDeviation: "ST-segment deviation",
    cardiacEnzymes: "Cardiac enzyme abnormality",
    killipClass: "Killip Class"
};

// Function to handle button clicks
function handleButtonClick(button, section, score) {
    const buttons = button.parentElement.querySelectorAll('button');

    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        selectedScores[section] = null;
    } else {
        buttons.forEach(btn => btn.classList.remove('pressed'));
        button.classList.add('pressed');
        selectedScores[section] = score;
    }

    calculateScore();
}

// Function to calculate and display the GRACE score
function calculateScore() {
    let totalScore = 0;
    let outputDetails = [];

    // Calculate and add scores from numerical inputs
    const age = parseInt(document.getElementById('ageInput').value) || 0;
    const heartRate = parseInt(document.getElementById('heartRateInput').value) || 0;
    const systolicBP = parseInt(document.getElementById('systolicBPInput').value) || 0;
    const creatinine = parseFloat(document.getElementById('creatinineInput').value) || 0;

    const ageScore = calculateAgeScore(age);
    const heartRateScore = calculateHeartRateScore(heartRate);
    const systolicBPScore = calculateSystolicBPScore(systolicBP);
    const creatinineScore = calculateCreatinineScore(creatinine);

    totalScore += ageScore + heartRateScore + systolicBPScore + creatinineScore;

    // Add numerical input details to the output
    outputDetails.push(`Age: ${ageScore} points`);
    outputDetails.push(`Heart rate: ${heartRateScore} points`);
    outputDetails.push(`Systolic BP: ${systolicBPScore} points`);
    outputDetails.push(`Creatinine: ${creatinineScore} points`);

    // Add scores from button inputs
    for (const section in selectedScores) {
        if (selectedScores[section] !== null) {
            const title = sectionTitles[section];
            const score = selectedScores[section];
            outputDetails.push(`${title}: ${score} points`);
            totalScore += score;
        }
    }

    // Display the total score and section details
    const outputArea = document.getElementById('graceScoreOutput');
    outputArea.innerHTML = `
        <strong>GRACE Score for ACS:</strong><br><br>
        GRACE Score: ${totalScore}<br>
        ${outputDetails.join('; ')}<br><br>
        ${getRiskMessage(totalScore)}
    `;
}

// Helper functions to calculate scores for numerical inputs
function calculateAgeScore(age) {
    if (age < 30) return 0;
    if (age < 40) return 8;
    if (age < 50) return 25;
    if (age < 60) return 41;
    if (age < 70) return 58;
    if (age < 80) return 75;
    if (age < 90) return 91;
    return 100;
}

function calculateHeartRateScore(rate) {
    if (rate < 50) return 0;
    if (rate < 70) return 3;
    if (rate < 90) return 9;
    if (rate < 110) return 15;
    if (rate < 150) return 24;
    if (rate < 200) return 38;
    return 46;
}

function calculateSystolicBPScore(bp) {
    if (bp < 80) return 58;
    if (bp < 100) return 53;
    if (bp < 120) return 43;
    if (bp < 140) return 34;
    if (bp < 160) return 24;
    if (bp < 200) return 10;
    return 0;
}

function calculateCreatinineScore(creatinine) {
    if (creatinine < 0.4) return 1;
    if (creatinine < 0.8) return 4;
    if (creatinine < 1.2) return 7;
    if (creatinine < 1.6) return 10;
    if (creatinine < 2) return 13;
    if (creatinine < 4) return 21;
    return 28;
}

// Function to get risk message based on the total score
function getRiskMessage(score) {
    if (score < 109) {
        return "The patient is considered low-risk with a <1% likelihood of in-hospital mortality.";
    } else if (score <= 140) {
        return "The patient is considered intermediate-risk with a 1-3% likelihood of in-hospital mortality.";
    } else {
        return "The patient is considered high-risk with a >3% likelihood of in-hospital mortality.";
    }
}

// Function to clear the output and reset the form
function clearOutput() {
    document.getElementById('ageInput').value = '';
    document.getElementById('heartRateInput').value = '';
    document.getElementById('systolicBPInput').value = '';
    document.getElementById('creatinineInput').value = '';

    document.querySelectorAll('.pressed').forEach(button => {
        button.classList.remove('pressed');
    });

    selectedScores = {
        age: null,
        heartRate: null,
        systolicBP: null,
        creatinine: null,
        cardiacArrest: null,
        stDeviation: null,
        cardiacEnzymes: null,
        killipClass: null
    };

    document.getElementById('graceScoreOutput').innerHTML = '';
}

// Function to copy the output to the clipboard
function copyToClipboard() {
    const outputArea = document.getElementById('graceScoreOutput');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
}
