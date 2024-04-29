// nya.js ~ javascript neko
// by tyler / dippio
// v0.1
//
// TODO: actually finish the script - contains core functionality, but not much more
//       need to implement animations, very boring atm.
//       maybe implement bounding box around the neko to make her easier to click
//       make her draggable?





// DEFINITIONS

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

let mouseX = 0;
let mouseY = 0;

var isNekoActive = 1;
var isNekoClicked = 0;

let lastMoveTime = 0;
let frameCount = 0;
let frameCounter = 0;

// variables for movement and positioning
// adjust these to taste
// movement stuff
let nekoSpeed = 16; // got this value from neko98 source, seems to work nicely
let tick = 250; // all movements occur every 250ms(?)
let maxDist = 32; // max distance before the cat starts trying to chase the cursor again
                  // seems to be easier for the neko to exit then to enter the max distance

// set spawn positions
let nekoXPos = windowWidth / 2; // middle of screen for testing purposes
let nekoYPos = windowHeight / 2;


// neko sprites
// idle / misc
const awake = "data:image/png;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///w/wAP8P//8AAAAAAAAAD/8P/w//D/8AAAAAAAAAD///D/8P/w///wAAAAAAAA//8A//D/8A//8AAAAAAAAA/wD//w//8A/wAAAAAAAAAAAA//////DwAAAAAAAAAAAAAP/////w/wAAAAAAAAAAAAAP////AA/wAAAAAAAAAAAAAP//8AAA/wAAAAAAAAAAAAAP/wAAAA8AAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAA//////AAAAAAAAAAAAAAD///////AAAAAAAAAAAAAPAA/w/wAPAAAAAAAAAAAAD////////wAAAAAAAAAAAA//D///D/8AAAAAAAAAAAAP/w///w//AAAAAAAAAAAAD/8P//8P/wAAAAAAAAAAAA////////8AAAAAAAAAAAAP//8AD///AAAAAAAAAAAAAP//AA//8AAAAAAAAAAAAAD/8AAA//AAAAAAAAAAAAAAD/AAAP8AAAAAAAAAAAAAAA8AAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////////////////4AIAP+AAAD/wAAB/8AAAf/AAAH/4AAD//IAB//+AAf//wBD//+A4f//wfH//wB7//4AP//8AB//+AAP//gAD//4AA/w+AAOH/gAD//4AA//mAAJ/nwIHnn8HB+f9hw//+4+N//ff3v/v//9///////////w=="
// directional
const up1 = "data:image/png;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAA//////8AAAAAAAAAAAAA/////////wAAAAAAAAAAD//////////wAAAAAAAAAA//////////8AAAAAAAAAAP//////////AAAAAAAAAAD//////////wAAAAAAAAAP///////////wAAAAAAAADw/////////w8AAAAAAAAA/w////////D/AAAAAAAAAP8P///////w/wAAAAAAAAAP8P//////D/AAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAA//////8AAAAAAAAAAAAAAAD///AAAAAAAAAAAAAAAA//D/8P//AAAAAAAAAAAAD/////////AAAAAAAAAAAAAAD///8AAAAAAAAAAAAAAP////////8AAAAAAAAAAAAP/w//8P/wAAAAAAAAAAAAD/8P//D/8AAAAAAAAAAAAAD/D//w/wAAAAAAAAAAAAAAD/////AAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////////////+f////D////w////8P////D///+AH//+AAf//AAD//gAAf/4AAH/+AAB//gAAf/wAAD/8AAA//AAAP/wAAD/8AAA//gAAf/+AAf//gAH//4AB//8AAP//AAD//wAA//+AAf//gAH//4AB///gB///gAH///w//w=="
const up2 = "data:image/png;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAAAA/wAAAAAAAAAAAP/wAAAAD/8AAAAAAAAAAAD//wAAAP//AAAAAAAAAAAA///wAA///wAAAAAAAAAAD///8AAP///wAAAAAAAAAA//////////8AAAAAAAAAAP///w/w////AAAAAAAAAAD///8P8P///wAAAAAAAAAA////D/D///8AAAAAAAAAAP///w/w////AAAAAAAAAAD///8P8P///wAAAAAAAAAAD///D/D///AAAAAAAAAAAAD///AP//8AAAAAAAAAAAAPAP////8A8AAAAAAAAAAAD/////////AAAAAAAAAAAP//////////AAAAAAAAAAD/8AD//wAP/wAAAAAAAAAA/w//////8P8AAAAAAAAAAPAAD///AAAPAAAAAAAAAA/w//D/8P//D/AAAAAAAAAPD/////////DwAAAAAAAADwAAD///8AAA8AAAAAAAAA8P////////8PAAAAAAAAAP8P/w//8P/w/wAAAAAAAAD/D/8P//D/8P8AAAAAAAAA/wD/D//w/wD/AAAAAAAAAPAPD/////DwDwAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////+f+f//D/D//wfg//8DwP//AYD//gAAf/4AAH/+AAB//gAAf/4AAH/+AAB//gAAf/8AAP//AAD//wAA//8AAP/+AAB//gAAf/4AAH/+AAB//AAAP/wAAD/8AAA//AAAP/wAAD/8AAA//AAAP/wAAD/+AAB///w//w=="
const upRight1 = "data:image/png;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAD/AAAAAA///wAAAAAAAAAA/wAA/w//8ADwAAAAAAAAAA/wAA8P//8A/wAAAAAAAAAA/w/wD///8A8AAAAAAAAAAP////////8A/wAAAAAAAAAP////////8P8AAAAAAAAAD/////////D/8AAAAAAAAP/////////wD/AAAAAAAAD/////////8P/wAAAAAAAA////////8A//8AAAAAAAAP////////////8AAAAAAAAP////////////AAAAAAAAAP///////////wAAAAAAAAD///////////8AAAAAAAAAD///////////8AAAAAAAAAD////////////wAAAAAAAAAA///w//////8AAAAAAAAAAAAAD///////8AAAAAAAAAAAAP////////AAAAAAAAAAAAD//w/////wAAAAAAAAAAAA//8P//D/8AAAAAAAAAAAAP//D/8P/wAAAAAAAAAAAAD//w/w8AAAAAAAAAAAAAAA//AAD//wAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////wP/5/gD/8MAA//BAAP/4AAD/+AAAf/wAAD/8AAA//AAAH/wAAB/8AAAf/AAAD/wAAA/+AAAP/wAAD/8AAA//gAAD/8AAAf/gAAH//AAA//+AAP//gAD//4AAf/+AAJ//gAH//4AD//+AB///j//w=="
const upRight2 = "data:image/png;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAA8AAAAP8AAAAAAAAAAAAAAP8AAAD/8AAAAAAAAAAAAAD/AAAA/////wAAAAAAAAAA//AAAP/////wAAAAAAAAAP//AAD/////8AAAAAAAAAAP///w//////8AAAAAAAAAD////w//////AAAAAAAAAA/////w/////wAAAAAAAAAP//////////8AAAAAAAAAAA/w////////8AAAAAAAAAAA8P8P//////8AAAAAAAAAAA/w////////8AAAAAAAAAAP8P////////8AAAAAAAAA/w///////////wAAAAAAAP8A////Dw8P///wAAAAAAAAAA//8P///////wAAAAAAAAAA/w/////wAP/wAAAAAAAAAA8P//////AP/wAAAAAAAAAA//D////wAA/wAAAAAAAAAP/w/////wAAAAAAAAAAAA//8P/w//8AAAAAAAAAAAAP//DwAP//AAAAAAAAAAAA///wD////wAAAAAAAAAAAAAA////AA8AAAAAAAAAAAAAAADwD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/n////w////8P//8/D///Hw///w8Af/8PAD//BwAf/wAAH/+AAA//gAAP/4AAD/+AAA//wAAH//AAA//wAAH/+AAAf/AAAD/wAAAP8YAAB//AAAP/4AAB//AAAf/wACH/4AA//+AAJ//AAB//wAA///4Af///AP///////////w=="
const right1 = "data:image/png;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAADwAAAP8AAAAAAAAAAAAPAP8P//8A8AAAAAAAAAAAD/D/AA///wAAAAAAAAAAAAAP8P/w////AP//8AAAAAAAD/AADw////////8AAAAAAP///wDw////////8AAAAAD/////D/8P8AD//wAAAAAP/////w//8AD/8P8ADwAA///////w//////D/AA/wAA//////8P/////w/wAA/wAA//////D///////AAAP/wAP////8P//////8AAAAP/wD/////D//w////AAAAAP8P////8P///wAP/wAAAAAP//////////8AAA/wAAAAAP/////////wAAAA8AAAAAAP////////8AAAAAAAAAAAAP///////wAAAAAAAAAAAAD///////AAAAAAAAAAAAAAAP////AAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////////////////////////////nH///xw///MAH//wAA//8AAEH/gAAA/4AAAH+AAAA/gAAADwAAAEYAAABDAAAAYYAAAOCAAAHwAAAB+AAAAfwAAGD+AAD4/wAA/P+AAf//gAP//8AH///wH////H//////////////////w=="
const right2 = "data:image/png;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wD/8AAADwAAAAAAAAAADwD//wAADwDwAAAAAAAAAPD///AAAA/wAA/wAP////AP//AAAAAP///wAP////////8AAAAAAP////8A///////wAAAAAAAP/////w//////8AAAAAAAD//////////////wAAAAAAD////////////////wAAAA/////////////////wAAAP///////////wAA//8AAAD///////8A////////AAAA///////wAP////8P8AAAAA/////wAAAP////D/AAAAAP//8AAAAAAP///w/wAAAAD/8AAAAAAAD/////AAAAAP/wAAAAAAAAAP//AAAAAA//AAAAAAAAAAAP/wAAAAD/8AAAAAAAAAAAAP8AAAAP8AAAAAAAAAAAAAAPAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////////////zHz//4Awf/wAcAYAAPAAAAHwAAAD8AAAB/wAAAf8AAAAfgAAAD4AAAAeAAAAHgAAAB4ACAA/ABwAPwB8AD8D/gB+D/8A/B//wfg//+Hwf//x8P//+fH///3////////////////w=="
const downRight1 = "data:image/png;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAA/wAAAAAAAAAAAAAA//AAAP8AAAAAAAAAAAAAAP/wAA//AAAAAAAAAAAAAA//8AAA8AAAAAAAAAAAAAD/8AAP/wAAAAAAAAAAAAAP8A////DwAAAAAAAAAAAA/w///////wAAAAAAAAAAD/D///8P/w8AAAAAAAAAAA////D/D/8PAAAAAAAAAAD//wAP/w//DwAAAAAAAAAA//////////8AAAAAAAAAD///D///////AAAAAAAAAP///w///////wAAAAAAAP////8P////8P8AAAAAAA//////8A////D/8AAAAAD////////w//8A//AAAAAP/////////w/wAADwAAAAD/////////8A8AAAAAAAAA//////////AAAAAAAAAAAP////////8AAAAAAAAAAAD///AA/w/wAAAAAAAAAAAA//AA/w/wAAAAAAAAAAAAD/8AAA/w/wAAAAAAAAAA///wAAAP/w/wAAAAAAAAAAAAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////////////8ef//+HD///Bw///wYP//4AH//8AB//+AAP//AAD//gAA//4AAH/8AAC//AAA//gAAP/gAAD/wAAA/4AAAH8AAAB+AAAIfgAAHn4AAJ/+AAH//gAD//4AB//wHAf/4DAD//BgB///8B//////////////////w=="
const downRight2 = "data:image/png;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAP8P8AAP8AAAAAAAAAAAAA/wD//w//8AAAAAAAAAAAAP8PD//w///wAAAAAAAAAA//Dw//8AAAAAAAAAAAAAAP8P/w/w////APAAAAAAAA//D/8P////////AAAAAAD///D////////w/wAAAAAA///w//////////8AAAAAAP//8P/wAA/w//D/AAAAAAD///8P/w//8P/w/wAAAAAA////D/8P//D/8P8AAAAAAP///w//D//////wAAAAAA////8P/w//////8AAAAAAP////D//w//////AAAAAAD///8P///w//AP/wAAAAAA///w/////w/wAP8AAAAAAP////////8A8AAPAAAAAAAP////////8AAAAAAAAAAAAP///////wAAAAAAAAAAAAAA//////AAAAAAAAAAAAAAAAD///8AAAAAAAAAAAAP////8AAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//////////////////////+P////Ac///wAH//4AAf/+AAD//AAAv/wAAB/4AAAP8AAAD/AAAA/wAAAD8AAAD/AAAA/wAAAf4AAAH+AAAB/gAAAf4AACH+AAAx/gAAOf8AAf//gAP//gAH//wAD//+AP///8f/////////////w=="
const down1 = "data:image/png;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAP/////wAAAAAAAAAAAA/w///w///w/wAAAAAAAAAPD/8P//8P/w8AAAAAAAAPAA//D///D/8ADwAAAAAAD/AP/w///w//AP8AAAAAAAAPD////////w8AAAAAAAAA/w////////8P8AAAAAAAAP8P////////D/AAAAAAAAD/D///AA///w/wAAAAAAAA//D//w8P//D/8AAAAAAAAP/w//D/8P/w//AAAAAAAAD//w/w//D/D//wAAAAAAAAD/8PD///Dw//AAAAAAAAAA//8P////D//wAAAAAAAAAP//////////AAAAAAAAAAAP////////8AAAAAAAAAAAAP///////wAAAAAAAAAAAAAP//////AAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////////////////////////////8H///wAH//wAAf/4AAD/4AAAP+AAAD/gAAA/8AAAf+AAAD/wAAB/8AAAf/AAAH/wAAB/8AAAf/gAAP/4AAD/+AAB//wAA//+AAf//wAP//+AH///8P////D////w////8P////D////5//w=="
const down2 = "data:image/png;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AAAAADwAAAAAAAAAAAAAP8AAAAP8AAAAAAAAAAAAAD/AAAAD/AAAAAAAAAAAAAP//AAAP//AAAAAAAAAAAAD/AA//AA/wAAAAAAAAAAAA8P/////w8AAAAAAAAAAAAA///w///wAAAAAAAAAAAAD/8P//8P/wAAAAAAAAAAAA//D///D/8AAAAAAAAAAAAP/w///w//AAAAAAAAAAAAD////////wAAAAAAAAAAAA////////8AAAAAAAAAAAAP////////AAAAAAAAAAAAD///AA///wAAAAAAAAAAAPD//w8P//DwAAAAAAAAAADw//D/8P/w8AAAAAAAAAAA/w/w//D/D/AAAAAAAAAAAP8PD///Dw/wAAAAAAAAAAAP8P////D/AAAAAAAAAAAAD////////wAAAAAAAAAAAP/////////wAAAAAAAAAAD/////////8AAAAAAAAAAA//////////AAAAAAAAAAAP/////////wAAAAAAAAAAD//wD/AP//8AAAAAAAAAAA//8A/wAP//AAAAAAAAAAAA/wAP8AAP8AAAAAAAAAAAAP8AD/AAD/AAAAAAAAAAAADwAA/wAADwAAAAAAAAAAAAAAAAAAAAAAAAAAD//////+fz///D4f//w+H//8Ph//+AAP//gAD//4AA//+AAP//gAD//wAAf/8AAH/+AAA/+QAAT/8AAH//AAB//wAAf/8AAH//AAB//wAAf/+AAP//gAD//wAAf/8AAH//AAB//wAAf/8AAH//ACB//4Qw//+EMP//hDD//855/w=="


// SETUP
// set up div for the neko to be contained within  
const nekoDiv = document.createElement("div");
nekoDiv.id = "nekoDiv";
nekoDiv.style.position = "absolute";
nekoDiv.style.left = nekoXPos;
nekoDiv.style.top = nekoYPos;

// injects the innitial neko sprite
const nekoSprite = document.createElement("img");
nekoSprite.src = awake;
nekoDiv.appendChild(nekoSprite);
document.body.appendChild(nekoDiv);


// get mouse positions and call for neko to move
document.addEventListener("mousemove", getCursorPos);
function getCursorPos(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  nekoMove();
}

// makes the neko movement togelable (so it isnt constantly following)
nekoDiv.addEventListener('click', function() {
  isNekoClicked = isNekoClicked ? 0 : 1;
});


// cool triangle math
function getDist(mouseX, mouseY) {
  let distX = nekoXPos - mouseX;
  let distY = nekoYPos - mouseY;
  return Math.sqrt(distX*distX + distY*distY); // should return total euclid dist assuming i dont suck at maths
}



// SPRITES / ANIMATION

// too many numbers
// hurting my head very much
// mogami river
function updateSprite(angle) {
  if (angle > -Math.PI / 8 && angle <= Math.PI / 8) { // alot of these need to be adjusted, i was just approximating
    nekoSprite.src = frameCounter % 2 == 0 ? right1 : right2; // straight right
    nekoSprite.style.transform = "scaleX(1)";
  } 
  else if (angle > Math.PI / 8 && angle <= 3 * Math.PI / 8) {
    nekoSprite.src = frameCounter % 2 == 0 ? downRight1 : downRight2; // downright
    nekoSprite.style.transform = "scaleX(1)";
  } 
  else if (angle > 3 * Math.PI / 8 && angle <= 5 * Math.PI / 8) {
    nekoSprite.src = frameCounter % 2 == 0 ? down1 : down2; // down
    nekoSprite.style.transform = "scaleX(1)";
  } 
  else if (angle > 5 * Math.PI / 8 && angle <= 7 * Math.PI / 8) {
    nekoSprite.src = frameCounter % 2 == 0 ? downRight1 : downRight2; // downleft
    nekoSprite.style.transform = "scaleX(-1)";
  } 
  else if (angle > 7 * Math.PI / 8 || angle <= -7 * Math.PI / 8) {
    nekoSprite.src = frameCounter % 2 == 0 ? right1 : right2; // straight left
    nekoSprite.style.transform = "scaleX(-1)";
  } 
  else if (angle > -7 * Math.PI / 8 && angle <= -5 * Math.PI / 8) {
    nekoSprite.src = frameCounter % 2 == 0 ? upRight1 : upRight2; // upleft
    nekoSprite.style.transform = "scaleX(-1)";
  } 
  else if (angle > -5 * Math.PI / 8 && angle <= -3 * Math.PI / 8) {
    nekoSprite.src = frameCounter % 2 == 0 ? up1 : up2; // up
    nekoSprite.style.transform = "scaleX(1)";
  }
  else if (angle > -3 * Math.PI / 8 && angle <= -Math.PI / 8) {
    nekoSprite.src = frameCounter % 2 == 0 ? upRight1 : upRight2; // upright
    nekoSprite.style.transform = "scaleX(1)";
  }
  else {
    // probably shouldn't happen, default to natural
    nekoSprite.src = awake;
    nekoSprite.style.transform = "scaleX(1)";
  }
}

// idle animations
// TODO: actually implement the idle animations
function idle() {
  nekoSprite.src = awake;
}



// MAIN MOVEMENT

function nekoMove() {
  let currentTime = Date.now();
  let passedTime = currentTime - lastMoveTime;

  if (passedTime >= tick) {
    let angle = getAngle();
    let update = getNewPos(angle);
    let dist = getDist(mouseX, mouseY);
    nekoActiveMisc(dist, update, angle);
  }

  requestAnimationFrame(nekoMove);
}


function getAngle() {
  return Math.atan2(mouseY - nekoYPos, mouseX - nekoXPos);
}

function getNewPos(angle) {
  let updateX = nekoXPos + Math.cos(angle) * nekoSpeed;
  let updateY = nekoYPos + Math.sin(angle) * nekoSpeed;
  return { updateX, updateY };
}

function nekoActiveMisc(dist, update, angle) {
  if (dist < maxDist) {
    isNekoActive = 0;
  } else {
    isNekoActive = 1;
  }

  if (isNekoActive == 1 && isNekoClicked == 0) {
    nekoXPos = update.updateX;
    nekoYPos = update.updateY;
    nekoDiv.style.left = nekoXPos + "px";
    nekoDiv.style.top = nekoYPos + "px";
    updateSprite(angle);
    lastMoveTime = Date.now();
    frameCounter++;
  } else {
    idle();
  }
}