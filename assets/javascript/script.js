var countdown = 10;
var timerEl = document.getElementById('timer');

function Countdown() {
    countdown--;
}

setInterval(Countdown, 1000);