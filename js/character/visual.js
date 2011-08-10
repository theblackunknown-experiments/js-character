// ECMAScript 5 strict mode, function mode.
'use strict';

/*=========================================================================
 CONSTANTS
 =========================================================================*/
const canvasID = 'canvas',
    canvasContext = '2d',
    imagesPath = 'images/',
    characterParts = [
        'hair',
        'head',
        'torso',
        'left-arm',
        'left-arm-jump',
        'right-arm',
        'right-arm-jump',
        'legs',
        'legs-jump'
    ];

/*=========================================================================
 IMAGES
 =========================================================================*/
var images = {};

//load all images
characterParts.forEach(function(item) {
    loadImage(item);
});

//Loader function, and hook to <img> tag
function loadImage(name) {
    images[name] = new Image();
    images[name].onload = resourceLoaded;
    images[name].src = imagesPath + name + '.png';
}

//Watcher for resources loading completion, and launch sprite animation runner
const totalResources = characterParts.length;
var numResourceLoaded = 0;
var fps = 45;

function resourceLoaded() {
    numResourceLoaded += 1;
    if (numResourceLoaded === totalResources) {
        setInterval(redraw, 1000 / fps);
    }
}
/*=========================================================================
 SOUNDS
 =========================================================================*/
var sounds = {};
sounds['jump'] = new buzz.sound("sounds/smb_jump-super.wav");
/*=========================================================================
 CANVAS MANIPULATION
 =========================================================================*/

//Canvas manipulation
const
    canvas = document
        .getElementById(canvasID),
    context = canvas
        .getContext(canvasContext);
//Character drawing - layer paradigm
const
    drawOrder = [
        drawShadow,
        drawLeftArm,
        drawLegs,
        drawTorso,
        drawRightArm,
        drawHead,
        drawHair,
        drawEyes
    ];
/*=========================================================================
 BREATHE
 =========================================================================*/
const
    BREATH_INCREMENTATION = 0.1,
    BREATH_MAXIMUM = 2,
    BREATH_IN = 1,
    BREATH_OUT = -1,
    BREATH_FPS = 1000 / fps;
/*=========================================================================
 BLINK
 =========================================================================*/
const
    EYE_HEIGHT = 14,          //eye wide open's height
    BLINK_REFRESH_TIME = 200, //time in milliseconds between successive blink refresh's status
    BLINK_DELAY = 4000;       //time in milliseconds between successive blinks
/*=========================================================================
 JUMP
 =========================================================================*/
const
    JUMP_HEIGHT = 45;
/*=========================================================================
 CHARACTER STATE
 =========================================================================*/
var
    character = {
        position : {
            x : 245,
            y : 185
        },
        breath : {
            direction : BREATH_IN,
            amount : 0,
            timer : setInterval(updateBreath, BREATH_FPS)
        },
        blink : {
            eyesHeight : EYE_HEIGHT,
            openTime : 0,
            timer : setInterval(updateBlink, BLINK_REFRESH_TIME)
        },
        jump : {
            active : false
        }
    };

//Breathe handler
function updateBreath() {
    var breathe = character.breath;
    switch (breathe.direction) {
        case BREATH_IN:
            breathe.amount -= BREATH_INCREMENTATION;
            if (breathe.amount < -BREATH_MAXIMUM) {
                breathe.direction = BREATH_OUT;
            }
            break;
        case BREATH_OUT:
            breathe.amount += BREATH_INCREMENTATION;
            if (breathe.amount > BREATH_MAXIMUM) {
                breathe.direction = BREATH_IN;
            }
            break;
    }
}

//Blink handler
function updateBlink() {
    var blinker = character.blink;
    blinker.openTime += BLINK_REFRESH_TIME;
    if (blinker.openTime >= BLINK_DELAY) {
        blink();
    }
}

const EYE_CLOSED = 0;
function blink() {
    var blinker = character.blink;
    blinker.eyesHeight -= 1;
    switch (blinker.eyesHeight) {
        case EYE_CLOSED:
            blinker.openTime = 0;
            blinker.eyesHeight = EYE_HEIGHT;
            break;
        default:
            setTimeout(blink, 10);
    }
}

//Jump handler
function jump() {
    if (!character.jump.active) {
        character.jump.active = true;
        sounds['jump'].play();
        setTimeout(land, 500);
    }
}

function land() {
    character.jump.active = false;
}

//Draw handler
function redraw() {
    //clears the canvas
    canvas.width = canvas.width;

    //Draw character
    for (var i = 0; i < drawOrder.length; i++) {
        drawOrder[i].call(this, character);
    }
}

/**
 * Draw the character's shadow
 */
function drawShadow(character) {
    if (character.jump.active) {
        drawEllipse(
            character.position.x + 40,
            character.position.y + 29,
            100 - character.breath.amount,
            4);
    } else {
        drawEllipse(
            character.position.x + 40,
            character.position.y + 29,
            160 - character.breath.amount,
            6);
    }
}

function drawLegs(character) {
    if (character.jump.active) {
        context.drawImage(
            images['legs-jump'],
            character.position.x,
            character.position.y - 6 - JUMP_HEIGHT
        );
    } else {
        context.drawImage(
            images['legs'],
            character.position.x,
            character.position.y
        );
    }
}

function drawTorso(character) {
    if (character.jump.active) {
        context.drawImage(
            images['torso'],
            character.position.x,
            character.position.y - 50 - JUMP_HEIGHT);
    } else {
        context.drawImage(
            images['torso'],
            character.position.x,
            character.position.y - 50);
    }
}

function drawLeftArm(character) {
    if (character.jump.active) {
        context.drawImage(
            images['left-arm-jump'],
            character.position.x + 40,
            character.position.y - 42 - character.breath.amount - JUMP_HEIGHT);
    } else {
        context.drawImage(
            images['left-arm'],
            character.position.x + 40,
            character.position.y - 42 - character.breath.amount);
    }
}

function drawRightArm(character) {
    if (character.jump.active) {
        context.drawImage(
            images['right-arm-jump'],
            character.position.x - 35,
            character.position.y - 42 - character.breath.amount - JUMP_HEIGHT);
    } else {
        context.drawImage(
            images['right-arm'],
            character.position.x - 15,
            character.position.y - 42 - character.breath.amount);
    }
}

function drawHead(character) {
    if (character.jump.active) {
        context.drawImage(
            images['head'],
            character.position.x - 10,
            character.position.y - 125 - character.breath.amount - JUMP_HEIGHT
        );
    } else {
        context.drawImage(
            images['head'],
            character.position.x - 10,
            character.position.y - 125 - character.breath.amount
        );
    }
}

function drawHair(character) {
    if (character.jump.active) {
        context.drawImage(
            images['hair'],
            character.position.x - 37,
            character.position.y - 138 - character.breath.amount - JUMP_HEIGHT
        );
    } else {
        context.drawImage(
            images['hair'],
            character.position.x - 37,
            character.position.y - 138 - character.breath.amount
        );
    }
}

function drawEyes(character) {
    if (character.jump.active) {
        drawEllipse(
            character.position.x + 47,
            character.position.y - 68 - character.breath.amount - JUMP_HEIGHT,
            8, character.blink.eyesHeight);
        drawEllipse(
            character.position.x + 58,
            character.position.y - 68 - character.breath.amount - JUMP_HEIGHT,
            8, character.blink.eyesHeight);
    } else {
        drawEllipse(
            character.position.x + 47,
            character.position.y - 68 - character.breath.amount,
            8, character.blink.eyesHeight);
        drawEllipse(
            character.position.x + 58,
            character.position.y - 68 - character.breath.amount,
            8, character.blink.eyesHeight);
    }
}

/**
 * Utility function to draw an ellipse on a canvas
 * Credit to : http://www.williammalone.com/briefs/how-to-draw-ellipse-html5-canvas/
 * @param centerX - ellipse abscissa center
 * @param centerY - ellipse ordinate center
 * @param width - ellipse width
 * @param height - ellipse height
 */
function drawEllipse(centerX, centerY, width, height) {
    //start a shape
    context.beginPath();
    //Set cursor a ellipse top center
    context.moveTo(centerX, centerY - height / 2);
    //right part
    context.bezierCurveTo(
        centerX + width / 2, centerY - height / 2,
        centerX + width / 2, centerY + height / 2,
        centerX, centerY + height / 2);
    //left part
    context.bezierCurveTo(
        centerX - width / 2, centerY + height / 2,
        centerX - width / 2, centerY - height / 2,
        centerX, centerY - height / 2);
    //Shape finition
    //Filling color
    context.fillStyle = "black";
    //Fill action
    context.fill();
    //End a shape
    context.closePath();
}
