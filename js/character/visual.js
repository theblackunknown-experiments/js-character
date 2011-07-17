
var images = {};

loadImage("left-arm");
loadImage("right-arm");
loadImage("torso");
loadImage("legs");
loadImage("head");
loadImage("hair");

function loadImage(name) {
    images[name] = new Image();
    images[name].onload = resourceLoaded;
    images[name].src = "images/" + name + ".png";
}

var totalResources = 6;
var numResourceLoaded = 0;
var fps = 30;

function resourceLoaded() {
    numResourceLoaded += 1;
    if( numResourceLoaded === totalResources) {
        setInterval(redraw, 1000 / fps);
    }
}

var context = document.getElementById("canvas").getContext("2d");

var charX = 245;
var charY = 185;

function redraw() {
    var x = charX;
    var y = charY;

    canvas.width = canvas.width;//clears the canvas

    //draw the shadow under
    drawEllipse(x + 40, y + 29, 160, 6);

    context.drawImage(images["left-arm"], x + 40, y - 42);
    context.drawImage(images["legs"], x, y);
    context.drawImage(images["torso"], x, y - 50);
    context.drawImage(images["right-arm"], x - 15, y - 42);
    context.drawImage(images["head"], x - 10, y - 125);
    context.drawImage(images["hair"], x - 37, y - 138);

    drawEllipse(x + 47, y - 68, 8, 14);
    drawEllipse(x + 58, y - 68, 8, 14);

}

function drawEllipse(centerX, centerY, width, height) {
  context.beginPath();
  context.moveTo(centerX, centerY - height/2);
  context.bezierCurveTo(
    centerX + width/2, centerY - height/2,
    centerX + width/2, centerY + height/2,
    centerX, centerY + height/2);
  context.bezierCurveTo(
    centerX - width/2, centerY + height/2,
    centerX - width/2, centerY - height/2,
    centerX, centerY - height/2);
  context.fillStyle = "black";
  context.fill();
  context.closePath();
}
