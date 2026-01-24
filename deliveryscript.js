// deliveryscript.js

const sectionOrder = [
  'arrival',
  'deliverymethod',
  'infant',
  'perineum',
  'cordfluid',
  'placenta',
  'cordvessels',
  'laceration',
  'ebl',
  'newborn',
  'apgars'
];

// ---------- HEADER (once) ----------
function addMainHeader() {
  const outputArea = document.getElementById('outputArea');
  if (!outputArea.querySelector('h2')) {
    outputArea.insertAdjacentHTML(
      'afterbegin',
      `<h2>Emergent Delivery Procedure Note</h2>
       <p>The patient presented to the emergency department in precipitous labor. The team was coordinated to best facilitate the delivery within the constraints of an emergency department delivery.</p>`
    );
  }
}

function removeMainHeaderIfEmpty() {
  const outputArea = document.getElementById('outputArea');
  const hasAnySection = !!outputArea.querySelector('[id^="output-"]');
  if (!hasAnySection) {
    const header = outputArea.querySelector('h2');
    const paragraph = outputArea.querySelector('p');
    if (header) header.remove();
    if (paragraph) paragraph.remove();
  }
}

function formatSectionTitle(section) {
  return section
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bEbl\b/i, 'EBL');
}

function reorderSections(outputArea) {
  sectionOrder.forEach(section => {
    const sectionDiv = document.getElementById(`output-${section}`);
    if (sectionDiv) outputArea.appendChild(sectionDiv);
  });
}

function ensureSection(sectionName) {
  const outputArea = document.getElementById('outputArea');
  addMainHeader();

  let sectionDiv = document.getElementById(`output-${sectionName}`);
  if (!sectionDiv) {
    sectionDiv = document.createElement('div');
    sectionDiv.id = `output-${sectionName}`;
    sectionDiv.innerHTML = `<strong>${formatSectionTitle(sectionName)}:</strong> <span class="output-text"></span><br>`;
    outputArea.appendChild(sectionDiv);
  }

  return sectionDiv;
}

function removeSection(sectionName) {
  const sectionDiv = document.getElementById(`output-${sectionName}`);
  if (sectionDiv) sectionDiv.remove();

  // If section removed, unpress its buttons
  const buttons = document.querySelectorAll(`button[data-section="${sectionName}"]`);
  buttons.forEach(b => b.classList.remove('pressed'));

  removeMainHeaderIfEmpty();
}

// ---------- STATE: button text + free text kept separately ----------
const state = {
  deliverymethod: { button: '', free: '' },
  perineum: { button: '', free: '' },
  cordfluid: { meconium: '', nuchal: '', free: '' },
  placenta: { button: '', free: '' },
  laceration: { button: '', location: '', suture: '', free: '' },
  ebl: { button: '', exact: '' }
};

// ---------- BUTTON helpers ----------
function pressSingleSelectSiblingsOff(button) {
  const sectionName = button.getAttribute('data-section');
  const siblings = document.querySelectorAll(`button[data-section="${sectionName}"]`);
  siblings.forEach(b => {
    if (b !== button) b.classList.remove('pressed');
  });
}

// ---------- RENDERERS (append free text, don’t overwrite) ----------
function renderDeliveryMethod() {
  const choice = (state.deliverymethod.button || '').trim();
  const free = (state.deliverymethod.free || '').trim();

  if (!choice && !free) {
    removeSection('deliverymethod');
    return;
  }

  // If no choice but there is free text, still show a generic phrase
  let out = choice ? `Pushed to a ${choice}` : 'Pushed to a delivery';
  if (free) out += ` (${free})`;
  out += '.';

  const sectionDiv = ensureSection('deliverymethod');
  sectionDiv.querySelector('.output-text').textContent = out;
  reorderSections(document.getElementById('outputArea'));
}

function renderPerineum() {
  const choice = (state.perineum.button || '').trim();
  const free = (state.perineum.free || '').trim();

  if (!choice && !free) {
    removeSection('perineum');
    return;
  }

  let out = choice || '';
  if (free) out += (out ? ` (${free})` : free);
  if (out) out += '.';

  const sectionDiv = ensureSection('perineum');
  sectionDiv.querySelector('.output-text').textContent = out.trim();
  reorderSections(document.getElementById('outputArea'));
}

function renderCordFluid() {
  const mec = (state.cordfluid.meconium || '').trim();
  const nuc = (state.cordfluid.nuchal || '').trim();
  const free = (state.cordfluid.free || '').trim();

  if (!mec && !nuc && !free) {
    removeSection('cordfluid');
    return;
  }

  const parts = [];
  if (mec) parts.push(mec);
  if (nuc) parts.push(nuc);

  let out = parts.join('; ');
  if (out) out += '.';
  if (free) out += (out ? ' ' : '') + free;

  const sectionDiv = ensureSection('cordfluid');
  sectionDiv.querySelector('.output-text').textContent = out.trim();
  reorderSections(document.getElementById('outputArea'));
}

function renderPlacenta() {
  const choice = (state.placenta.button || '').trim();
  const free = (state.placenta.free || '').trim();

  if (!choice && !free) {
    removeSection('placenta');
    return;
  }

  let out = choice || '';
  if (free) out += (out ? `; ${free}` : free);
  if (out) out += '.';

  const sectionDiv = ensureSection('placenta');
  sectionDiv.querySelector('.output-text').textContent = out.trim();
  reorderSections(document.getElementById('outputArea'));
}

function renderLaceration() {
  const choice = (state.laceration.button || '').trim();
  const loc = (state.laceration.location || '').trim();
  const suture = (state.laceration.suture || '').trim();
  const free = (state.laceration.free || '').trim();

  if (!choice && !loc && !suture && !free) {
    removeSection('laceration');
    return;
  }

  let out = '';

  if (choice === 'no lacerations') {
    out = 'No lacerations.';
    if (free) out += ` ${free}`;
  } else {
    out = choice || 'Laceration';
    if (loc) out += ` (${loc})`;
    if (suture) out += ` repaired with ${suture}`;
    out += '.';
    if (free) out += ` ${free}`;
  }

  const sectionDiv = ensureSection('laceration');
  sectionDiv.querySelector('.output-text').textContent = out.trim();
  reorderSections(document.getElementById('outputArea'));
}

function renderEBL() {
  const choice = (state.ebl.button || '').trim();
  const exact = (state.ebl.exact || '').trim();

  if (!choice && !exact) {
    removeSection('ebl');
    return;
  }

  let out = '';
  if (exact) out += `EBL ${exact}.`;
  if (choice) out += (out ? ` ${choice}.` : `${choice}.`);

  const sectionDiv = ensureSection('ebl');
  sectionDiv.querySelector('.output-text').textContent = out.trim();
  reorderSections(document.getElementById('outputArea'));
}

// ---------- BUTTON HANDLER ----------
function handleButtonClick(button, value) {
  const sectionName = button.getAttribute('data-section');
  const isSingle = button.getAttribute('data-single') === 'true';

  // Toggle off
  if (button.classList.contains('pressed')) {
    button.classList.remove('pressed');

    switch (sectionName) {
      case 'deliverymethod':
        state.deliverymethod.button = '';
        renderDeliveryMethod();
        break;
      case 'infant':
        removeSection('infant');
        break;
      case 'perineum':
        state.perineum.button = '';
        renderPerineum();
        break;
      case 'meconium':
        state.cordfluid.meconium = '';
        renderCordFluid();
        break;
      case 'nuchal':
        state.cordfluid.nuchal = '';
        renderCordFluid();
        break;
      case 'placenta':
        state.placenta.button = '';
        renderPlacenta();
        break;
      case 'cordvessels':
        removeSection('cordvessels');
        break;
      case 'laceration':
        state.laceration.button = '';
        renderLaceration();
        break;
      case 'ebl':
        state.ebl.button = '';
        renderEBL();
        break;
      case 'newborn':
        removeSection('newborn');
        break;
      default:
        break;
    }

    return;
  }

  // Toggle on
  if (isSingle) pressSingleSelectSiblingsOff(button);
  button.classList.add('pressed');

  switch (sectionName) {
    case 'deliverymethod':
      state.deliverymethod.button = value;
      renderDeliveryMethod();
      break;

    case 'infant': {
      // simple single line (no free text)
      addMainHeader();
      const sectionDiv = ensureSection('infant');
      sectionDiv.querySelector('.output-text').textContent = `Pushed to a delivery of ${value}.`;
      reorderSections(document.getElementById('outputArea'));
      break;
    }

    case 'perineum':
      state.perineum.button = value;
      renderPerineum();
      break;

    case 'meconium':
      state.cordfluid.meconium = value;
      renderCordFluid();
      break;

    case 'nuchal':
      state.cordfluid.nuchal = value;
      renderCordFluid();
      break;

    case 'placenta':
      state.placenta.button = value;
      renderPlacenta();
      break;

    case 'cordvessels': {
      addMainHeader();
      const sectionDiv = ensureSection('cordvessels');
      sectionDiv.querySelector('.output-text').textContent = `${value}.`;
      reorderSections(document.getElementById('outputArea'));
      break;
    }

    case 'laceration':
      state.laceration.button = value;
      renderLaceration();
      break;

    case 'ebl':
      state.ebl.button = value;
      renderEBL();
      break;

    case 'newborn': {
      addMainHeader();
      const sectionDiv = ensureSection('newborn');
      sectionDiv.querySelector('.output-text').textContent = value;
      reorderSections(document.getElementById('outputArea'));
      break;
    }

    default:
      break;
  }
}

// ---------- FREE TEXT updaters (APPEND, not replace) ----------
function updateArrival() {
  const station = (document.getElementById('arrival_station').value || '').trim();
  const fht = (document.getElementById('arrival_fht').value || '').trim();
  const other = (document.getElementById('arrival_other').value || '').trim();

  if (!station && !fht && !other) {
    removeSection('arrival');
    return;
  }

  addMainHeader();
  const sectionDiv = ensureSection('arrival');

  const parts = [];
  if (station) parts.push(`When I arrived, head was at ${station} station`);
  if (fht) parts.push(`fetal heart tones were ${fht}`);

  let out = '';
  if (parts.length === 2) out = `${parts[0]} and ${parts[1]}.`;
  else if (parts.length === 1) out = `${parts[0]}.`;

  if (other) out += (out ? ' ' : '') + other;

  sectionDiv.querySelector('.output-text').textContent = out.trim();
  reorderSections(document.getElementById('outputArea'));
}

function updateDeliveryMethodOther() {
  state.deliverymethod.free = (document.getElementById('deliverymethod_other').value || '').trim();
  renderDeliveryMethod();
}

function updatePerineumDetails() {
  state.perineum.free = (document.getElementById('perineum_details').value || '').trim();
  renderPerineum();
}

function updateCordNotes() {
  state.cordfluid.free = (document.getElementById('cord_notes').value || '').trim();
  renderCordFluid();
}

function updatePlacentaNotes() {
  state.placenta.free = (document.getElementById('placenta_notes').value || '').trim();
  renderPlacenta();
}

function updateLacerationDetails() {
  state.laceration.location = (document.getElementById('laceration_location').value || '').trim();
  state.laceration.suture = (document.getElementById('laceration_suture').value || '').trim();
  state.laceration.free = (document.getElementById('laceration_notes').value || '').trim();
  renderLaceration();
}

function updateEBLExact() {
  state.ebl.exact = (document.getElementById('ebl_exact').value || '').trim();
  renderEBL();
}

function updateApgars() {
  const a1 = (document.getElementById('apgar_1').value || '').trim();
  const a5 = (document.getElementById('apgar_5').value || '').trim();
  const a10 = (document.getElementById('apgar_10').value || '').trim();

  if (!a1 && !a5 && !a10) {
    removeSection('apgars');
    return;
  }

  addMainHeader();
  const sectionDiv = ensureSection('apgars');

  let out = `Apgars ${a1 || '__'}/${a5 || '__'}`;
  if (a10) out += `/${a10}`;
  out += '.';

  sectionDiv.querySelector('.output-text').textContent = out;
  reorderSections(document.getElementById('outputArea'));
}

// ---------- Copy / Clear (stroke pattern) ----------
function copyToClipboard() {
  const outputArea = document.getElementById('outputArea');
  const range = document.createRange();
  range.selectNode(outputArea);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}

function clearOutput() {
  document.getElementById('outputArea').innerHTML = '';
  document.querySelectorAll('.pressed').forEach(btn => btn.classList.remove('pressed'));
  document.querySelectorAll('textarea').forEach(t => (t.value = ''));

  // reset state
  state.deliverymethod = { button: '', free: '' };
  state.perineum = { button: '', free: '' };
  state.cordfluid = { meconium: '', nuchal: '', free: '' };
  state.placenta = { button: '', free: '' };
  state.laceration = { button: '', location: '', suture: '', free: '' };
  state.ebl = { button: '', exact: '' };
}
