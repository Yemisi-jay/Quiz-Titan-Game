const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('game-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const resultElement = document.getElementById('result');
const playAgainButton = document.getElementById('play-again-btn');

let shuffledQuestions, currentQuestionIndex;
let score = 0;
const totalQuestions = 10;

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
playAgainButton.addEventListener('click', playAgain);


function startGame() {
    startButton.classList.add('hidden');
    questionContainerElement.classList.remove('hidden');
    fetchQuestions();
}

async function fetchQuestions() {
    // Set difficulty to "easy"
    const res = await fetch('https://opentdb.com/api.php?amount=10&type=multiple&difficulty=easy');
    const data = await res.json();
    shuffledQuestions = data.results;
    currentQuestionIndex = 0;
    score = 0;
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < totalQuestions) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        endGame();
    }
}

function showQuestion(question) {
    questionElement.innerText = decodeHtml(question.question);
    const answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = decodeHtml(answer);
        button.classList.add('btn');
        // Pass the correct answer to the event listener
        button.addEventListener('click', () => selectAnswer(button, question.correct_answer));
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add('hidden');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(button, correctAnswer) {
    const selectedAnswer = button.innerText;
    const feedback = document.createElement('div');
    feedback.classList.add('feedback');

    // Check if the answer is correct and display appropriate feedback
    if (selectedAnswer === decodeHtml(correctAnswer)) {
        score++;
        feedback.innerText = `Correct! The answer is: ${decodeHtml(correctAnswer)}`;
    } else {
        feedback.innerText = `Wrong answer. The correct answer is: ${decodeHtml(correctAnswer)}`;
    }
    answerButtonsElement.appendChild(feedback);

    // Disable all buttons after an answer is selected
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
        if (button.innerText === decodeHtml(correctAnswer)) {
            button.classList.add('correct');
        } else {
            button.classList.add('wrong');
        }
    });

    if (currentQuestionIndex < totalQuestions - 1) {
        nextButton.classList.remove('hidden');
    } else {
        endGame();
    }
}

function endGame() {
    questionContainerElement.classList.add('hidden');
    resultElement.classList.remove('hidden');
    playAgainButton.classList.remove('hidden');
    let message = `Your score is ${score}/${totalQuestions}. `;
    if (score === totalQuestions) {
        message += "You're Awesome!";
    } else if (score >= 5) {
        message += "Good but you can do better!";
    } else {
        message += "Try your luck again, score too low!";
    }
    resultElement.innerText = message;
}

function playAgain() {
    resultElement.classList.add('hidden');
    playAgainButton.classList.add('hidden');
    startButton.classList.remove('hidden');
}

function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}
