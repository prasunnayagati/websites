document.addEventListener('DOMContentLoaded', function() {
    const result = document.getElementById('result');
    const buttons = document.querySelectorAll('button');
    
    let currentInput = '';
    let currentOperation = null;
    let previousInput = '';
    
    // Add event listeners to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonValue = this.textContent;
            
            // Handle number buttons
            if (this.classList.contains('number')) {
                // Prevent multiple decimal points
                if (buttonValue === '.' && currentInput.includes('.')) {
                    return;
                }
                
                // Handle initial decimal point
                if (buttonValue === '.' && currentInput === '') {
                    currentInput = '0.';
                } else {
                    currentInput += buttonValue;
                }
                
                result.value = currentInput;
            }
            
            // Handle operator buttons
            if (this.classList.contains('operator') && buttonValue !== '⌫') {
                if (currentInput !== '') {
                    if (previousInput !== '') {
                        // Perform calculation if there's already a previous input
                        calculate();
                    }
                    
                    previousInput = currentInput;
                    currentInput = '';
                    
                    switch (buttonValue) {
                        case '+':
                            currentOperation = 'add';
                            break;
                        case '-':
                            currentOperation = 'subtract';
                            break;
                        case '×':
                            currentOperation = 'multiply';
                            break;
                        case '÷':
                            currentOperation = 'divide';
                            break;
                    }
                }
            }
            
            // Handle clear button
            if (this.id === 'clear') {
                clear();
            }
            
            // Handle backspace button
            if (this.id === 'backspace') {
                if (currentInput !== '') {
                    currentInput = currentInput.slice(0, -1);
                    result.value = currentInput === '' ? '0' : currentInput;
                }
            }
            
            // Handle equals button
            if (this.id === 'equals') {
                calculate();
            }
        });
    });
    
    // Function to perform calculation
    function calculate() {
        if (currentInput === '' || previousInput === '') {
            return;
        }
        
        const num1 = parseFloat(previousInput);
        const num2 = parseFloat(currentInput);
        let calculationResult;
        
        switch (currentOperation) {
            case 'add':
                calculationResult = num1 + num2;
                break;
            case 'subtract':
                calculationResult = num1 - num2;
                break;
            case 'multiply':
                calculationResult = num1 * num2;
                break;
            case 'divide':
                if (num2 === 0) {
                    result.value = 'Error';
                    currentInput = '';
                    previousInput = '';
                    currentOperation = null;
                    return;
                }
                calculationResult = num1 / num2;
                break;
            default:
                return;
        }
        
        // Format the result to avoid extremely long decimal numbers
        calculationResult = Math.round(calculationResult * 1000000) / 1000000;
        
        result.value = calculationResult;
        previousInput = '';
        currentInput = calculationResult.toString();
        currentOperation = null;
    }
    
    // Function to clear the calculator
    function clear() {
        currentInput = '';
        previousInput = '';
        currentOperation = null;
        result.value = '0';
    }
    
    // Add keyboard support
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        // Numbers
        if (/^[0-9]$/.test(key)) {
            document.getElementById(getNumberId(key)).click();
        }
        
        // Decimal point
        if (key === '.') {
            document.getElementById('decimal').click();
        }
        
        // Operators
        switch (key) {
            case '+':
                document.getElementById('add').click();
                break;
            case '-':
                document.getElementById('subtract').click();
                break;
            case '*':
                document.getElementById('multiply').click();
                break;
            case '/':
                event.preventDefault(); // Prevent browser's find functionality
                document.getElementById('divide').click();
                break;
            case 'Enter':
                document.getElementById('equals').click();
                break;
            case 'Escape':
                document.getElementById('clear').click();
                break;
            case 'Backspace':
                document.getElementById('backspace').click();
                break;
        }
    });
    
    // Helper function to get number button id
    function getNumberId(num) {
        const numberWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        return numberWords[parseInt(num)];
    }
    
    // Initialize display
    clear();
});