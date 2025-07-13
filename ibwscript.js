let selectedSex = null;

// Highlight selected button and update selected sex
function handleSexClick(button, sex) {
  document.querySelectorAll('.input-group button').forEach(btn => btn.classList.remove('pressed'));
  button.classList.add('pressed');
  selectedSex = sex;
  calculateIBW();
}

// Calculate Ideal Body Weight based on Devine formula
function calculateIBW() {
  const feet = parseInt(document.getElementById('heightFeetInput').value) || 0;
  const inches = parseInt(document.getElementById('heightInchesInput').value) || 0;
  const totalInches = feet * 12 + inches;

  if (!selectedSex || totalInches <= 0) {
    document.getElementById('ibwOutput').innerHTML = '';
    return;
  }

  let ibw;
  if (selectedSex === 'male') {
    ibw = 50 + 2.3 * (totalInches - 60);
  } else {
    ibw = 45.5 + 2.3 * (totalInches - 60);
  }

  const output = `<br>The ideal body weight for this patient is: <strong>${ibw.toFixed(1)} kg</strong>`;
  document.getElementById('ibwOutput').innerHTML = output;
}

// Clear all inputs and output
function clearIBW() {
  document.getElementById('heightFeetInput').value = '';
  document.getElementById('heightInchesInput').value = '';
  document.querySelectorAll('.pressed').forEach(btn => btn.classList.remove('pressed'));
  selectedSex = null;
  document.getElementById('ibwOutput').innerHTML = '';
}

// Copy output to clipboard
function copyIBW() {
  const output = document.getElementById('ibwOutput');
  if (!output.innerText.trim()) return;

  const range = document.createRange();
  range.selectNode(output);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
}
