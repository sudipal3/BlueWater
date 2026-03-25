// Initialize the answers object
let pecarnSelectedAnswers = {
    age: null,
    gcsFractureAMS: null,
    scalpLOCActingMechanism: null,
    basilarAMS: null,
    vomitingHeadacheMechanism: null
};

// Handle button clicks for the PECARN tool
function handlePECARNButtonClick(button, criterion, answer) {
    const buttons = button.parentElement.querySelectorAll('button');
    const questionContainer = document.getElementById('pecarnQuestionContainer');

    // Unselect all other buttons in the section
    buttons.forEach(btn => btn.classList.remove('pressed'));

    // Select or unselect the clicked button
    if (button.classList.contains('pressed')) {
        button.classList.remove('pressed');
        pecarnSelectedAnswers[criterion] = null;
        clearPECARNQuestions(criterion); // Clear subsequent questions if answer is unselected
    } else {
        button.classList.add('pressed');
        pecarnSelectedAnswers[criterion] = answer;
    }

    // Determine the next question or result based on the current answer
    if (criterion === 'age') {
        clearPECARNQuestions('gcsFractureAMS');
        if (answer === '<2 years old') {
            addQuestion(questionContainer, 'gcsFractureAMS', 'GCS ≤14, palpable skull fracture or signs of AMS', handlePECARNButtonClick);
        } else if (answer === '≥2 years old') {
            addQuestion(questionContainer, 'basilarAMS', 'GCS ≤14 or signs of basilar skull fracture or signs of AMS', handlePECARNButtonClick);
        }
    } else if (criterion === 'gcsFractureAMS' && answer === 'No') {
        clearPECARNQuestions('scalpLOCActingMechanism');
        addQuestion(questionContainer, 'scalpLOCActingMechanism', 'Occipital, parietal or temporal scalp hematoma; history of LOC ≥5 sec; not acting normally per parent or severe mechanism of injury?', handlePECARNButtonClick);
    } else if (criterion === 'basilarAMS' && answer === 'No') {
        clearPECARNQuestions('vomitingHeadacheMechanism');
        addQuestion(questionContainer, 'vomitingHeadacheMechanism', 'History of LOC or history of vomiting or severe headache or severe mechanism of injury?', handlePECARNButtonClick);
    }

    updatePECARNOutput();
}

// Function to add new questions dynamically
function addQuestion(container, criterion, questionText, clickHandler) {
    const existingQuestion = document.getElementById(criterion);
    if (existingQuestion) return; // Don't add if it already exists

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    inputGroup.id = criterion;
    inputGroup.innerHTML = `
        <h3>${questionText}</h3>
        <button onclick="handlePECARNButtonClick(this, '${criterion}', 'No')">No</button>
        <button onclick="handlePECARNButtonClick(this, '${criterion}', 'Yes')">Yes</button>
    `;
    container.appendChild(inputGroup);
}

// Function to clear subsequent questions
function clearPECARNQuestions(fromCriterion) {
    const questionIds = ['gcsFractureAMS', 'scalpLOCActingMechanism', 'basilarAMS', 'vomitingHeadacheMechanism'];
    const index = questionIds.indexOf(fromCriterion);

    questionIds.slice(index + 1).forEach(id => {
        const questionElement = document.getElementById(id);
        if (questionElement) questionElement.remove();
    });
}

// Function to update the PECARN output based on answers
function updatePECARNOutput() {
    const outputArea = document.getElementById('pecarnScoreOutput');
    let result = '';
    const negativeCriteria = [];
    const positiveCriteria = [];

    // Collect negative criteria answers
    if (pecarnSelectedAnswers.age === '<2 years old') {
        if (pecarnSelectedAnswers.gcsFractureAMS === 'No') {
            negativeCriteria.push('No: GCS ≤14, palpable skull fracture or signs of AMS');
        }
        if (pecarnSelectedAnswers.scalpLOCActingMechanism === 'No') {
            negativeCriteria.push('No: Occipital, parietal or temporal scalp hematoma; history of LOC ≥5 sec; not acting normally per parent or severe mechanism of injury');
        }
    } else if (pecarnSelectedAnswers.age === '≥2 years old') {
        if (pecarnSelectedAnswers.basilarAMS === 'No') {
            negativeCriteria.push('No: GCS ≤14 or signs of basilar skull fracture or signs of AMS');
        }
        if (pecarnSelectedAnswers.vomitingHeadacheMechanism === 'No') {
            negativeCriteria.push('No: History of LOC or history of vomiting or severe headache or severe mechanism of injury');
        }
    }

    // Collect positive criteria answers
    if (pecarnSelectedAnswers.age === '<2 years old') {
        if (pecarnSelectedAnswers.gcsFractureAMS === 'Yes') {
            positiveCriteria.push('Yes: GCS ≤14, palpable skull fracture or signs of AMS');
        }
        if (pecarnSelectedAnswers.scalpLOCActingMechanism === 'Yes') {
            positiveCriteria.push('Yes: Occipital, parietal or temporal scalp hematoma; history of LOC ≥5 sec; not acting normally per parent or severe mechanism of injury');
        }
    } else if (pecarnSelectedAnswers.age === '≥2 years old') {
        if (pecarnSelectedAnswers.basilarAMS === 'Yes') {
            positiveCriteria.push('Yes: GCS ≤14 or signs of basilar skull fracture or signs of AMS');
        }
        if (pecarnSelectedAnswers.vomitingHeadacheMechanism === 'Yes') {
            positiveCriteria.push('Yes: History of LOC or history of vomiting or severe headache or severe mechanism of injury');
        }
    }

    // Determine the result
    if (pecarnSelectedAnswers.age === '<2 years old') {
        if (pecarnSelectedAnswers.gcsFractureAMS === 'Yes') {
            result = 'PECARN recommends CT; 4.4% risk of clinically important Traumatic Brain Injury.';
        } else if (pecarnSelectedAnswers.scalpLOCActingMechanism === 'Yes') {
            result = 'PECARN recommends observation over imaging, depending on provider comfort; 0.9% risk of clinically important Traumatic Brain Injury.';
        } else if (pecarnSelectedAnswers.scalpLOCActingMechanism === 'No') {
            result = 'PECARN recommends No CT; Risk of ciTBI <0.02%, exceedingly low, generally lower than risk of CT-induced malignancies.';
        }
    } else if (pecarnSelectedAnswers.age === '≥2 years old') {
        if (pecarnSelectedAnswers.basilarAMS === 'Yes') {
            result = 'PECARN recommends CT; 4.3% risk of clinically important Traumatic Brain Injury.';
        } else if (pecarnSelectedAnswers.vomitingHeadacheMechanism === 'Yes') {
            result = 'PECARN recommends observation over imaging, depending on provider comfort; 0.9% risk of clinically important Traumatic Brain Injury.';
        } else if (pecarnSelectedAnswers.vomitingHeadacheMechanism === 'No') {
            result = 'PECARN recommends No CT; Risk <0.05%, “Exceedingly Low, generally lower than risk of CT-induced malignancies.”';
        }
    }

    // Display the output with negative and positive criteria
    const negativeCriteriaText = negativeCriteria.length > 0 ? `Negative Criteria: ${negativeCriteria.join('; ')}<br><br>` : '';
    const positiveCriteriaText = positiveCriteria.length > 0 ? `Positive Criteria: ${positiveCriteria.join('; ')}<br><br>` : '';
    outputArea.innerHTML = `<strong>PECARN Pediatric Head Rule</strong><br><br>${negativeCriteriaText}${positiveCriteriaText}${result}`;
}

// Function to clear the PECARN output
function clearPECARNOutput() {
    pecarnSelectedAnswers = {
        age: null,
        gcsFractureAMS: null,
        scalpLOCActingMechanism: null,
        basilarAMS: null,
        vomitingHeadacheMechanism: null
    };

    document.querySelectorAll('.pressed').forEach(button => button.classList.remove('pressed'));

    clearPECARNQuestions('age');
    document.getElementById('pecarnScoreOutput').innerHTML = '';
}

// Function to copy the output text to the clipboard
function copyToClipboard(elementId) {
    const output = document.getElementById(elementId);
    const range = document.createRange();
    range.selectNode(output);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}
