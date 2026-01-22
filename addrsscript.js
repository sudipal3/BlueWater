// addrsscript.js

const sectionOrder = ['conditions', 'pain', 'exam'];

function formatSectionTitle(sectionName) {
  const map = {
    conditions: 'Any high-risk condition',
    pain: 'Any high-risk pain feature',
    exam: 'Any high-risk exam feature'
  };
  return map[sectionName] || sectionName;
}

function ensureSection(sectionName) {
  const sectionId = `output-${sectionName}`;
  const outputArea = document.getElementById('outputArea');
  if (!outputArea) return null;

  let sectionDiv = document.getElementById(sectionId);
  if (!sectionDiv) {
    sectionDiv = document.createElement('div');
    sectionDiv.id = sectionId;
    sectionDiv.setAttribute('data-section', sectionName);
    sectionDiv.setAttribute('data-score', '0');
    sectionDiv.setAttribute('data-answer', ''); // Yes/No
    sectionDiv.setAttribute('data-free', '');   // free text

    sectionDiv.innerHTML = `
      <strong>${formatSectionTitle(sectionName)}:</strong>
      <span class="output-text"></span>
      <br>
    `;

    outputArea.appendChild(sectionDiv);
    reorderSections();
  }
  return sectionDiv;
}

function reorderSections() {
  const outputArea = document.getElementById('outputArea');
  if (!outputArea) return;

  const sections = sectionOrder
    .map(name => document.getElementById(`output-${name}`))
    .filter(Boolean);

  sections.forEach(div => div.remove());
  sections.forEach(div => outputArea.appendChild(div));
}

function renderSectionLine(sectionName) {
  const div = document.getElementById(`output-${sectionName}`);
  if (!div) return;

  const answer = (div.getAttribute('data-answer') || '').trim();
  const free = (div.getAttribute('data-free') || '').trim();
  const outputTextEl = div.querySelector('.output-text');
  if (!outputTextEl) return;

  if (!answer && !free) {
    outputTextEl.textContent = '';
    return;
  }

  if (answer && free) outputTextEl.textContent = `${answer}, ${free}`;
  else if (answer) outputTextEl.textContent = answer;
  else outputTextEl.textContent = free; // if free text entered without Yes/No
}

function handleYesNoButton(button, text, score) {
  const sectionName = button.getAttribute('data-section');
  const sectionDiv = ensureSection(sectionName);
  if (!sectionDiv) return;

  const isPressed = button.classList.contains('pressed');

  // Unpress both buttons in this section
  const siblingButtons = document.querySelectorAll(`button[data-section="${sectionName}"]`);
  siblingButtons.forEach(b => b.classList.remove('pressed'));

  if (isPressed) {
    // Toggle OFF
    sectionDiv.setAttribute('data-answer', '');
    sectionDiv.setAttribute('data-score', '0');
  } else {
    // Toggle ON
    button.classList.add('pressed');
    sectionDiv.setAttribute('data-answer', text);
    sectionDiv.setAttribute('data-score', String(score));
  }

  renderSectionLine(sectionName);
  cleanupIfEmpty(sectionName);
  updateTotalScoreAndRecommendation();
  reorderSections();
}

function handleFreeText(sectionName, textareaId) {
  const textarea = document.getElementById(textareaId);
  const value = (textarea?.value || '').trim();

  const sectionDiv = ensureSection(sectionName);
  if (!sectionDiv) return;

  sectionDiv.setAttribute('data-free', value);

  renderSectionLine(sectionName);
  cleanupIfEmpty(sectionName);
  reorderSections();
}

function cleanupIfEmpty(sectionName) {
  const sectionDiv = document.getElementById(`output-${sectionName}`);
  if (!sectionDiv) return;

  const answer = (sectionDiv.getAttribute('data-answer') || '').trim();
  const free = (sectionDiv.getAttribute('data-free') || '').trim();

  if (!answer && !free) sectionDiv.remove();
}

function updateTotalScoreAndRecommendation() {
  let total = 0;

  sectionOrder.forEach(name => {
    const div = document.getElementById(`output-${name}`);
    if (div) {
      const val = parseInt(div.getAttribute('data-score') || '0', 10);
      total += isNaN(val) ? 0 : val;
    }
  });

  const scoreEl = document.getElementById('scoreValue');
  if (scoreEl) scoreEl.textContent = String(total);

  const recEl = document.getElementById('recommendationText');
  if (!recEl) return;

  if (total <= 1) {
    recEl.textContent =
      'Proceed to D-dimer testing according to ADD-RS; if <500 ng/mL, consider stopping dissection workup, or if ≥500 ng/mL, consider CTA.';
  } else {
    recEl.textContent =
      'Consider proceeding directly to CTA or other conclusive imaging according to ADD-RS.';
  }
}

function copyToClipboard() {
  const total = document.getElementById('scoreValue')?.textContent || '0';
  const rec = document.getElementById('recommendationText')?.textContent || '';

  let text =
    `ADD-RS (Aortic Dissection Detection Risk Score)\n` +
    `ADD-RS Total: ${total}/3\n` +
    `Recommendation: ${rec}\n`;

  sectionOrder.forEach(name => {
    const div = document.getElementById(`output-${name}`);
    if (!div) return;

    const label = formatSectionTitle(name);
    const line = div.querySelector('.output-text')?.textContent.trim() || '';
    if (!line) return;

    text += `\n${label}: ${line}`;
  });

  navigator.clipboard.writeText(text.trim())
    .then(() => {
      const status = document.getElementById('copyStatus');
      if (!status) return;
      status.textContent = 'Copied!';
      setTimeout(() => status.textContent = '', 1200);
    })
    .catch(() => {
      const status = document.getElementById('copyStatus');
      if (!status) return;
      status.textContent = 'Copy failed. Please try again.';
      setTimeout(() => status.textContent = '', 2000);
    });
}

function clearAll() {
  // Clear pressed states
  document.querySelectorAll('button[data-section]').forEach(b => b.classList.remove('pressed'));

  // Clear textareas
  ['conditionsText', 'painText', 'examText'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Remove output lines
  sectionOrder.forEach(name => {
    const div = document.getElementById(`output-${name}`);
    if (div) div.remove();
  });

  // Reset score + default recommendation
  const scoreEl = document.getElementById('scoreValue');
  if (scoreEl) scoreEl.textContent = '0';

  const recEl = document.getElementById('recommendationText');
  if (recEl) {
    recEl.textContent =
      'Proceed to D-dimer testing according to ADD-RS; if <500 ng/mL, consider stopping dissection workup, or if ≥500 ng/mL, consider CTA.';
  }

  // Clear status
  const status = document.getElementById('copyStatus');
  if (status) status.textContent = '';
}

// Initialize once the DOM exists
document.addEventListener('DOMContentLoaded', () => {
  updateTotalScoreAndRecommendation();
});
