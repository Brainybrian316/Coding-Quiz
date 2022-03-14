//  ! variables to grab elements by their ID
var main = document.getElementsByTagName('main')[0]
var viewHighscoreLink = document.getElementById('view_highscore_link')
var timeDisplay = document.getElementById('time_display')
var startQuizbutton = document.getElementById('start_quiz_button')
var questionNumbersBox = document.getElementById('question_numbers_box')
var questionDisplay = document.getElementById('question_display')
var answersList = document.getElementById('answer_list')
var answerFeedback = dcoument.getElementById('feedback')
var scoreDisplay = document.getElementById('score_display')
var initialsInput = document.getElementById('initials_input')
var submitInitialsButton = document.getElementById('submit_initials_button')
var highscoreList = document.getElementById('highscore_list')
var goToStartingPageButton = document.getElementById('go_to_starting_page_button')
var clearHighscoresButton = document.getElementById('clear_highscores_button')

// !  Questions array   
//  TODO: add more questions
const questions = {
    'question': 'String values must be enclosed within _____ when assigned to variables.',
    // holds the answer choices in an array
    'answers': ['commas', 'curly brackets', 'quotes', 'parenthesis'],
    //  selects the correct answer based on position
    'correct_index': 2
}

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

//  !  funtion to set up the quiz 
function initialize() {
    //  event listener for start button
    startQuizbutton.addEventListener('click', event => {
        event.preventDefault()
        displayQuestionsPage()
    })
    // event listener for answers list
    answersList.addEventListener('click', function (event) {
        event.preventDefault()
        // * goes through the buttons to display correct or wrong
        if (event.target.matches('button')) {
            var button = event.target
            if (button.classList.contains('correct')) {
                answerFeedback.textContent = "Correct!"
                questionNumbersBox.children[nextQuestionIndex - 1].classList.add('correct')
                score++
            } else {
                answerFeedback.textContent = "Wrong!"
                questionNumbersBox.children[nextQuestionIndex - 1].classList.add('wrong')
                remainingTime -= timePenalty
            }
            //  statment  to continue or end quiz
            if (remainingTime > 0) displayNextQuestion()
            else displayGetNamePage()
        }
    })
    //  event for putting in initials
    submitInitialsButton.addEventListener('click', event => {
        event.preventDefault()
        let initials = initialsInput.value.toUpperCase()
        if (initials) {
            let highscores = JSON.parse(localStorage.getItem('highscores')) || []
            // * object for high score
            timestamp = Date.now()
            highscores.push({
                'timestamp': timestamp,
                'score': score,
                'initials': initials,
                'timeRemaining': remainingTime
            })
            // * returns high score in order
            highscores = highscores.sort((a, b) => {
                if (a.score != b.score) return b.score - a.score
                if (a.timeRemaining != b.timeRemaining) return b.timeRemaining - a.timeRemaining
                if (a.timestamp != b.timestamp) return a.timestamp - b.timestamp
                return 0
            })

            localStorage.setItem('highscores', JSON.stringify(highscores))

            displayHighscorePage()
            initialsInput.value = ""
        }
    })
    // event for starting page
    goToStartingPageButton.addEventListeener('click', event => {
        event.preventDefault()
        displayStartingPage()
    })
    // event to clear high score
    clearHighscoresButton.addEventListener('click', event => {
        var confirmed = confirm("Do  you want to clear highscores?")
        if (confirmed) {
            event.preventDefault()
            localStorage.setItem('highscores', "[]")
            displayHighscorePage()
        }
    })
    //  event to view high score
    viewHighscoreLink.addEventListener('click', event => {
        event.preventDefault()
        displayHighscorePage()
    })
    // display the starting page
    displayStartingPage()
}