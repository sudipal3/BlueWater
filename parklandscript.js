// Function to calculate Parkland Formula
function calculateParklandFormula() {
    const weight = parseFloat(document.getElementById('weightInput').value);
    const burnPercentage = parseFloat(document.getElementById('burnPercentageInput').value);
    const outputArea = document.getElementById('outputArea');

    if (isNaN(weight) || isNaN(burnPercentage) || weight <= 0 || burnPercentage <= 0) {
        outputArea.innerHTML = "<p>Please enter valid values for both weight and burn percentage.</p>";
        return;
    }

    // Calculate total fluid requirement and first 8-hour fluid requirement
    const totalFluid = ((4 * weight * burnPercentage) / 1000).toFixed(1);
    const firstEightHours = (totalFluid / 2).toFixed(1);

    // Output the calculated values with a header
    outputArea.innerHTML = `
        <h2>Parkland Formula for Burns</h2>
        <p>Based upon the Parkland Formula for burns, it is recommended the patient receives a total of <strong>${totalFluid} L</strong> of fluid in the first 24 hours. 
        <strong>${firstEightHours} L</strong> should be administered in the first eight hours and the remainder over the following sixteen hours.</p>
    `;
}

// Function to copy the output text to the clipboard
function copyToClipboard() {
    const outputArea = document.getElementById('outputArea');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}

// Function to clear all output and reset all inputs
function clearOutput() {
    document.getElementById('weightInput').value = '';
    document.getElementById('burnPercentageInput').value = '';
    document.getElementById('outputArea').innerHTML = '';
}
