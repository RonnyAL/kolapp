let $letter, $number, LB, $container, $btnDecrement, $btnColor, $btnEdit, $btnIncrement, $colorPicker;
let prevLetter, prevNumber;
let $btnFullScreen, $btnExitFullScreen, $btnFontSize;
let $btnToggleNightMode;

// Get config from localStorage
let fontSize = getFromLs('fontSize') || 15;
let nMode = getFromLs('nMode') || false;
console.log("nMode is " + nMode);
let color = getFromLs('color') || 'red';
let letter = getFromLs('letter') || 'A';
let number = getFromLs('number') || 1;

function applyConfig() {
    setFontSize(fontSize);
    setNightMode(nMode);
    setColor(color);
    LB.let = letter;
    LB.num = number;
    $letter.text(LB.let);
    $number.text(LB.num);
    displayNumber(LB.num);
    displayLetter(LB.let);
}

$(document).ready(function() {
    LB = new LoddBok();
    setElements();
    initPopover();
    initTicket();
    keyListener();
    initClickHandlers();
    initInputHandlers();
    $colorPicker = $('#color-picker')
    $('[data-toggle="popover"]').popover();
    applyConfig();

    window.onresize = function () {
        if (isFullscreen()) {
            $btnFullScreen.addClass('d-none');
            $btnExitFullScreen.removeClass('d-none');
        } else {
            $btnFullScreen.removeClass('d-none');
            $btnExitFullScreen.addClass('d-none');
        }
    };

});

function isFullscreen() {
    let maxHeight = window.screen.height,
        curHeight = window.innerHeight;
    return (maxHeight === curHeight);
}

function setElements() {
    $letter = $('#letter');
    $number = $('#number');
    $container = $('.text-container');
    $btnDecrement = $('#btn-derement');
    $btnColor = $('#btn-color');
    $btnEdit = $('#btn-edit');
    $btnIncrement = $('#btn-increment');
    $btnFullScreen = $('#btn-fullscreen');
    $btnExitFullScreen = $('#btn-exit-fullscreen');
    $btnFontSize = $('#btn-fontsize');
    $btnToggleNightMode = $('#btn-toggle-nightmode');
}

function initPopover() {
    $btnColor.popover({
        html: true,
        template: '<div id="color-picker" class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
        content: '<div class="swatch red mb-1" data-color="red"></div><div class="swatch green mb-1" data-color="green"></div><div class="swatch yellow mb-1" data-color="yellow"></div><div class="swatch blue" data-color="blue"></div>',
        placement: "Top"
    });

    $btnColor.on('shown.bs.popover', function () {
        $swatches = $('.swatch');
        for (let i = 0; i < $swatches.length; i++) {
            $($swatches[i]).on('click', function($this) {
                setColor($($swatches[i]).data('color'));
            });
        }
    });

    $btnFontSize.popover({
        html: true,
        template: '<div id="font-size" class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body align-items-center justify-content-center d-flex"></div></div>',
        content: '<input id="slider-font-size" type="range" min="16" max="56" step="2">',
        placement: "Bottom"
    });

    $btnFontSize.on('shown.bs.popover', function () {
        let $slider = $('#slider-font-size');
        $slider.val(fontSize);
        $slider.on('input', function() {
            fontSize = $slider.val();
            saveToLs('fontSize', fontSize);
            setFontSize(fontSize);
        });
    });
}

function setFontSize(size) {

    $number.css({
        fontSize: size + "em"
    });
    $letter.css({
        fontSize: size + "em"
    });

    let paddingX = parseInt(840 - size * 15);

    $('#mainContent').css({
        paddingLeft: paddingX,
        paddingRight: paddingX
    });
}

function setNightMode(nMode) {
    console.log("Now nmode is " + nMode);
    if (nMode === 'true') {
        setTimeout(function(){
            $('#background').addClass('night');
        }, 100);
    } else {
        setTimeout(function(){
            $('#background').removeClass('night');
        }, 100);
    }
}

function initClickHandlers() {
    $btnIncrement.click(function(e) {
        increment();
        e.stopPropagation();
    });
    $btnDecrement.click(function(e) {
        decrement();
        e.stopPropagation();
    });

    $btnColor.click(function(e) {
       $btnColor.popover('show');
       e.stopPropagation();
    });

    $btnFontSize.click(function(e) {
        $btnFontSize.popover('show');
        e.stopPropagation();
    });

    $btnToggleNightMode.click(function(e) {
        e.stopPropagation();
        $('#background').toggleClass('night');
        nMode = $('#background').hasClass('night');
        console.log("Saving nMode = " + nMode);
        saveToLs('nMode', nMode);
    });

    $number.click(function(e) {
        e.stopPropagation();
        hidePopovers();
        prevNumber = $number.text();
    });

    $letter.click(function(e) {
        e.stopPropagation();
        hidePopovers();
        prevLetter = $letter.text();
    });

    $letter.dblclick(function(e) {
        e.stopPropagation();
        hidePopovers();
        $letter.attr('placeholder', 'A');
        $letter.blur();
    });

    $number.dblclick(function(e) {
        e.stopPropagation();
        hidePopovers();
        $number.attr('placeholder', '01');
        $number.blur();
    });

    $btnFullScreen.click(function() {
        $('body')[0].requestFullscreen();
    });

    $btnExitFullScreen.click(function() {
        document.exitFullscreen();
    });

    $('body').on('click', function (e) {
        let $target = $(e.target);
        if ($target.data('toggle') !== 'popover'
            && $target.parents('.popover').length === 0) {
            hidePopovers();
        }
    });
}

function initInputHandlers() {
    $letter.on('paste', function(e) {e.preventDefault()});
    $number.on('paste', function(e) {e.preventDefault()});

    $letter.on('keypress', function(e) {
        let letter = String.fromCharCode(e.which);
        let re = /^[A-ZÆØÅa-zæøå]?$/;
        if (!(re.test(letter))) {
            e.preventDefault();
        }
    });

    $letter.on('input', function() {
        let text = $letter.text().toUpperCase();
        $letter.text(text);
        $letter.attr('placeholder', text);
        $letter.text('');
    });

    $letter.on('focus', function() {
        $letter.attr('placeholder', $letter.text());
        $letter.text('');
    });

    $letter.on('blur', function() {
        $letter.text($letter.attr('placeholder'));
        LB.let = $letter.text();
        saveToLs('letter', LB.let);
        displayLetter(LB.let);
    });


    $number.on('focus', function() {
        $number.attr('placeholder', $number.text());
        $number.data('initial', true);
        $number.text('');
    });

    $number.on('keypress', function(e) {
        if (isNaN(parseInt(String.fromCharCode(e.which)))) e.preventDefault();
    });

    $number.on('input', function() {
        let input = $number.text();
        let placeholder = $number.attr('placeholder');

        let newNum;
        if ($number.data('initial') === true) {
            newNum = input;
        } else if (placeholder.length > 1) {
            if (placeholder.substr(0, 1) === "0") {
                newNum = placeholder.substr(1, 1) + input;
            } else {
                newNum = input;
            }
        } else {
            newNum = placeholder + input;
        }
        if (newNum.length === 1) newNum = "0" + newNum;
        $number.attr('placeholder', newNum);
        $number.text('');
        $number.data('initial', false);
    });

    $number.on('blur', function() {
        $number.text($number.attr('placeholder'));
        LB.num = $number.text();
        saveToLs('number', LB.num);
        displayNumber(LB.num);
    })
}

function initTicket() {
    displayLetter(LB.let);
    displayNumber(LB.num);
}

function displayNumber(num) {
    $number.text(num);
}

function displayLetter(letter) {
    $letter.text(letter);
    console.log("Letter: " + letter);
}

function setColor(color) {
    $('#background').attr("class", "bg " + color + ((nMode === 'true' || nMode === true) ? ' night' : ''));
    saveToLs('color', color);
    hidePopovers();
}

function keyListener() {
    $('body').bind('keyup', function(e) {
        if (e.which == 32){//space bar
            increment();
            hidePopovers();
        } else if (e.which == 27) {
            if ("activeElement" in document)
                document.activeElement.blur();
            hidePopovers();
        } else if (e.which == 13) {
            if ("activeElement" in document)
                document.activeElement.blur();
        } else if (e.which == 37) {
            decrement();
            hidePopovers();
        } else if (e.which == 39) {
            increment();
            hidePopovers();
        }
    });
}

function increment() {
    LB.addNum();
    displayNumber(LB.num);
    saveToLs('number', LB.num);
}

function decrement() {
    LB.subtractNum();
    displayNumber(LB.num);
    saveToLs('number', LB.num);
}

function hidePopovers() {
    $btnColor.popover('hide');
    $btnFontSize.popover('hide');
}

function saveToLs(key, value) {
    localStorage.setItem(key, value);
}

function getFromLs(key) {
    return localStorage.getItem(key);
}