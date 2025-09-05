// Define the order of sections for reordering
const sectionOrder = [
  'ComplexityLow', 'ComplexityModerate', 'ComplexityHigh',
  'ExternalNotes', 'OrderedReviewedTests', 'IndependentHistorian',
  'IndependentRadiologyReview', 'ConsultantDiscussion', 'Risk'
];

// Function to handle adding text when a button is pressed
function addText(text, button) {
  const sectionName = button.getAttribute('data-section');
  const sectionId = `output-${sectionName}`;
  const outputArea = document.getElementById('outputArea');

  // Find or create the section div
  let sectionDiv = document.getElementById(sectionId);
  if (!sectionDiv) {
    sectionDiv = document.createElement('div');
    sectionDiv.id = sectionId;
    sectionDiv.innerHTML = `<strong>${formatSectionName(sectionName)}:</strong> <span class="output-text"></span><br>`;
    outputArea.appendChild(sectionDiv);
  }

  const outputText = sectionDiv.querySelector('.output-text');

  // Add button-generated text, ensuring no duplicates
  if (!outputText.textContent.includes(text)) {
    outputText.textContent += (outputText.textContent ? ', ' : '') + text;
  }

  // Mark the button as pressed
  button.classList.add('pressed');

  // Ensure the sections are in the correct order
  reorderSections(outputArea);

  // Add the main header if not present
  addMainHeader(outputArea);
}

// Function to handle removing text when a button is unpressed
function removeText(text, button) {
  const sectionName = button.getAttribute('data-section');
  const sectionId = `output-${sectionName}`;
  const outputArea = document.getElementById('outputArea');

  const sectionDiv = document.getElementById(sectionId);
  if (!sectionDiv) return;

  const outputText = sectionDiv.querySelector('.output-text');
  if (!outputText) return;

  // Remove the button-generated text
  outputText.textContent = outputText.textContent
    .split(', ')
    .filter(item => item !== text)
    .join(', ');

  // If no text remains, remove the section
  if (!outputText.textContent.trim()) {
    sectionDiv.remove();
  }

  // Unmark the button as pressed
  button.classList.remove('pressed');

  // Remove the header if there's no content
  removeMainHeader(outputArea);
}

// Function to handle button clicks
function handleButtonClick(button, text) {
  if (button.classList.contains('pressed')) {
    removeText(text, button);
  } else {
    addText(text, button);
  }
}

// Function to handle real-time text input (free text)
function updateRealTimeText(sectionTitle, textareaId) {
  const textarea = document.getElementById(textareaId);
  const sectionName = textareaId.replace('Text', ''); // Match textarea ID to section ID
  const sectionId = `output-${sectionName}`;
  const outputArea = document.getElementById('outputArea');

  // Find or create the section div
  let sectionDiv = document.getElementById(sectionId);
  if (!sectionDiv) {
    sectionDiv = document.createElement('div');
    sectionDiv.id = sectionId;
    sectionDiv.innerHTML = `<strong>${sectionTitle}:</strong> <span class="output-text"></span><br>`;
    outputArea.appendChild(sectionDiv);
  }

  const outputText = sectionDiv.querySelector('.output-text');
  const newText = textarea.value.trim();

  if (newText) {
    // Append free text to existing output without replacing it
    if (!outputText.textContent.includes(newText)) {
      outputText.textContent += (outputText.textContent ? ', ' : '') + newText;
    }
  } else {
    // Remove the entire section and reset buttons if free text is deleted
    sectionDiv.remove();

    // Reset all buttons in this section
    const buttons = document.querySelectorAll(`button[data-section="${sectionName}"]`);
    buttons.forEach(button => button.classList.remove('pressed'));
  }

  // Ensure the sections are in the correct order
  reorderSections(outputArea);

  // Add the main header if not present
  addMainHeader(outputArea);

  // Remove the header if there's no content
  removeMainHeader(outputArea);
}

// Function to add the main header if it's not already present
function addMainHeader(outputArea) {
  if (!outputArea.querySelector('h2') && outputArea.innerHTML.trim() !== '') {
    const mainTitle = document.querySelector('.form-section h2').innerText;
    outputArea.insertAdjacentHTML('afterbegin', `<h2>${mainTitle}</h2><br>`);
  }
}

// Function to remove the main header if there's no content
function removeMainHeader(outputArea) {
  const hasContent = Array.from(outputArea.children).some(
    child => child.id && child.id.startsWith('output-')
  );
  const header = outputArea.querySelector('h2');
  if (!hasContent && header) {
    outputArea.innerHTML = ''; // clear entirely
  }
}

// Function to reorder sections according to the predefined order
function reorderSections(outputArea) {
  sectionOrder.forEach(section => {
    const sectionDiv = document.getElementById(`output-${section}`);
    if (sectionDiv) {
      outputArea.appendChild(sectionDiv);
    }
  });
}

// Function to trigger macros
function triggerMacro(buttonIds, macroButton, ...freeTexts) {
  // Activate the selected macro by pressing each button
  buttonIds.forEach(id => {
    const [section, buttonText] = id.split('-');
    const buttons = document.querySelectorAll(`[data-section="${section}"]`);
    const matchedButton = Array.from(buttons).find(btn => btn.innerText === buttonText);

    if (matchedButton) {
      const associatedText = matchedButton.getAttribute('onclick').match(/'([^']+)'|"(.*?)"/);
      const text = associatedText[1] || associatedText[2]; // handle single or double-quoted strings
      addText(text, matchedButton); // Add text directly
      matchedButton.classList.add('pressed'); // Mark button as pressed
    }
  });

  // Add free text to the respective sections
  for (let i = 0; i < freeTexts.length; i += 2) {
    const sectionId = freeTexts[i];
    const freeText = freeTexts[i + 1];
    const textarea = document.getElementById(sectionId);
    if (textarea) {
      textarea.value = freeText; // Set the textarea value
      updateRealTimeText(formatSectionName(sectionId.replace('Text', '')), sectionId); // Update the output area
    }
  }

  // Ensure the macro button reflects the state
  macroButton.classList.add('pressed');
}

// Utility function to format section names with spaces between words
function formatSectionName(section) {
  return section
    .replace(/([A-Z])/g, ' $1')
    .replace(/^[a-z]/, m => m.toUpperCase())
    .trim();
}

// Function to copy the output text to the clipboard
function copyToClipboard() {
  const outputArea = document.getElementById('outputArea');
  const range = document.createRange();
  range.selectNode(outputArea);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  document.execCommand('copy');
  sel.removeAllRanges();
}

// Function to clear all output and reset all buttons
function clearOutput() {
  // Clear the output area
  const outputArea = document.getElementById('outputArea');
  outputArea.innerHTML = '';

  // Reset all buttons
  document.querySelectorAll('.pressed').forEach(button => {
    button.classList.remove('pressed');
  });

  // Clear all textareas (and text inputs if you switch later)
  document.querySelectorAll('textarea, input[type="text"]').forEach(field => {
    field.value = '';
  });

  // Remove the main header if it's there
  removeMainHeader(outputArea);
}
