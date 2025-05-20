# Password Generator

A modern, secure password generator built with HTML, CSS, and JavaScript.

## Features

- Generate secure passwords with customizable options
- Adjust password length (8-32 characters)
- Include or exclude uppercase letters, lowercase letters, numbers, and symbols
- Password strength indicator
- Copy password to clipboard with one click
- View and manage password history
- Responsive design for all devices

## Files Structure

The project consists of three main files:

- `index.html` - The main HTML structure
- `style.css` - All styling and visual elements
- `script.js` - All JavaScript functionality

## How to Use

1. Open `index.html` in your web browser
2. Customize your password options:
   - Adjust the password length using the slider
   - Select which character types to include (uppercase, lowercase, numbers, symbols)
3. Click "Generate Password"
4. Copy the generated password to your clipboard
5. View your password history in the "Recently Generated" section

## Password Strength

The password strength is calculated based on entropy, which considers:
- Password length
- Character set diversity (uppercase, lowercase, numbers, symbols)

Strength levels:
- Weak: < 45 bits of entropy
- Medium: 45-60 bits of entropy
- Strong: 60-80 bits of entropy
- Very Strong: > 80 bits of entropy

## Example Input/Output

### Example 1: Strong Password with All Characters
- **Input Settings:**
  - Length: 16
  - Include Uppercase: ✓
  - Include Lowercase: ✓
  - Include Numbers: ✓
  - Include Symbols: ✓
- **Output:** `p7X@tQ9!rZ&m3*Kw`
- **Strength:** Very Strong

### Example 2: Medium-Length Password without Symbols
- **Input Settings:**
  - Length: 12
  - Include Uppercase: ✓
  - Include Lowercase: ✓
  - Include Numbers: ✓
  - Include Symbols: ✗
- **Output:** `A7n9T6pK4x2R`
- **Strength:** Strong

## Local Storage

The application uses the browser's localStorage to save your recently generated passwords, allowing you to access them even after closing and reopening the application.

## Browser Compatibility

This password generator works on all modern browsers that support ES6 JavaScript features.

## License

This project is available as open source under the terms of the MIT License.
