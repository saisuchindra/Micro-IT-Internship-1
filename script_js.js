// DOM elements
const passwordText = document.getElementById('password-text');
const copyBtn = document.getElementById('copy-btn');
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const generateBtn = document.getElementById('generate-btn');
const strengthText = document.getElementById('strength-text');
const strengthBars = [
    document.getElementById('bar-1'),
    document.getElementById('bar-2'),
    document.getElementById('bar-3'),
    document.getElementById('bar-4')
];
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

// Character sets
const charset = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

// Password history
let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];

// Update length value display
lengthSlider.addEventListener('input', () => {
    lengthValue.textContent = lengthSlider.value;
});

// Generate password
generateBtn.addEventListener('click', generatePassword);

// Copy password
copyBtn.addEventListener('click', copyToClipboard);

// Clear history
clearHistoryBtn.addEventListener('click', clearHistory);

// Initialize history
updateHistoryList();

// Generate password function
function generatePassword() {
    // Ensure at least one option is selected
    if (!uppercaseCheckbox.checked && 
        !lowercaseCheckbox.checked && 
        !numbersCheckbox.checked && 
        !symbolsCheckbox.checked) {
        alert('Please select at least one character type');
        return;
    }

    const length = lengthSlider.value;
    let chars = '';
    let password = '';

    // Build character set based on options
    if (uppercaseCheckbox.checked) chars += charset.uppercase;
    if (lowercaseCheckbox.checked) chars += charset.lowercase;
    if (numbersCheckbox.checked) chars += charset.numbers;
    if (symbolsCheckbox.checked) chars += charset.symbols;

    // Generate password
    let hasRequiredChars = false;
    while (!hasRequiredChars) {
        password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }
        
        // Verify password has at least one of each selected char type
        hasRequiredChars = true;
        if (uppercaseCheckbox.checked && !/[A-Z]/.test(password)) hasRequiredChars = false;
        if (lowercaseCheckbox.checked && !/[a-z]/.test(password)) hasRequiredChars = false;
        if (numbersCheckbox.checked && !/[0-9]/.test(password)) hasRequiredChars = false;
        if (symbolsCheckbox.checked && !/[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password)) hasRequiredChars = false;
    }

    // Display password
    passwordText.textContent = password;
    passwordText.classList.remove('password-placeholder');
    copyBtn.style.display = 'flex';

    // Calculate and update strength
    updatePasswordStrength(password);

    // Add to history
    addToHistory(password);
}

// Copy to clipboard
function copyToClipboard() {
    const password = passwordText.textContent;
    if (password && !passwordText.classList.contains('password-placeholder')) {
        navigator.clipboard.writeText(password)
            .then(() => {
                // Visual feedback
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="copy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                `;
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 1500);
            })
            .catch(err => {
                console.error('Could not copy password: ', err);
            });
    }
}

// Calculate password strength
function updatePasswordStrength(password) {
    // Factors affecting strength
    const length = password.length;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password);
    
    const charsetSize = 
        (hasLower ? 26 : 0) + 
        (hasUpper ? 26 : 0) + 
        (hasNumber ? 10 : 0) + 
        (hasSymbol ? 33 : 0);
    
    // Calculate entropy (bits) = log2(charsetSize^length)
    const entropy = Math.log2(Math.pow(charsetSize, length));
    
    // Determine strength based on entropy
    let strength = '';
    let activeBars = 0;
    let strengthClass = '';
    
    if (entropy < 45) {
        strength = 'Weak';
        activeBars = 1;
        strengthClass = 'weak';
    } else if (entropy < 60) {
        strength = 'Medium';
        activeBars = 2;
        strengthClass = 'medium';
    } else if (entropy < 80) {
        strength = 'Strong';
        activeBars = 3;
        strengthClass = 'strong';
    } else {
        strength = 'Very Strong';
        activeBars = 4;
        strengthClass = 'very-strong';
    }
    
    // Update UI
    strengthText.textContent = strength;
    strengthText.className = 'strength-text ' + strengthClass;
    
    // Update bars
    strengthBars.forEach((bar, index) => {
        bar.className = 'strength-bar';
        if (index < activeBars) {
            bar.classList.add('active');
            bar.classList.add(strengthClass);
        }
    });
}

// Add password to history
function addToHistory(password) {
    // Add to beginning of array
    passwordHistory.unshift(password);
    
    // Keep only latest 10 passwords
    if (passwordHistory.length > 10) {
        passwordHistory = passwordHistory.slice(0, 10);
    }
    
    // Save to localStorage
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
    
    // Update UI
    updateHistoryList();
}

// Update history list in UI
function updateHistoryList() {
    if (passwordHistory.length === 0) {
        historyList.innerHTML = '<li class="no-history">No passwords generated yet</li>';
        return;
    }
    
    historyList.innerHTML = '';
    
    passwordHistory.forEach((password, index) => {
        const item = document.createElement('li');
        item.className = 'history-item';
        
        const passwordSpan = document.createElement('span');
        passwordSpan.className = 'history-password';
        passwordSpan.textContent = password;
        
        const copyButton = document.createElement('button');
        copyButton.className = 'history-copy';
        copyButton.innerHTML = 'Copy';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(password)
                .then(() => {
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 1500);
                });
        });
        
        item.appendChild(passwordSpan);
        item.appendChild(copyButton);
        historyList.appendChild(item);
    });
}

// Clear history
function clearHistory() {
    passwordHistory = [];
    localStorage.removeItem('passwordHistory');
    updateHistoryList();
}
