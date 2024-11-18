const playPauseButton = document.getElementById('play-pause-button');
const refreshButton = document.getElementById('refresh-button');

const controlIcon = document.getElementById('play-icon');

const breakMinus = document.getElementById('break-minus');
const breakPlus = document.getElementById('break-plus');

const sessionMinus = document.getElementById('session-minus');
const sessionPlus = document.getElementById('session-plus');

const timer = document.getElementById('timer-clock');
const timerType = document.getElementById('timer-type');

const breakLength = document.getElementById('break-length');
const sessionLength = document.getElementById('session-length');

let breakValue;
let sessionValue;
let playing;
let isPaused;
let seconds = 60;
let minutes;

let minutesContext;
let breakMinutesContext;

let intervalID;

var alertSound = new Audio("media/alert.mp3");

const init = () => {
    playing = false;
    breakValue = 5;
    sessionValue = 25;
    minutesContext = sessionValue - 1;
    breakMinutesContext = breakValue;
    breakLength.innerText = breakValue;
    sessionLength.innerText = sessionValue;
}

const startTimer = () => {
    timerType.innerText = 'Session';
    minutes = minutesContext;

    intervalID = setInterval(() => {
        if(!playing) {
            clearInterval(intervalID);
        }
        seconds--;
        timer.innerText = `${minutes < 10 ? `0${minutes}` : `${minutes}`}:${seconds === 60 ? '00' : `${seconds < 10 ? `0${seconds}` : `${seconds}`}`}`;

        if(seconds === 60) {
            seconds--;
            minutes--;
        }
        if(minutes === 0 && seconds === 0) {
            clearInterval(intervalID);
            breakMinutesContext = breakValue;
            alertSound.play();
            startBreakTimer();
        }
        if(seconds===0) {
            seconds = 60;
            timer.innerText = `${minutes < 10 ? `0${minutes}` : `${minutes}`}:00`;
            minutes--;
        }
    }, 1000);
}

const startBreakTimer = () => {
    timerType.innerText = 'Break';
    minutes = breakMinutesContext;

    intervalID = setInterval(() => {
        if(!playing) {
            clearInterval(intervalID);
        }
        seconds--;
        timer.innerText = `${minutes < 10 ? `0${minutes}` : `${minutes}`}:${seconds === 60 ? '00' : `${seconds < 10 ? `0${seconds}` : `${seconds}`}`}`;

        if(seconds === 60) {
            seconds--;
            minutes--;
        }
        if(minutes === 0 && seconds === 0) {
            clearInterval(intervalID);
            minutesContext = sessionValue;
            alertSound.play();
            startTimer();
        }
        if(seconds===0) {
            seconds = 60;
            timer.innerText = `${minutes < 10 ? `0${minutes}` : `${minutes}`}:00`;
            minutes--;
        }
    }, 1000);
}

const pauseTimer = () => {
    if(timerType.innerText === 'Break') {
        breakMinutesContext = minutes;
    }
    else if(timerType.innerText === 'Session') {
        minutesContext = minutes;
    }
    playing = false;
    isPaused = true;
    controlIcon.src = './media/images/play-button-arrowhead.png';
    controlIcon.id='play-icon';
    clearInterval(intervalID);
    timer.innerText = `${minutes < 10 ? `0${minutes}` : `${minutes}`}:${seconds === 60 ? '00' : `${seconds < 10 ? `0${seconds}` : `${seconds}`}`}`;
}

const refreshTimer = () => {
    clearInterval(intervalID);
    minutesContext = sessionValue - 1;
    seconds = 60;
    if(timerType.innerText === 'Break') {
        timerType.innerText = 'Session';
    }
    if(controlIcon.id === 'pause-icon') {
        playing = false;
        controlIcon.src = './media/images/play-button-arrowhead.png';
        controlIcon.id='play-icon';
    }
    timer.innerText = `${sessionValue}:00`;
}

playPauseButton.addEventListener('click', () => {
    if(controlIcon.id === 'play-icon') {
        playing = true;
        if(!isPaused) {
            isPaused = false;
        }
        controlIcon.src = './media/images/pause.png';
        controlIcon.id='pause-icon';

        if(timerType.innerText === 'Break') {
            startBreakTimer();
        }
        else if(timerType.innerText === 'Session') {
            startTimer();
        }
    }
    else if(controlIcon.id === 'pause-icon') {
        pauseTimer();
    }
});

refreshButton.addEventListener('click', () => {
    refreshTimer();
});

// Break and Session Controls

breakMinus.addEventListener('click', () => {
    if(!playing) {
        if(breakValue > 5)
        {
            breakValue -= 5;
            breakLength.innerText = breakValue;
        }
        if(breakValue === 5) {
            breakMinus.classList.add('hide');
        }

        if(breakValue < sessionValue-5) {
            breakPlus.classList.remove('hide');
            if(sessionValue > 15) {
                sessionMinus.classList.remove('hide');
            }
        }
        seconds = 60;
        refreshTimer();
    }
});

breakPlus.addEventListener('click', () => {
    if(!playing) {
        if(breakValue < sessionValue-5)
        {
            breakValue += 5;
            breakLength.innerText = breakValue;
        }

        if(breakValue === sessionValue-5) {
            breakPlus.classList.add('hide');
            sessionMinus.classList.add('hide');
        }

        if(breakMinus.classList.contains('hide')) {
            breakMinus.classList.remove('hide');
        }
        seconds = 60;
        refreshTimer();
    }
});

sessionMinus.addEventListener('click', () => {
    if(!playing) {
        if(breakValue < sessionValue && sessionValue > 15)
        {
            sessionValue -= 5;
            sessionLength.innerText = sessionValue;
        }

        if(breakValue === sessionValue-5) {
            breakPlus.classList.add('hide');
            sessionMinus.classList.add('hide');
        }

        if(sessionValue === 15) {
            sessionMinus.classList.add('hide');
        }
        seconds = 60;
        refreshTimer();
    }
});

sessionPlus.addEventListener('click', () => {
    if(!playing) {
        if(breakValue < sessionValue)
        {
            sessionValue += 5;
            sessionLength.innerText = sessionValue;
        }
        
        if(breakValue < sessionValue-5) {
            breakPlus.classList.remove('hide');
            sessionMinus.classList.remove('hide');
        }
        seconds = 60;
        refreshTimer();
    }
});

init();
