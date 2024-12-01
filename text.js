document.addEventListener('DOMContentLoaded', () => {
    // Get all elements
    const notepad = document.getElementById('notepad');
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const boldBtn = document.getElementById('bold');
    const italicBtn = document.getElementById('italic');
    const underlineBtn = document.getElementById('underline');
    const highlightBtn = document.getElementById('highlight');
    const voiceBtn = document.getElementById('voiceInput');
    const darkModeBtn = document.getElementById('darkMode');

    // Load saved content immediately when page loads
    const savedContent = localStorage.getItem('notepadContent');
    if (savedContent) {
        notepad.innerHTML = savedContent;
    }

    // Save content whenever it changes
    notepad.addEventListener('input', () => {
        localStorage.setItem('notepadContent', notepad.innerHTML);
    });

    // Also save content before user leaves the page
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('notepadContent', notepad.innerHTML);
    });

    // Load saved font settings
    const savedFontFamily = localStorage.getItem('fontFamily');
    const savedFontSize = localStorage.getItem('fontSize');
    
    if (savedFontFamily) {
        notepad.style.fontFamily = savedFontFamily;
        fontFamily.value = savedFontFamily;
    }
    
    if (savedFontSize) {
        notepad.style.fontSize = savedFontSize;
        fontSize.value = savedFontSize.replace('px', '');
    }

    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeBtn.classList.add('active');
    }

    // Text formatting function
    function formatText(command, value = null) {
        if (command === 'backColor') {
            const selection = window.getSelection();
            if (selection.toString().length > 0) {
                // If highlight button is active, remove highlight
                if (highlightBtn.classList.contains('active')) {
                    document.execCommand(command, false, 'transparent');
                } else {
                    document.execCommand(command, false, value);
                }
                updateButtonStates();
            }
        } else {
            document.execCommand(command, false, value);
            updateButtonStates();
        }
        notepad.focus();
    }

    // Update button states based on current text formatting
    function updateButtonStates() {
        boldBtn.classList.toggle('active', document.queryCommandState('bold'));
        italicBtn.classList.toggle('active', document.queryCommandState('italic'));
        underlineBtn.classList.toggle('active', document.queryCommandState('underline'));
    }

    // Text formatting event listeners
    boldBtn.addEventListener('click', () => {
        formatText('bold');
    });

    italicBtn.addEventListener('click', () => {
        formatText('italic');
    });

    underlineBtn.addEventListener('click', () => {
        formatText('underline');
    });

    highlightBtn.addEventListener('click', () => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            formatText('backColor', 'yellow');
            highlightBtn.classList.toggle('active');
        }
    });

    voiceBtn.addEventListener('click', () => {
        alert('Voice input feature coming soon!');
    });

    // Dark mode toggle
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeBtn.classList.toggle('active');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Font controls with persistence
    fontFamily.addEventListener('change', (e) => {
        notepad.style.fontFamily = e.target.value;
        localStorage.setItem('fontFamily', e.target.value);
    });

    fontSize.addEventListener('change', (e) => {
        const size = `${e.target.value}px`;
        notepad.style.fontSize = size;
        localStorage.setItem('fontSize', size);
    });

    // File operations
    document.getElementById('newFile').addEventListener('click', () => {
        if (confirm('Are you sure you want to create a new file? Any unsaved changes will be lost.')) {
            notepad.innerHTML = '';
            localStorage.removeItem('notepadContent');
        }
    });

    document.getElementById('openFile').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt, .html';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                notepad.innerHTML = e.target.result;
                localStorage.setItem('notepadContent', notepad.innerHTML);
            };
            reader.readAsText(file);
        };
        input.click();
    });

    document.getElementById('save').addEventListener('click', () => {
        const textContent = notepad.innerText;
        const htmlContent = notepad.innerHTML;
        
        // Create text file
        const textBlob = new Blob([textContent], { type: 'text/plain' });
        const textLink = document.createElement('a');
        textLink.download = 'notepad.txt';
        textLink.href = URL.createObjectURL(textBlob);
        textLink.click();
        URL.revokeObjectURL(textLink.href);
        
        // Create HTML file (preserves formatting)
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const htmlLink = document.createElement('a');
        htmlLink.download = 'notepad.html';
        htmlLink.href = URL.createObjectURL(htmlBlob);
        htmlLink.click();
        URL.revokeObjectURL(htmlLink.href);
    });

    document.getElementById('printFile').addEventListener('click', () => {
        window.print();
    });

    // Edit operations
    document.getElementById('cut').addEventListener('click', () => formatText('cut'));
    document.getElementById('copy').addEventListener('click', () => formatText('copy'));
    document.getElementById('paste').addEventListener('click', () => formatText('paste'));

    // Update button states when selection changes
    notepad.addEventListener('mouseup', updateButtonStates);
    notepad.addEventListener('keyup', updateButtonStates);
});
