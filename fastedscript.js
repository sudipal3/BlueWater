// Define the order of sections (controls output ordering)
const sectionOrder = ['time', 'facial', 'arm', 'speech', 'eye', 'neglect'];

// Ensure each section has an output block (created on demand)
function ensureSection(sectionName) {
  const sectionId = `output-${sectionName}`;
  const outputArea = document.getElementById('outputArea');

  let sectionDiv = document.getElementById(sectionId);
  if (!sectionDiv) {
    sectionDiv = document.createElement('div');
    sectionDiv.id = sectionId;
    sectionDiv.setAttribute('data-section', sectionName);
    sectionDiv.setAttribute('data-score', '0');
    sectionDiv.innerHTML = `
      <strong>${formatSectionTitle(sectionName)}:</strong>
      <span class="output-text"></span>
      <span class="free-text"></span>
      <br>
    `;
    outputArea.appendChild(sectionDiv);
    reorderSections();
  }
  return sectionDiv;
}

// Reorder output blocks to match sectionOrder (keeps summary at top)
function reorderSections() {
  const outputArea = document.getElementById('outputArea');

  // Collect existing section divs
  const sections = sectionOrder
    .map(name => document.getElementById(`output-${name}`))
    .filter(Boolean);

  // Remove and re-append in correct order after the <hr> (which follows the summary)
  sections.forEach(div => div.remove());
  sections.forEach(div => outputArea.appendChild(div));
}

// Title formatting for output labels
function formatSectionTitle(sectionName) {
  const map = {
    time: 'Time (Last Known Well)',
    facial: 'Facial Palsy',
    arm: 'Arm Weakness',
    speech: 'Speech Changes',
    eye: 'Eye Deviation',
    neglect: 'Denial/Neglect'
  };
  return map[sectionName] || sectionName;
}

// Handle score buttons (exclusive per section) + pressed styling
function handleScoreButton(button, text, score) {
  const sectionName = button.getAttribute('data-section');
  const sectionDiv = ensureSection(sectionName);
  const outputText = sectionDiv.querySelector('.output-text');

  const isPressed = button.classList.contains('pressed');

  // Unpress all buttons in this section
  const siblingButtons = document.querySelectorAll(`button[data-section="${sectionName}"]`);
  siblingButtons.forEach(b => b.classList.remove('pressed'));

  if (isPressed) {
    // Toggle OFF
    outputText.textContent = '';
    sectionDiv.setAttribute('data-score', '0');
  } else {
    // Toggle ON
    button.classList.add('pressed');
    outputText.textContent = text;
    sectionDiv.setAttribute('data-score', String(score));
  }

  // If the section is fully empty (no output + no free text), remove it
  cleanupIfEmpty(sectionName);

  updateTotalScore();
  reorderSections();
}

// Handle free text (appends after button output)
function handleFreeText(textarea) {
  const sectionName = textarea.getAttribute('data-section');
  const value = (textarea.value || '').trim();

  const sectionDiv = ensureSection(sectionName);
  const freeTextSpan = sectionDiv.querySelector('.free-text');

  if (value) {
    freeTextSpan.textContent = ` ${value}`;
  } else {
    freeTextSpan.textContent = '';
  }

  cleanupIfEmpty(sectionName);
  reorderSections();
}

// Remove section if both button output and free text are empty
function cleanupIfEmpty(sectionName) {
  const sectionDiv = document.getElementById(`output-${sectionName}`);
  if (!sectionDiv) return;

  const outputText = sectionDiv.querySelector('.output-text')?.textContent.trim() || '';
  const freeText = sectionDiv.querySelector('.free-text')?.textContent.trim() || '';

  const hasContent = outputText.length > 0 || freeText.length > 0;

  if (!hasContent) {
    sectionDiv.remove();
  }
}

// Compute total score (sum of data-score for scored sections)
function updateTotalScore() {
  const scoredSections = ['facial', 'arm', 'speech', 'eye', 'neglect'];

  let total = 0;
  scoredSections.forEach(name => {
    const div = document.getElementById(`output-${name}`);
    if (div) {
      const val = parseInt(div.getAttribute('data-score') || '0', 10);
      total += isNaN(val) ? 0 : val;
    }
  });

  document.getElementById('scoreValue').textContent = String(total);

  // Probability buckets commonly used with FAST-ED
  let probText = '≤1: <15%';
  if (total >= 2 && total <= 3) probText = '2–3: ~30%';
  if (total >= 4) probText = '≥4: ~60–85%';

  document.getElementById('probValue').textContent = probText;
}

// Copy output to clipboard
function copyToClipboard() {
  const total = document.getElementById('scoreValue').textContent;
  const prob = document.getElementById('probValue').textContent;

  let text = `FAST-ED Total: ${total}/9\nEstimated LVO Probability: ${prob}\n`;

  sectionOrder.forEach(name => {
    const div = document.getElementById(`output-${name}`);
    if (!div) return;

    const label = formatSectionTitle(name);
    const main = div.querySelector('.output-text')?.textContent.trim() || '';
    const free = div.querySelector('.free-text')?.textContent.trim() || '';

    if (!main && !free) return;

    const line = `${label}: ${[main, free].filter(Boolean).join(' ')}`.trim();
    text += `\n${line}`;
  });

  navigator.clipboard.writeText(text.trim())
    .then(() => {
      const status = document.getElementById('copyStatus');
      status.textContent = 'Copied!';
      setTimeout(() => status.textContent = '', 1200);
    })
    .catch(() => {
      const status = document.getElementById('copyStatus');
      status.textContent = 'Copy failed. Please try again.';
      setTimeout(() => status.textContent = '', 2000);
    });
}

// Clear everything
function clearAll() {
  // Clear textareas
  document.querySelectorAll('textarea[data-section]').forEach(t => (t.value = ''));

  // Clear button selections (pressed state)
  document.querySelectorAll('button[data-section]').forEach(b => b.classList.remove('pressed'));

  // Remove all output sections
  sectionOrder.forEach(name => {
    const div = document.getElementById(`output-${name}`);
    if (div) div.remove();
  });

  // Reset score
  document.getElementById('scoreValue').textContent = '0';
  document.getElementById('probValue').textContent = '≤1: <15%';

  // Clear status
  const status = document.getElementById('copyStatus');
  if (status) status.textContent = '';
}
