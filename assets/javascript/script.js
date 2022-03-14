//  ! variables to grab elements by their ID
var main = document.getElementsByTagName('main')[0]
var viewHighscoreLink = document.getElementById('view_highscore_link')
var timeDisplay = document.getElementById('time_display')
var startQuizButton = document.getElementById('start_quiz_button')
var questionNumbersBox = document.getElementById('question_numbers_box')
var questionDisplay = document.getElementById('question_display')
var answersList = document.getElementById('answer_list')
var answerFeedback = document.getElementById('feedback')
var scoreDisplay = document.getElementById('score_display')
var initialsInput = document.getElementById('initials_input')
var submitInitialsButton = document.getElementById('submit_initials_button')
var highscoreList = document.getElementById('highscore_list')
var goToStartingPageButton = document.getElementById('go_to_starting_page_button')
var clearHighscoresButton = document.getElementById('clear_highscores_button')

// !  Questions array   

const questions = [{
        'question': 'String values must be enclosed within _____ when assigned to variables.',
        // holds the answer choices in an array
        'answers': ['commas', 'curly brackets', 'quotes', 'parenthesis'],
        //  selects the correct answer based on position
        'correct_index': 2
    },
    {
        'question': 'Commonly used data types DO NOT include:',
        'answers': ['alerts', 'numbers', 'strings', 'booleans'],
        'correct_index': 0
    },
    {
        'question': 'The condition in an if/else statement is enclosed within _____',
        'answers': ['quotes', 'curly brackets', 'square brackets', 'parenthesis'],
        'correct_index': 3
    },
    {
        'question': 'Which tag is used to identify the keywards describing the site?',
        'answers': ['text', 'http-equiv', 'content', 'name'],
        'correct_index': 2
    },
    {
        'question': 'What tag element will display a line across the screen?',
        'answers': ['br', 'a', 'hr', 'line'],
        'correct_index': 2
    }
]


// ! timer variables to track the score 
//  This variable holds the amount of time
const startingTime = questions.length * 8
//  This variable deducts the time for incorrect answers
const timePenalty = 10
//  This variable shows the remaining time
var remainingTime
//  This variable shows the interval timer
var timer
//  This variable shows the  number of questions correct
var score

//  !  funtion to initialize the quiz
function initialize() {
    //  event listener for start button
    startQuizButton.addEventListener('click', event => {
        // when the button is clicked this keeps it from going back to last page
        event.preventDefault()
        //  calls the question page
        displayQuestionPage()
    })
    // *event listener for answers list
    answersList.addEventListener('click', event => {
        // when the button is clicked this keeps it from going back to last page
        event.preventDefault()
        // If/else statements to display correct or wrong choices
        if (event.target.matches('button')) {
            var button = event.target
            if (button.classList.contains('correct')) {
                //  questionbox on top displays correct or wrong choices
                answerFeedback.textContent = "Correct!"
                questionNumbersBox.children[nextQuestionIndex - 1].classList.add('correct')
                score++
            } else {
                //  questionbox on top displays correct or wrong choices
                answerFeedback.textContent = "Wrong!"
                questionNumbersBox.children[nextQuestionIndex - 1].classList.add('wrong')
                //  subtracts time
                remainingTime -= timePenalty
            }
            //  if/else to continue or end quiz based on time remaining
            if (remainingTime > 0) displayNextQuestion()
            else displayGetNamePage()
        }
    })
    //  ! results event for user to submit initials
    submitInitialsButton.addEventListener('click', event => {
        // when the button is clicked this keeps it from going back to last page
        event.preventDefault()
        //  sets initials to upperecase
        let initials = initialsInput.value.toUpperCase()
        if (initials) {
            // stores initial in local storage
            let highscores = JSON.parse(localStorage.getItem('highscores')) || []
            // * prevents user from tampering with timer
            timestamp = Date.now()
            //  pushes the scores into the highscore page
            highscores.push({
                'timestamp': timestamp,
                'score': score,
                'initials': initials,
                'timeRemaining': remainingTime
            })
            // * sorts the high score
            highscores = highscores.sort((a, b) => {
                if (a.score != b.score) return b.score - a.score
                if (a.timeRemaining != b.timeRemaining) return b.timeRemaining - a.timeRemaining
                if (a.timestamp != b.timestamp) return a.timestamp - b.timestamp
                return 0
            })
            //  saves the scores into local storage and turns intergers into strings
            localStorage.setItem('highscores', JSON.stringify(highscores))
            //  displays the highscore page
            displayHighscorePage()
            //  inputs the users initials 
            initialsInput.value = ""
        }
    })
    // ! event that allows user to go back to starting page after viewing results
    goToStartingPageButton.addEventListener('click', event => {
        event.preventDefault()
        displayStartingPage()
    })
    // ! event that clears user local scores if clicked
    clearHighscoresButton.addEventListener('click', event => {
        // confirms the removal of previous scores
        var confirmed = confirm("Do you want to clear highscores?")
        if (confirmed) {
            event.preventDefault()
            localStorage.setItem('highscores', "[]")
            displayHighscorePage()
        }
    })
    //  ! event that allows the user to view the highscore page
    viewHighscoreLink.addEventListener('click', event => {
        event.preventDefault()
        displayHighscorePage()
    })
    // display the starting page
    displayStartingPage()
}

// ! hides all of the pages except the one with the given id so user can navigate to other sections
function displayPage(id) {
    main.querySelectorAll('.page').forEach(page => {
        if (page.id == id) {
            page.classList.remove('hidden')
        } else {
            page.classList.add('hidden')
        }
    })
    return 4
}

// ! displays the starting page.
function displayStartingPage() {
    displayPage('starting_page')
    //  clears the timer and resets it
    clearInterval(timer)
    remainingTime = 0
    // sets the timer back to 0
    timeDisplay.textContent - formatSeconds(remainingTime)
}

//  ! questions page 
//  The variable that displays the current question
var nextQuestionIndex
//  The variable that randomizes the question array
var randomizedQuestions
//  The function to display the question page
function displayQuestionPage() {
    displayPage('question_page')
    // question number box
    questionNumbersBox.innerHTML = ""

    // loop for questions
    for (let i = 0; i < questions.length; i++) {
        const element = questions[i];
        var el = document.createElement('span')
        el.textContent = i + 1
        questionNumbersBox.appendChild(el)
    }
    //  creates random questions for the quiz
    randomizedQuestions = randomizeArray(questions)
    //  resets values to defaults
    nextQuestionIndex = 0
    score = 0

    // start timer
    startTimer()
    //  first question
    displayNextQuestion()
}

// ! following questions randomizer function
function displayNextQuestion() {
    if (nextQuestionIndex < questions.length) {
        // * get questions and answers from variables
        const question = randomizedQuestions[nextQuestionIndex].question
        const answers = randomizedQuestions[nextQuestionIndex].answers
        const randomizedAnswers = randomizeArray(answers)
        const correctAnswer = answers[randomizedQuestions[nextQuestionIndex].correct_index]
        // displaying questions and answers
        questionDisplay.textContent = question
        answersList.innerHTML = ""
        answerFeedback.textContent = ""

        // loop for random answers
        for (let i = 0; i < randomizedAnswers.length; i++) {
            let answer = randomizedAnswers[i]
            let button = document.createElement("button")
            button.classList.add('answer')
            if (answer == correctAnswer)
                button.classList.add('correct')
            button.textContent = `${i +1}. ${answer}`
            answersList.appendChild(button)
        }
        // next question or stops quiz depending on timer or questions remaining
        nextQuestionIndex++
    } else {
        clearInterval(timer)
        displayGetNamePage()
    }
}
// ! displays get name page
function displayGetNamePage() {
    displayPage('get_name_page')
    // resets time to 0
    if (remainingTime < 0) remainingTime = 0
    timeDisplay.textContent = formatSeconds(remainingTime)
    scoreDisplay.textContent = score
}

// ! display highscore page
function displayHighscorePage() {
    displayPage('highscore_page')
    //  displays inside highscore page
    questionNumbersBox.innerHTML = ""
    highscoreList.innerHTML = ""

    clearInterval(timer)

    let highscores = JSON.parse(localStorage.getItem('highscores'))
    // varaibles to call and save highscores
    let i = 0
    for (const key in highscores) {
        i++
        let highscore = highscores[key]
        var el = document.createElement('div')
        let initials = highscore.initials.padEnd(3, ' ')
        let playerScore = highscore.score.toString().padStart(3, ' ')
        let timeRemaining = formatSeconds(highscore.timeRemaining)
        el.textContent = `${i}. ${initials} - Score: ${playerScore} - Time: ${timeRemaining}`
        highscoreList.appendChild(el)
    }
}

// ! takes any array and returns a random clone
//  clones the questions and answers to randomize it
function randomizeArray(array) {
    clone = [...array]
    output = []

    while (clone.length > 0) {
        let r = Math.floor(Math.random() * clone.length);
        let i = clone.splice(r, 1)[0]
        output.push(i)
    }
    return output
}

// ! start countdown timeer
function startTimer() {
    remainingTime = startingTime
    timeDisplay.textContent = formatSeconds(remainingTime)
    timer = setInterval(function () {
        remainingTime--

        if (remainingTime < 0) {
            clearInterval(timer)
            displayGetNamePage()
        } else {
            timeDisplay.textContent = formatSeconds(remainingTime)
        }
    }, 1000)
}

// ! converts timer to have a  M:SS format 
function formatSeconds(seconds) {
    let m = Math.floor(seconds / 60).toString().padStart(2, ' ')
    let s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

initialize()