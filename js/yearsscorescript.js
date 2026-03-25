const yearsState = {
  pregnant: null,
  pregDvtSigns: null,
  ultrasound: null,
  dvt: null,
  hemoptysis: null,
  peMostLikely: null,
  ddimerAbove: null
};

/* ---------- Utilities ---------- */

function setPressedInGroup(button) {
  const group = button.parentElement;
  group.querySelectorAll('button').forEach(b => b.classList.remove('pressed'));
  button.classList.add('pressed');
}

function clearPressed(selector) {
  const root = document.querySelector(selector);
  if (!root) return;
  root.querySelectorAll('button').forEach(b => b.classList.remove('pressed'));
}

function countYearsItems() {
  return (
    (yearsState.dvt === 'Yes') +
    (yearsState.hemoptysis === 'Yes') +
    (yearsState.peMostLikely === 'Yes')
  );
}

function currentDdimerThreshold() {
  return countYearsItems() === 0 ? 1000 : 500;
}

/* ---------- Visibility ---------- */

function updateVisibility() {
  const pregDvt = document.getElementById('pregDvtGroup');
  const us = document.getElementById('ultrasoundGroup');
  const items = document.getElementById('yearsItemsGroup');
  const dd = document.getElementById('ddimerGroup');

  pregDvt.style.display = 'none';
  us.style.display = 'none';
  items.style.display = 'none';
  dd.style.display = 'none';

  if (!yearsState.pregnant) return;

  if (yearsState.pregnant === 'No') {
    items.style.display = 'block';
    dd.style.display = 'block';
    updateDdimerPrompt();
    return;
  }

  pregDvt.style.display = 'block';

  if (yearsState.pregDvtSigns === 'Yes') {
    us.style.display = 'block';

    if (yearsState.ultrasound === 'Normal') {
      items.style.display = 'block';
      dd.style.display = 'block';
      updateDdimerPrompt();
    }
    return;
  }

  if (yearsState.pregDvtSigns === 'No') {
    items.style.display = 'block';
    dd.style.display = 'block';
    updateDdimerPrompt();
  }
}

function updateDdimerPrompt() {
  const prompt = document.getElementById('ddimerPrompt');
  prompt.textContent = `Is D-dimer ≥ ${currentDdimerThreshold()} ng/mL (FEU)?`;
}

/* ---------- Input Handler ---------- */

function handleYearsButtonClick(button, key, value) {
  setPressedInGroup(button);
  yearsState[key] = value;

  if (['pregnant', 'pregDvtSigns', 'ultrasound'].includes(key)) {
    yearsState.dvt = null;
    yearsState.hemoptysis = null;
    yearsState.peMostLikely = null;
    yearsState.ddimerAbove = null;
    clearPressed('#yearsItemsGroup');
    clearPressed('#ddimerGroup');
  }

  if (['dvt', 'hemoptysis', 'peMostLikely'].includes(key)) {
    yearsState.ddimerAbove = null;
    clearPressed('#ddimerGroup');
  }

  updateVisibility();
  updateOutput();
}

/* ---------- Output ---------- */

function updateOutput() {
  const out = document.getElementById('yearsScoreOutput');
  let html = '';

  html += `<strong>YEARS Algorithm for PE</strong><br><br>`;
  html += `Pregnant: ${yearsState.pregnant ?? 'Not selected'}<br>`;

  if (!yearsState.pregnant) {
    out.innerHTML = html + '<br>Select pregnancy status to begin.';
    return;
  }

  if (yearsState.pregnant === 'Yes') {
    html += `Clinical signs of DVT (pregnancy pathway): ${yearsState.pregDvtSigns ?? 'Not selected'}<br>`;

    if (yearsState.pregDvtSigns === 'Yes') {
      html += `Compression ultrasound: ${yearsState.ultrasound ?? 'Not selected'}<br>`;

      if (yearsState.ultrasound === 'Abnormal') {
        out.innerHTML =
          html +
          '<br><strong>Recommendation:</strong> Initiate anticoagulant treatment per pregnancy-adapted YEARS pathway.';
        return;
      }
    }
  }

  html += '<br><strong>YEARS Criteria:</strong><br>';
  html += `- Clinical signs of DVT: ${yearsState.dvt ?? 'Not selected'}<br>`;
  html += `- Hemoptysis: ${yearsState.hemoptysis ?? 'Not selected'}<br>`;
  html += `- PE most likely diagnosis: ${yearsState.peMostLikely ?? 'Not selected'}<br>`;

  if (!yearsState.dvt || !yearsState.hemoptysis || !yearsState.peMostLikely) {
    out.innerHTML = html + '<br>Complete all YEARS criteria.';
    return;
  }

  html += `<br>YEARS items: ${countYearsItems()}<br>`;
  html += `D-dimer threshold: ${currentDdimerThreshold()} ng/mL (FEU)<br>`;
  html += `D-dimer ≥ threshold: ${yearsState.ddimerAbove ?? 'Not selected'}<br><br>`;

  if (!yearsState.ddimerAbove) {
    out.innerHTML = html + 'Select D-dimer result.';
    return;
  }

  html += `<strong>Recommendation:</strong> `;

  html +=
    yearsState.ddimerAbove === 'No'
      ? 'PE excluded per YEARS algorithm.'
      : 'PE not excluded — consider CTPA or other definitive imaging per YEARS algorithm.';

  out.innerHTML = html;
}

/* ---------- Copy / Clear ---------- */

function copyYearsOutput() {
  const text = document.getElementById('yearsScoreOutput').innerText;
  navigator.clipboard.writeText(text.trim());
}

function clearYearsOutput() {
  Object.keys(yearsState).forEach(k => (yearsState[k] = null));
  clearPressed('#yearsQuestionContainer');
  updateVisibility();
  document.getElementById('yearsScoreOutput').innerHTML = '';
}

/* ---------- Init ---------- */

document.addEventListener('DOMContentLoaded', () => {
  updateVisibility();
  document.getElementById('yearsScoreOutput').innerHTML =
    '<strong>YEARS Algorithm for PE</strong><br><br>Select pregnancy status to begin.';
});
