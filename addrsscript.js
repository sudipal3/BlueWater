// add-rs.js

// Order for output lines
const sectionOrder = ['conditions', 'pain', 'exam'];

// Human-readable labels (for output + copy)
function formatSectionTitle(sectionName) {
  const map = {
    conditions: 'Any high-risk condition',
    pain: 'Any high-risk pain feature',
    exam: 'Any high-risk exam feature'
  };
  return map[sectionName] || sectionName;
}

// Create / get a section line in the output area
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
      <br>
    `;
    outputArea.appendChild(sectionDiv);
    reorderSections();
  }
  return sectionDiv;
}

// Keep output lines in a consistent order
function reorderSections() {
  const outputArea = document.getElementById('outputArea');

  const sections = sectionOrder
    .map(name => document.getElementById(`output-${name}`))
    .filter(Boolean);

  sections.forEach(div => div.remove());
  sections.forEach(div => outputArea.appendChild(div));
}

// YES/NO buttons (exclusive per section) + pressed styling
function handleYesNoButton(button, text, score) {
  const sectionName = button.getAttribute('data-section');
  const sectionDiv = ensureSection(sectionName);
  const outputText = sectionDiv.querySelector('.output-text');

  const isPressed = button.classList.contains('pressed');

  // Unpress both buttons in this section
  const siblingButtons = document.querySelectorAll(`button[data-section="${sectionName}"]`);
  siblingButtons.forEach(b => b.classList.remove('pressed'));

  if (isPressed) {
    // Toggle OFF (clears section back to unknown/blank)
    outputText.textContent = '';
    sectionDiv.setAttribute('data-score', '0');
  } else {
    // Toggle ON
    button.classList.add('pressed');
    outputText.textContent = text;
    sectionDiv.setAttribute('data-score', String(score));
  }

  cleanupIfEmpty(sectionName);
  updateTotalScoreAndRecommendation();
  reorderSections();
}

// Remove section line if nothing selected (keeps output clean)
function cleanupIfEmpty(sectionName) {
  const sectionDiv = document.getElementById(`output-${sectionName}`);
  if (!sectionDiv) return;

  const main = sectionDiv.querySelector('.output-text')?.textContent.trim() || '';
  if (!main) sectionDiv.remove();
}

// Sum score across the three yes/no categories and set recommendation text
function updateTotalScoreAndRecommendation() {
  let total = 0;

  sectionOrder.forEach(name => {
    const div = document.getElementById(`output-${name}`);
    if (div) {
      const val = parseInt(div.getAttribute('data-score') || '0', 10);
      total += isNaN(val) ? 0 : val;
    }
  });

  document.getElementById('scoreValue').textContent = String(total);

  const recEl = document.getElementById('recommendationText');
  if (total <= 1) {
    recEl.textContent =
      'Proceed to D-dimer testing according to ADD-RS; if <500 ng/mL, consider stopping dissection workup, or if ≥500 ng/mL, consider CTA.';
  } else {
    recEl.textContent =
      'Consider proceeding directly to CTA or other conclusive imaging according to ADD-RS.';
  }
}

// Copy output to clipboard
function copyToClipboard() {
  const total = document.getElementById('scoreValue').textContent;
  const rec = document.getElementById('recommendationText').textContent;

  let text =
    `ADD-RS (Aortic Dissection Detection Risk Score)\n` +
    `ADD-RS Total: ${total}/3\n` +
    `Recommendation: ${rec}\n`;

  // Include selected Yes/No lines (if any)
  sectionOrder.forEach(name => {
    const div = document.getElementById(`output-${name}`);
    if (!div) return;

    const label = formatSectionTitle(name);
    const main = div.querySelector('.output-text')?.textContent.trim() || '';
    if (!main) return;

    text += `\n${label}: ${main}`;
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
  // Clear pressed states
  document.querySelectorAll('button[data-section]').forEach(b => b.classList.remove('pressed'));

  // Remove output lines
  sectionOrder.forEach(name => {
    const div = document.getElementById(`output-${name}`);
    if (div) div.remove();
  });

  // Reset score + default recommendation
  document.getElementById('scoreValue').textContent = '0';
  document.getElementById('recommendationText').textContent =
    'Proceed to D-dimer testing according to ADD-RS; if <500 ng/mL, consider stopping dissection workup, or if ≥500 ng/mL, consider CTA.';

  // Clear status
  const status = document.getElementById('copyStatus');
  if (status) status.textContent = '';
}

// Initialize on load (ensures recommendation matches default score)
updateTotalScoreAndRecommendation();
