// State management
const state = {
    exercises: [],
    userAnswers: [],
    currentProgress: 0
};

// DOM elements
const elements = {
    exercisesContainer: document.getElementById('exercises-container'),
    progressText: document.getElementById('progress-text'),
    progressBar: document.getElementById('progress-bar'),
    resultsPanel: document.getElementById('results-panel'),
    scorePercentage: document.getElementById('score-percentage'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message'),
    resultBar: document.getElementById('result-bar'),
    correctCount: document.getElementById('correct-count'),
    incorrectCount: document.getElementById('incorrect-count'),
    generateNewBtn: document.getElementById('generate-new'),
    tryAgainBtn: document.getElementById('try-again')
};

// Configuration
const config = {
    maxNumber: 100,
    minNumber: 1,
    totalExercises: 100
};

// App controller
const app = {
    init() {
        this.generateExercises();

        // Event listeners
        elements.generateNewBtn.addEventListener('click', () => {
            this.generateExercises();
        });

        elements.tryAgainBtn.addEventListener('click', () => {
            this.generateExercises();
        });

        // Expose handleAnswerInput to global scope
        window.app = window.app || {};
        window.app.handleAnswerInput = this.handleAnswerInput.bind(this);
    },

    generateExercises() {
        state.exercises = [];
        state.userAnswers = Array(config.totalExercises).fill('');
        state.currentProgress = 0;

        elements.exercisesContainer.innerHTML = '';
        elements.resultsPanel.classList.add('hidden');
        this.updateProgress(0);

        for (let i = 0; i < config.totalExercises; i++) {
            const exercise = this.createExercise(i);
            state.exercises.push(exercise);
            this.createExerciseElement(i, exercise);
        }
    },

    createExercise(index) {
        let a, b, operator, signA, signB;

        operator = getRandomOperator();

        if (operator === '÷') {
            b = getRandomInt(config.minNumber, config.maxNumber);
            const multiplier = getRandomInt(1, Math.floor(config.maxNumber / b));
            a = b * multiplier;
            signA = getRandomSign();
            signB = getRandomSign();
        } else {
            a = getRandomInt(config.minNumber, config.maxNumber);
            b = getRandomInt(config.minNumber, config.maxNumber);
            signA = getRandomSign();
            signB = getRandomSign();
        }

        const expression = formatMathExpression(a, signA, b, signB, operator);
        const answer = calculateAnswer(a, signA, b, signB, operator);

        return {
            id: index,
            expression,
            answer,
            operator
        };
    },

    createExerciseElement(index, exercise) {
        const exerciseElement = document.createElement('div');
        exerciseElement.className = 'bg-gray-50 rounded-lg p-4';
        exerciseElement.innerHTML = `
            <div class="flex items-center">
                <span class="font-medium text-gray-700 mr-3">${index + 1}.</span>
                <div class="math-expression mr-3">${exercise.expression} =</div>
                <input type="text" 
                       id="answer-${index}" 
                       class="answer-input rounded-lg py-1 px-3" 
                       data-exercise-id="${index}"
                       oninput="app.handleAnswerInput(${index}, this.value)">
            </div>
        `;

        elements.exercisesContainer.appendChild(exerciseElement);
    },

    updateProgress(answeredCount) {
        const percentage = Math.round((answeredCount / config.totalExercises) * 100);
        state.currentProgress = percentage;

        elements.progressText.textContent = `${percentage}% completo`;
        elements.progressBar.style.width = `${percentage}%`;

        // Change color based on progress
        if (percentage < 30) {
            elements.progressBar.className = 'progress-bar bg-red-500 rounded-full h-2.5 transition-all duration-500';
        } else if (percentage < 70) {
            elements.progressBar.className = 'progress-bar bg-yellow-500 rounded-full h-2.5 transition-all duration-500';
        } else if (percentage < 100) {
            elements.progressBar.className = 'progress-bar bg-green-500 rounded-full h-2.5 transition-all duration-500';
        } else {
            elements.progressBar.className = 'progress-bar bg-indigo-600 rounded-full h-2.5 transition-all duration-500';
        }
    },

    checkAnswers() {
        let correctCount = 0;

        state.exercises.forEach((exercise, index) => {
            const userAnswer = state.userAnswers[index];
            const inputElement = document.getElementById(`answer-${index}`);

            if (inputElement) {
                inputElement.classList.remove('correct-answer', 'incorrect-answer');

                if (userAnswer !== '' && !isNaN(userAnswer)) {
                    if (parseFloat(userAnswer) === exercise.answer) {
                        correctCount++;
                        inputElement.classList.add('correct-answer');
                    } else {
                        inputElement.classList.add('incorrect-answer');
                    }
                }
            }
        });

        return correctCount;
    },

    showResults() {
        const correctCount = this.checkAnswers();
        const incorrectCount = config.totalExercises - correctCount;
        const percentage = Math.round((correctCount / config.totalExercises) * 100);

        elements.scorePercentage.textContent = percentage;
        elements.correctCount.textContent = correctCount;
        elements.incorrectCount.textContent = incorrectCount;

        elements.resultBar.style.width = `${percentage}%`;
        if (percentage < 50) {
            elements.resultBar.className = 'h-4 rounded-full bg-red-500';
            elements.resultTitle.textContent = "Continue Praticando!";
            elements.resultMessage.textContent = "Você está no caminho certo! Revise as regras e tente novamente.";
        } else if (percentage < 80) {
            elements.resultBar.className = 'h-4 rounded-full bg-yellow-500';
            elements.resultTitle.textContent = "Bom Trabalho!";
            elements.resultMessage.textContent = "Você está indo bem! Com mais prática, você vai dominar completamente os sinais.";
        } else {
            elements.resultBar.className = 'h-4 rounded-full bg-green-500';
            elements.resultTitle.textContent = "Excelente!";
            elements.resultMessage.textContent = "Você demonstrou um ótimo entendimento das regras de sinais!";
        }

        elements.resultsPanel.classList.remove('hidden');
        elements.resultsPanel.classList.add('animate__fadeIn');
        elements.resultsPanel.scrollIntoView({ behavior: 'smooth' });
    },

    handleAnswerInput(index, value) {
        state.userAnswers[index] = value.trim();
        const answeredCount = state.userAnswers.filter(answer => answer !== '').length;
        this.updateProgress(answeredCount);

        if (answeredCount === config.totalExercises) {
            setTimeout(() => this.showResults(), 500);
        }
    }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => app.init());