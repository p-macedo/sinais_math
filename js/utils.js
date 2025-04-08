function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomOperator() {
    const operators = ['+', '-', '×', '÷'];
    return operators[Math.floor(Math.random() * operators.length)];
}

function getRandomSign() {
    return Math.random() < 0.5 ? '+' : '-';
}

function calculateAnswer(a, signA, b, signB, operator) {
    const numA = signA === '+' ? a : -a;
    const numB = signB === '+' ? b : -b;

    switch (operator) {
        case '+': return numA + numB;
        case '-': return numA - numB;
        case '×': return numA * numB;
        case '÷': return numA / numB;
    }
}

function formatMathExpression(a, signA, b, signB, operator) {
    if (operator === '+' || operator === '-') {
        return `(${signA}${a}) ${operator} (${signB}${b})`;
    } else {
        const first = signA === '-' ? `-${a}` : a;
        const second = signB === '-' ? `-${b}` : b;
        return `${first} ${operator} ${second}`;
    }
}