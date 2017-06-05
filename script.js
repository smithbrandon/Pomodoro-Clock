var softReset = false;
var speedUp = false;
var increase = false;
var started = false;
var editWork = false;
var editBreak = false;
var justReset = false;
var timerId = 0;
var sessions = 0;
var brightness = 2;
var colorScheme = 'white';
var timers = [{
    id: "Work",
    timeSetInSec: 5,
    timeRunInSec: 5,
    sessionCnt: 0
}, {
    id: "break",
    timeSetInSec: 5,
    timeRunInSec: 5,
    sessionCnt: 0
}];
var timer;
var work = $('#work');
var breaks = $('#break');

function init() {
    started = false;
    timerId = 0;
    clearInterval(timer);
    convertSec(timers[0].timeSetInSec);
    timers[0].timeRunInSec = timers[0].timeSetInSec;
    timers[1].timeRunInSec = timers[1].timeSetInSec;
    $('#break').addClass('off');
    $('#breakDig').addClass('off');
    timers[0].sessionCnt = 0;
    timers[1].sessionCnt = 0;
    sessions = 0;
}

$('.btn').mousedown(function () {
    if ((editWork || editBreak) && !started) {
        var id = this.id;
        $('#' + id).addClass('pressed');
        adjustTime(id);
        speedUp = setTimeout(function () {
            var incQuo = 1;
            var amt = 1;
            increase = setInterval(function () {
                if (incQuo % 10 === 0 && incQuo <= 100) {
                    amt += 60;
                }
                adjustTime(id, amt);
                incQuo++;
            }, 200);
        }, 500);
    }
}).mouseup(function () {
    if ((editWork || editBreak) && !started) {
        clearTimeout(speedUp);
        clearInterval(increase);
        var id = this.id;
        $('#' + id).removeClass('pressed');
    }
})

function adjustTime(id, amt) {
    amt = amt || 1;
    if ((timers[sessions].timeSetInSec - amt < 1 && id !== 'inc') || (timers[sessions].timeSetInSec + amt > 362400 && id !== 'dec')) {
    } else {
        if (id === 'inc') {
            timers[sessions].timeRunInSec += amt;
        } else {
            timers[sessions].timeRunInSec -= amt;
        }
        timers[sessions].timeSetInSec = timers[sessions].timeRunInSec;
        convertSec(timers[sessions].timeSetInSec);
    }
}

function convertSec(val) {
    var hours = Math.floor(val / 3600);
    var min = Math.floor((val - (hours * 3600)) / 60);
    var sec = val - (min * 60) - (hours * 3600);
    if (sec.toString().length === 1) {
        sec = '0' + sec.toString();
    } else {
        sec = sec.toString();
    };
    $('#ss').text(sec[0]);
    $('#s').text(sec[1]);

    if (min.toString().length === 1) {
        min = '0' + min.toString();
    } else {
        min = min.toString();
    };
    $('#mm').text(min[0]);
    $('#m').text(min[1]);

    if (hours.toString().length === 1) {
        hours = '0' + hours.toString();
    } else {
        hours = hours.toString();
    };
    $('#hh').text(hours[0]);
    $('#h').text(hours[1]);

}

$("#startBtn").mousedown(function () {
    $('#startBtn').addClass('pressed');
    if (!started) {
        softReset = setTimeout(function () {
            clearInterval(timer);
            init();
            justReset = true;
        }, 2000);
    }
})

$("#startBtn").mouseup(function () {
    $('#startBtn').removeClass('pressed');
    if (started) {
        clearInterval(timer);
        started = false;
    } else {
        if (!justReset) {
            timerRun();
            started = true;
        }
        justReset = false;
        $('.workBreak').removeClass('clicked');
        editWork = editBreak = false;
        clearTimeout(softReset);
        highlightSesh(sessions);
    }
})

function updateSesh(session) {
    var formatted1, formatted2;
    if (timers[session].sessionCnt < 10) {
        formatted1 = '0';
        formatted2 = timers[session].sessionCnt;
    } else if (timers[session].sessionCnt > 99) {
        formatted1 = '0';
        formatted2 = '0';
    } else {

        formatted1 = (timers[session].sessionCnt).toString()[0];

        formatted2 = (timers[session].sessionCnt).toString()[1];
    }
    if (sessions === 0) {
        $('#w').text(formatted1);
        $('#ww').text(formatted2);
    } else {
        $('#b').text(formatted1);
        $('#bb').text(formatted2);
    }
}

function highlightSesh(session) {
    if (session === 1) {
        $('#work').addClass('off');
        $('#workDig').addClass('off');
        $('#break').removeClass('off');
        $('#breakDig').removeClass('off');
    } else {
        $('#work').removeClass('off');
        $('#break').addClass('off');
        $('#workDig').removeClass('off');
        $('#breakDig').addClass('off');
    }
}

function timerRun() {
    timer = setInterval(function () {
        if (timers[sessions].timeRunInSec === 0) {
            timers[sessions].timeRunInSec = timers[sessions].timeSetInSec;
            timers[sessions].sessionCnt++;
            updateSesh(sessions);
            sessions = (sessions === 0 ? 1 : 0);
            highlightSesh(sessions);
        }
        timers[sessions].timeRunInSec--;
        convertSec(timers[sessions].timeRunInSec);

    }, 1000)
}

$('.workBreak').click(function () {
    var id = this.id;
    if (started) {
        clearInterval(timer);
        started = false;
    }
    if (id === 'work') {
        sessions = 0;
        convertSec(timers[sessions].timeRunInSec);
        if (editBreak) {
            $('#break').toggleClass('clicked');
            editBreak = false;
        }
        editWork = !editWork;
    } else {
        sessions = 1;
        convertSec(timers[sessions].timeRunInSec);
        if (editWork) {
            $('#work').toggleClass('clicked');
            editWork = false;
        }
        editBreak = !editBreak;
    }
    highlightSesh(sessions);
    $('#' + id).toggleClass('clicked');
})

$('#bright').click(function () {
    if (brightness === 2) {
        brightness = 0;
    } else {
        brightness++;
    }
    switch (brightness) {
        case 0:
            $('.smallDig,.digit,.colon').addClass('bright0').removeClass('bright2');
            break;
        case 1:
            $('.smallDig,.digit,.colon').addClass('bright1').removeClass('bright0');
            break;
        case 2:
            $('.smallDig,.digit,.colon').addClass('bright2').removeClass('bright1');
            break;
    }
})

$('#color').click(function () {
    colorSchemePrev = colorScheme;
    if (colorScheme === 'white') {
        colorScheme = 'blue';
    } else if (colorScheme === 'blue') {
        colorScheme = 'green';
    } else if (colorScheme === 'green') {
        colorScheme = 'red';
    } else if (colorScheme === 'red') {
        colorScheme = 'white';
    }
    changeColor(colorScheme);
})

function changeColor(color) {
    $('.' + colorSchemePrev).addClass(colorScheme);
    $('.' + colorSchemePrev).removeClass(colorSchemePrev);
}

$(document).ready(function () {
    init();
})
