(() => {
    'use strict'
    let squareContainer = $('#aj-square-container');
    let windowsHeight = $(window).height();
    let windowsWidth = $(window).width();
    let rectangleHeight = 20;
    let rectangleWidth = 20;
    let margin = 10;

    var count = 0;
    var timer;

    let squareIsActive = false;
    let rectangleIsScheduled = false;
    let minTimeout = 500;
    let maxTimeout = 2000;
    let isFullScreen;
    let canvas;
    let context;
    let randomPositionVector;
    let timeoutSchedulerHandler;

    let drawnTimestamp = [];
    let reactionTimestamp = [];

    activate();

    function activate() {
        canvas = document.createElement('canvas');
        squareContainer.append(canvas);
        context = canvas.getContext('2d');
    }

    function rederRectangle() {
        console.log('Called render rectangle')
        context.beginPath();
        context.rect(randomPositionVector[0] * (windowsWidth - margin - rectangleWidth) + randomPositionVector[1] * margin, randomPositionVector[2] * (windowsHeight - margin - rectangleHeight) + randomPositionVector[3] * margin, rectangleHeight, rectangleWidth);
        context.fillStyle = 'transparent';
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = 'white';
        context.stroke();

        squareIsActive = true;

        drawnTimestamp.push(new Date());
    }

    function generateSquareAtRandomLocation() {
        getRandomPositionVector();
        rederRectangle();
    }

    function getRandomPositionVector() {
        var vector = [0, 0, 0, 0];
        Math.floor(Math.random() * 10) % 2 == 0 ? vector[0] = 1 : vector[1] = 1;
        Math.floor(Math.random() * 10) % 2 == 0 ? vector[2] = 1 : vector[3] = 1;
        randomPositionVector = vector;
    }

    function scheduleNextSquare() {
        rectangleIsScheduled = true;

        var timeout = Math.random() * (maxTimeout - minTimeout) + minTimeout;;

        timeoutSchedulerHandler = setTimeout(function () {
            rectangleIsScheduled = false;
            generateSquareAtRandomLocation();
        }, timeout);

    }

    function squareDetected() {
        reactionTimestamp.push(new Date());
        context.clearRect(0, 0, canvas.width, canvas.height);
        scheduleNextSquare();
    }
    $(window).keypress(function (event) {
        if (!rectangleIsScheduled && squareIsActive && (event.keyCode === 0 || event.keyCode === 32)) {
            event.preventDefault();
            squareDetected()
        }
    });

    function clickTap(event) {
        if (!rectangleIsScheduled && squareIsActive) {
            event.preventDefault();
            squareDetected()
        }
    }

    document.getElementById('aj-square-container').addEventListener("touchend", clickTap, false);

    $('#aj-square-container').click(clickTap);



    $(window).resize(function () {
        windowsHeight = $(window).height();
        windowsWidth = $(window).width();
        canvas.height = windowsHeight;
        canvas.width = windowsWidth;

        if (document.webkitFullscreenElement) {
            $(".aj-navbar-container").hide();
            $('[role*="dashboard"]').hide();
            // $(".aj-dashboard").hide();
            $('.aj-flex-container').css("display", 'flex');

            initializeCountdown();

        } else {
            $(".aj-navbar-container").show();
            $('[role*="dashboard"]').show();
            // $(".aj-dashboard").show();
            $('.aj-X').css("visibility", 'hidden');
            $('.aj-flex-container').css("display", 'none');
            clearTimeout(timeoutSchedulerHandler);
            clearInterval(timer);
            $('.aj-countdown').html('');
        }
    });

    function endCountdown() {
        $('.aj-countdown').html('');
        $('.aj-X').css("visibility", 'visible');
        scheduleNextSquare();
        // initializeCountdown();
    }

    function handleTimer() {
        if (count === 0) {
            clearInterval(timer);
            endCountdown();
        } else if (count == 4) {
            $('.aj-countdown').html('get ready...');
            count--;
        } else {
            $('.aj-countdown').html(count);
            count--;
        }
    }



    $(window).ready(function () {});

    $('#saveConfigurationBtn').click(function () {
        var squareSize = $('#configurationForm #squareSizeInput')[0].valueAsNumber;
        if (squareSize) {
            rectangleHeight = squareSize;
            rectangleWidth = squareSize;
        }
        var borderMargin = $('#configurationForm #borderMarginInput')[0].valueAsNumber;
        if (borderMargin)
            margin = borderMargin;;
    })

    $('#startBtn').click(function (event) {
        $('#startBtn').prop("disabled", true);
        $('#resultsBtn').prop("disabled", false);
        $('#resetBtn').prop("disabled", false);

        var docElm = document.getElementById('startBtn');
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    });

    function initializeCountdown() {
        count = 4;
        timer = setInterval(function () {
            handleTimer(count);
        }, 1000);
    }

    $('#resetBtn').click(function (event) {
        $('#startBtn').prop("disabled", false);
        $('#resultsBtn').prop("disabled", true);
        $('#resetBtn').prop("disabled", true);
        drawnTimestamp = [];
        reactionTimestamp = [];
    });

    $('#resultsBtn').click(function (event) {
        var items = [];
        let badgesContainer = $('#resultBadges');
        badgesContainer.empty();
        $.each(reactionTimestamp, function (i, item) {
            items.push('<span class="aj-16 aj-badge badge badge-info text-nowrap">' + (item.getTime() - drawnTimestamp[i].getTime()) + ' ms' + '</span>');
        });
        badgesContainer.append(items.join(''));
    })

    $(document).on("webkitfullscreenchange mozfullscreenchange msfullscreenchange fullscreenchange", function () {
        console.log("bang!");
    });



})();