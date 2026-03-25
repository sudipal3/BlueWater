

let SECTIONS = [];

let outputArea;
let NOTE_HEADING = '';
let NOTE_INTRO = '';

const state = {};
const textState = {};     // strings — for textareas

function btnClick(btn, text) {
    const section = btn.dataset.section;
    if (!state[section])state[section] = new Set();
    state[section].has(text) ? state[section].delete(text) : state[section].add(text);
    btn.classList.toggle('pressed');
    render();
}
function defaltSet(id) {
    btn = document.getElementById(id)
    btn.click();
}
function togglegroup(btn, text) {
    const section = btn.dataset.section;
    const pressed = document.querySelector(`[data-section="${section}"].pressed`);
    if (pressed) pressed.click();
    btnClick(btn, text)
}

function updateText(textarea) {
    const section = textarea.dataset.section;
    textState[section] = textarea.value.trim();
    render();
}

function render() {
    const lines = SECTIONS
        .map(section => {
            const buttons = state[section] ? [...state[section]] : [];
            const freetext = textState[section] || '';
            
            // Combine both sources, drop empty strings
            const val = [...buttons, freetext].filter(Boolean).join(', ');
            //const val = state[section] instanceof Set ? [...state[section]].join(', ') : (state[section] || '');
            return val ? `<strong>${fmt(section)}:</strong> ${val}` : '';
        })
        .filter(Boolean);

    outputArea.innerHTML = lines.length
        ? `<h2>${NOTE_HEADING}</h2><p>${NOTE_INTRO}</p>${lines.map(l => `<div>${l}</div>`).join('')}`
        : '';
}

function fmt(section) {
    return section.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
            .replace(/\bCt\b/, 'CT').replace(/\bNih\b/, 'NIH').replace(/\bLvo\b/, 'LVO');
}

// Function to trigger macros

function triggerMacro(buttonIds, macroButton) {
    // Reset the previous state
    clearOutput();

    // Activate the selected macro
    buttonIds.forEach(id => {
        const [section, buttonText] = id.split('-');
        const buttons = document.querySelectorAll(`[data-section="${section}"]`);
        const matchedButton = Array.from(buttons).find(btn => btn.innerText === buttonText);

        if (matchedButton) {
            const associatedText = matchedButton.getAttribute('onclick').match(/'([^']+)'/)[1];
            btnClick(matchedButton, associatedText);
        } else {
            console.warn(`Macro button not found: section=${section}, text=${buttonText}`);
        }
    });

    // Reflect macro button state
    if (macroButton) macroButton.classList.add('pressed');
}

async function copyOutput() {
    const outputArea = document.getElementById('outputArea');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}

function clearOutput() {
    Object.keys(state).forEach(k => delete state[k]);
    outputArea.innerHTML = '';
    document.querySelectorAll('.pressed').forEach(b => b.classList.remove('pressed'));
    document.querySelectorAll('textarea').forEach(t => t.value = '');

    if (typeof showCopyError === "function") showCopyError("");
}