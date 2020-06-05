let $letter, $number, LB, $container, $btnDecrement, $btnColor, $btnEdit, $btnIncrement, $colorPicker;
let prevLetter, prevNumber;
const colors = [
    "red",
    "green",
    "blue",
    "yellow"
];


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
});

function setElements() {
    $letter = $('#letter');
    $number = $('#number');
    $container = $('.text-container');
    $btnDecrement = $('#btn-derement');
    $btnColor = $('#btn-color');
    $btnEdit = $('#btn-edit');
    $btnIncrement = $('#btn-increment');

}

function initPopover() {
    $btnColor.popover({
        html: true,
        template: '<div id="color-picker" class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
        content: '<div class="swatch red mb-1" data-color="red"></div><div class="swatch green mb-1" data-color="green"></div><div class="swatch yellow mb-1" data-color="yellow"></div><div class="swatch blue" data-color="blue"></div>',
        placement: "Top"
    });

    $btnColor.on('shown.bs.popover', function () {
        console.log("Hello!");
        $swatches = $('.swatch');
        for (let i = 0; i < $swatches.length; i++) {
            $($swatches[i]).on('click', function($this) {
                setColor($($swatches[i]).data('color'));
            });
        }
    });
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

    $number.click(function(e) {
        e.stopPropagation();
        prevNumber = $number.text();
    });

    $letter.click(function(e) {
       e.stopPropagation();
       prevLetter = $letter.text();
    });

    $('body').on('click', function (e) {
        let $target = $(e.target);
        if ($target.data('toggle') !== 'popover'
            && $target.parents('.popover').length === 0) {
            $btnColor.popover('hide');
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
    $('.bg').attr( "class", "bg " + color);
    console.log(color);
    $btnColor.popover('hide');
    //LB.num = 1;
    displayNumber(LB.num);
}

function keyListener() {
    $('body').bind('keyup', function(e) {
        if (e.which == 32){//space bar
            increment();
            $btnColor.popover('hide');
        } else if (e.which == 27) {
            if ("activeElement" in document)
                document.activeElement.blur();
            $btnColor.popover('hide');
        } else if (e.which == 13) {
            if ("activeElement" in document)
                document.activeElement.blur();
        } else if (e.which == 37) {
            decrement();
            $btnColor.popover('hide');
        } else if (e.which == 39) {
            increment();
            $btnColor.popover('hide');
        }
    });
}

function increment() {
    LB.addNum();
    displayNumber(LB.num);
}

function decrement() {
    LB.subtractNum();
    displayNumber(LB.num);
}