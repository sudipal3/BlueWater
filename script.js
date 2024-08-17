function toggleText(text) {
    const outputArea = document.getElementById('outputArea');
    let currentContent = outputArea.innerHTML;

    if (currentContent.includes(text)) {
        // If text is found, remove it
        outputArea.innerHTML = currentContent.replace(text + "<br>", "");
    } else {
        // If text is not found, add it
        outputArea.innerHTML += text + "<br>";
    }
}

function updateRealTimeText(sectionTitle, textareaId) {
    const textarea = document.getElementById(textareaId);
    const outputArea = document.getElementById('outputArea');
    
    // Remove any previous text from this section
    let updatedContent = outputArea.innerHTML.replace(new RegExp(`${sectionTitle}:.*<br>`, 'g'), '');

    // Add the current text from the textarea
    if (textarea.value.trim() !== "") {
        updatedContent += `${sectionTitle}: ${textarea.value.trim()}<br>`;
    }

    // Update the output area with the new content
    outputArea.innerHTML = updatedContent;
}

function copyToClipboard() {
    const outputArea = document.getElementById('outputArea');
    const range = document.createRange();
    range.selectNode(outputArea);
    window.getSelection().removeAllRanges(); // Clear current selection
    window.getSelection().addRange(range); // Select text
    document.execCommand("copy");
    window.getSelection().removeAllRanges(); // Deselect
}
