// flexible-bronchoscopy.js

// Define the order of sections in the OUTPUT area
const sectionOrder = [
  'time',
  'consent',
  'timeout',
  'indication',
  'preparation-monitoring',
  'medication',
  'bronchoscope-size',
  'entry',
  'specimens',

  // Findings group + sub-sections
  'findings',
  'findings-tube',
  'findings-trachea',
  'findings-right-mainstem',
  'findings-right-upper-lobe',
  'findings-right-middle-lobe',
  'findings-right-lower-lobe',
  'findings-left-mainstem',
  'findings-left-upper-lobe',
  'findings-left-lower-lobe',
  'findings-lingula',

  'ett-positioning',
  'complications',
  'provider'
];

// ---------------------------
// Core button text handling
// ---------------------------
function addText(text, button) {
  const sectionName = button.getAttribute('data-section'); // e.g. "findings-tube"
  const sectionId = `output-${sectionName}`;
  const outputArea = document.getElementById('outputArea');

  let sectionDiv = document.getElementById(sectionId);
  if (!sectionDiv) {
    sectionDiv = document.createElement('div');
    sectionDiv.id = sectionId;

    // ✅ Uses prettifySectionTitle which now strips "findings-" from display titles
    sectionDiv.innerHTML = `<strong>${prettifySectionTitle(sectionName)}:</strong> <span class="output-text"></span><br>`;
    outputArea.appendChild(sectionDiv);
  }

  const outputText = sectionDiv.querySelector('.output-text');

  // Add button-generated text, ensuring no duplicates
  if (!outputText.textContent.includes(text)) {
    outputText.textContent += (outputText.textContent ? ', ' : '') + text;
  }

  // Mark the button as pressed
  button.classList.add('pressed');

  // Ensure ordering and header
  reorderSections(outputArea);
  addMainHeader(outputArea);
}

function removeText(text, button) {
  const sectionName = button.getAttribute('data-section');
  const sectionId = `output-${sectionName}`;
  const sectionDiv = document.getElementById(sectionId);
  if (!sectionDiv) return;

  const outputText = sectionDiv.querySelector('.output-text');

  // Remove the button-generated text
  outputText.textContent = outputText.textContent
    .split(', ')
    .filter(item => item !== text)
    .join(', ');

  // If no text remains, remove the section
  if (!outputText.textContent.trim()) {
    sectionDiv.remove();
  }

  // Unmark the button
  button.classList.remove('pressed');

  const outputArea = document.getElementById('outputArea');
  removeMainHeaderIfEmpty(outputArea);
}

// Function to handle button clicks
function handleButtonClick(button, text) {
  if (button.classList.contains('pressed')) {
    removeText(text, button);
  } else {
    addText(text, button);
  }
}

// ---------------------------
// Time "Now" handler
// ---------------------------
function handleBronchoscopyTimeNow() {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });

  // 1) Put time into textarea
  const textarea = document.getElementById('bronchoscopyTimeText');
  if (textarea) textarea.value = formattedTime;

  // 2) Create/update the output section directly
  const outputArea = document.getElementById('outputArea');
  const sectionId = 'output-time';
  let sectionDiv = document.getElementById(sectionId);

  if (!sectionDiv) {
    sectionDiv = document.createElement('div');
    sectionDiv.id = sectionId;
    sectionDiv.innerHTML = `<strong>Time:</strong> <span class="output-text"></span><br>`;
    outputArea.appendChild(sectionDiv);
  }

  sectionDiv.querySelector('.output-text').textContent = formattedTime;

  // 3) Keep ordering/header consistent
  reorderSections(outputArea);
  addMainHeader(outputArea);
}

// ---------------------------
// Free text handling
// Supports optional grouping under "Findings"
// ---------------------------
function updateRealTimeText(sectionTitle, textareaId, groupSectionName) {
  const textarea = document.getElementById(textareaId);
  const outputArea = document.getElementById('outputArea');
  if (!textarea || !outputArea) return;

  const newText = textarea.value.trim();

  // If grouped (e.g., findings), create parent + child sections
  if (groupSectionName) {
    const groupId = `output-${groupSectionName}`;

    // Ensure group container exists
    let groupDiv = document.getElementById(groupId);
    if (!groupDiv) {
      groupDiv = document.createElement('div');
      groupDiv.id = groupId;
      groupDiv.innerHTML = `<strong>${capitalizeWords(groupSectionName)}:</strong><br>`;
      outputArea.appendChild(groupDiv);
    }

    // Child section name includes group, but display title is just sectionTitle
    const childSectionName = normalizeSectionName(`${groupSectionName}-${sectionTitle}`);
    const childId = `output-${childSectionName}`;

    let childDiv = document.getElementById(childId);
    if (!childDiv) {
      childDiv = document.createElement('div');
      childDiv.id = childId;
      childDiv.style.marginLeft = '14px';
      childDiv.innerHTML = `<strong>${sectionTitle}:</strong> <span class="output-text"></span><br>`;
      groupDiv.appendChild(childDiv);
    }

    const outputText = childDiv.querySelector('.output-text');

    if (newText) {
      outputText.textContent = outputText.textContent
        ? `${outputText.textContent}, ${newText}`
        : newText;
    } else {
      // Remove child if empty and reset buttons for that subsection
      childDiv.remove();
      resetButtonsForSection(childSectionName);
    }

    // If group has no children, remove it
    const hasChildren = groupDiv.querySelectorAll('div[id^="output-"]').length > 0;
    if (!hasChildren) groupDiv.remove();

    reorderSections(outputArea);
    addMainHeader(outputArea);
    removeMainHeaderIfEmpty(outputArea);
    return;
  }

  // Non-grouped sections (normal behavior)
  const sectionName = normalizeSectionName(sectionTitle);
  const sectionId = `output-${sectionName}`;

  let sectionDiv = document.getElementById(sectionId);
  if (!sectionDiv) {
    sectionDiv = document.createElement('div');
    sectionDiv.id = sectionId;
    sectionDiv.innerHTML = `<strong>${sectionTitle}:</strong> <span class="output-text"></span><br>`;
    outputArea.appendChild(sectionDiv);
  }

  const outputText = sectionDiv.querySelector('.output-text');

  if (newText) {
    outputText.textContent = outputText.textContent
      ? `${outputText.textContent}, ${newText}`
      : newText;
  } else {
    sectionDiv.remove();
    resetButtonsForSection(sectionName);
  }

  reorderSections(outputArea);
  addMainHeader(outputArea);
  removeMainHeaderIfEmpty(outputArea);
}

// ---------------------------
// Output header helpers
// ---------------------------
function addMainHeader(outputArea) {
  if (!outputArea.querySelector('h2') && outputArea.innerHTML.trim() !== '') {
    const mainTitle = document.querySelector('.form-section h2')?.innerText || 'Procedure Note';
    outputArea.insertAdjacentHTML('afterbegin', `<h2>${mainTitle}</h2><br>`);
  }
}

function removeMainHeaderIfEmpty(outputArea) {
  // Remove header if no output sections exist
  const meaningful = outputArea.querySelectorAll('div[id^="output-"]').length;
  if (!meaningful) {
    const header = outputArea.querySelector('h2');
    if (header) header.remove();
  }
}

// ---------------------------
// Ordering
// ---------------------------
function reorderSections(outputArea) {
  // Only reorders top-level output sections by ID in sectionOrder.
  sectionOrder.forEach(section => {
    const node = document.getElementById(`output-${section}`);
    if (node) outputArea.appendChild(node);
  });
}

// ---------------------------
// Copy / Clear
// ---------------------------
function copyToClipboard() {
  const outputArea = document.getElementById('outputArea');
  const range = document.createRange();
  range.selectNode(outputArea);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
}

function clearOutput() {
  const outputArea = document.getElementById('outputArea');
  outputArea.innerHTML = '';
  document.querySelectorAll('.pressed').forEach(btn => btn.classList.remove('pressed'));
}

// ---------------------------
// Utilities
// ---------------------------

// ✅ FIX: normalize ANY non-alphanumeric characters (including "/") to "-"
function normalizeSectionName(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')   // key normalization fix
    .replace(/-+/g, '-')          // collapse repeats
    .replace(/^-|-$/g, '');       // trim leading/trailing "-"
}

function resetButtonsForSection(sectionName) {
  const buttons = document.querySelectorAll(`button[data-section="${sectionName}"]`);
  buttons.forEach(btn => btn.classList.remove('pressed'));
}

// ✅ CHANGE: Findings output titles should NOT include "Findings"
function prettifySectionTitle(sectionName) {
  // If it's a findings subsection, remove "findings-" from the displayed title
  if (sectionName.startsWith('findings-')) {
    const withoutPrefix = sectionName.replace(/^findings-/, '');
    return capitalizeWords(withoutPrefix.replace(/-/g, ' '));
  }

  // Default behavior
  return capitalizeWords(sectionName.replace(/-/g, ' '));
}

function capitalizeWords(str) {
  return str
    .split(' ')
    .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
    .join(' ');
}