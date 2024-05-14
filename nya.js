// nya.js ~ javascript neko
// by tyler / dippio (github.com/dippio)
//
// this is my first js project so don't be too harsh qwq
//
// in terms of quality, this script kinda sucks. really bad. maybe i'll fix it one day





// DEFINITIONS

// per site definitions
// modify these to your hearts content
// they make neko more fun!

// movement stuff
let nekoSpeed = 16; // 16 pixels per tick i think
let tick = 250;     // all movements occur every 250ms(?) somewhere between 220 - 280 seems to be nice
let maxDist = 32;   // max distance before the cat starts trying to chase the cursor again

// set spawn positions
let nekoXPos = window.innerWidth / 2; // middle of screen
let nekoYPos = 0;


// defines whether neko is active by default
var isNekoClicked = 0;

// optional features, may(?) impact performance
// set 1 for true / enabled, 0 for false / disabled

let isFootprintEnabled = 0; // footprints behind neko that fade over time (very resource heavy, very intrusive, very broken. it's disabled by default for a reason)
let isSnoreEnabled = 1;  // silly little Zzz symbols to indicate sleep


// assign variables now to prevent issues later
// you probably don't wanna change these
let mouseX;
let mouseY;
let lastMouseX; 

var isNekoActive = 1;
var isNekoDrag = 0;
var isNekoIdle = 0;
let isMouseDown = 0;

let lastMoveTime = 0;
let lastFrameTime = 0;
let frameCount = 0;
let frameCounter = 0;

let currentTime = Date.now();
let passedTime = currentTime - lastMoveTime;




// neko sprites
// idle / misc

const idle = "data:image/gif;base64,R0lGODlhIAAgAPECAAAAAAAAAP///wAAACH5BAEAAAAAIf8LSW1hZ2VNYWdpY2sOZ2FtbWE9MC40NTQ1NDUALAAAAAAgACAAAAJ6hI+py+0Pozxh1amCuHTjpHlGyH2hCJzldHrtGrVbIMOPLOR6bjvqvtH1Gr+dyiQEHjE4IA9JI/FoKJZT+elcq9mokJa1CMNiIxnRHMa23Fil+QSvZ0YjCfIq0sc+ZZKH5UMFSBg0FSWHVnNY2LiCCAkWOal2Znl5VgAAOw=="
const awake = "data:image/gif;base64,R0lGODlhIAAgAPECAAAAAAAAAP///wAAACH5BAEAAAAAIf8LSW1hZ2VNYWdpY2sOZ2FtbWE9MC40NTQ1NDUALAAAAAAgACAAAAKPhI+py+1/AmTS1bgu0O0GwX0VZxkfGAmoRW7q6qpkoNHJKcd51G7jK6MBUbYJbjjsdV5HEJNCCzGTT1PUMgXilBSkl5sBCZ1i0eTm1Z4VTfWaPS4jwMtdis5OpmDnNtHel0aGZ6WDJEJ4EkcWBNjFtAXpVpfF2AQWVRkZxLU4OHapFDU66kNa+paqusraUAAAOw=="
const yawn = "data:image/gif;base64,R0lGODlhIAAgAPIEAAAAAAAAAIAAAP8AAP///wAAAAAAAAAAACH5BAEAAAAALAAAAAAgACAAAAOFCLrc/jDKSatd4eXrAtnYxzWeqJTgWJrAml6rGL9V/AU2PXl4jrOW2WdIKOokKKPLqPp9BAIXTlU0QnPUauBaZWY/g8FsFFJ2j0HnDc1xkSHYN8PmldO15OmdOa2ZtWcoFDNLf3VwXUSKcRE9gEaPaz00apBrlpFALZOcGZ2fbHKio6QACQA7"
const drag = "data:image/gif;base64,R0lGODlhIAAgAHAAACH5BAEAAAMALAAAAAAgACAAgQAAAP///xoaGgAAAAKRnI8wigvcYnwugQANlTyF/ygP1h3UtnzqCJbmYqry1bqTPNd2Q+Pzbun5dLbTEMfISCChnpOkLLEwoBUm6hJWq1gp9UgsrrRU1O7ZHANjw+aafexmwau3Jl5/k8tOPZ4lt/TXd0ZnRFIIdiGCOGeIGAhnGOlBp5Z4tcdVRMOUNtYoGGYxFtgpNtogsLqz6tpRAAA7"
const scratch1 = "data:image/gif;base64,R0lGODlhIAAgAPECAAAAAAAAAP///wAAACH5BAEAAAAAIf8LSW1hZ2VNYWdpY2sOZ2FtbWE9MC40NTQ1NDUALAAAAAAgACAAAAKAhI+py+0Po5wUhFBjEDe7LXCYp4AhRybm2U1Xa50yCjfmu84X+uSzvhl9fiwgr0f07Wo2XfIGyYF2IWq195JJpUOiVqSzZX2calhsZFmv2OxP6fKWtVEM2Uzvrld84aJfVMWH9IU3x/ZhdROIg1MiJTjldnbQaGlhmZmyydm5UAAAOw=="
const scratch2 = "data:image/gif;base64,R0lGODlhIAAgAPECAAAAAAAAAP///wAAACH5BAEAAAAAIf8LSW1hZ2VNYWdpY2sOZ2FtbWE9MC40NTQ1NDUALAAAAAAgACAAAAKAhI+py+0Po5w0hRqDuPhwpG0doH1GKGLhhwophXKta2YuPd/1k9/+K+n9aLChzrdz9AKzZCMHrTCZQ+pmOuUZrbif8zTd6LBLZZNrBDLIXVp1ci55IUxSWozUXpH8/BMZM+b314dnSGQW6LZIlmXRhLMS9gbSiEVi2Tiyydn5UAAAOw=="
const sleep1 = "data:image/gif;base64,R0lGODlhIAAgAPECAAAAAAAAAP///wAAACH5BAEAAAAAIf8LSW1hZ2VNYWdpY2sOZ2FtbWE9MC40NTQ1NDUALAAAAAAgACAAAAJshI+py+0Po5y02ouz3rz7DxpBCATCmKGHeaatKMRqxQa2HZ8zdOfnnzPtGDhgkBV8NZBIn1M2TDCfVJ2j2axCoyVntorjfoVf3U/8ZBaN5EU5Cz+7wWlzmAi+6aGypX7cA2Qj8XcjUkiSmFAAADs="
const sleep2 = "data:image/gif;base64,R0lGODlhIAAgAPECAAAAAAAAAP///wAAACH5BAEAAAAAIf8LSW1hZ2VNYWdpY2sOZ2FtbWE9MC40NTQ1NDUALAAAAAAgACAAAAJvhI+py+0Po5y02ouz3rz7DwJBEAYCmaHHeKYjYgotNbJ1LZ/qw555HJOZdoyg72cUzoq5Y/OJdBiT0GhjWq3WmE0qdLhMUIe9rpK4+naDbN3Cm4z70KLsWIen17U3HD4s1vflB6Sn0LclghjCuFAAADs="

// directional
// maybe convert all of them to a more efficient format

const up1 = "data:image/gif;base64,R0lGODlhIAAgAPECAAAAAAAAAP///wAAACH5BAEAAAAAIf8LSW1hZ2VNYWdpY2sOZ2FtbWE9MC40NTQ1NDUALAAAAAAgACAAAAJ3hI8YG+mf2BJUyAazCbVbrU1Wx1kYGFUltZ7o0ZLqq3j2TAOXfeX6fXO9YiySb8Pw9I4i4MJ3aZqWINEqyBI+SlcnC8UFyj7VkVimdXTPuDLbOHzDwfK2u56GrJ3MvSoPljQFCPV1FGJ4qJeoqMbYGEEIOUl5UAAAOw=="
const up2 = "data:image/gif;base64,R0lGODlhIAAgAPECAAAAAAAAAP///wAAACH5BAEAAAAAIf8LSW1hZ2VNYWdpY2sOZ2FtbWE9MC40NTQ1NDUALAAAAAAgACAAAAKLhI8YG+l/mBRUSAZTsHvX33VZRC0lWHrNCKiVd8br6Ma2yrbWx/MiG2L0LpZcp4fczTK1nc25ZHJMoElU6kzicroUbPridpND8ZhcMuuow5+YnfJdab5n8T203435bJj7JVMG2Be4B1Q4yIfmgycHl+b4FziHFWnwVQkBc8WptuUA+qbZQqp2ippTAAA7"
const upRight1 = "data:image/gif;base64,R0lGODlhIAAgAPECAAAAAAAAAP///wAAACH5BAEAAAAAIf8LSW1hZ2VNYWdpY2sOZ2FtbWE9MC40NTQ1NDUALAAAAAAgACAAAAJ+hI8Xm+2vhFi0wguCnHRP/GibqFlgIkrpGmTtmU4ee0ajN9c2zr9gFeOpMJ2ZcEQ8KoeQ4HLkczifnyQVF5Vee5fpNYv6xhjNrYxZ3i7QIW8P2XVj2SE1iUhSOdfkrp6PdWfFkAdVAtYgCBREAYPosgan0wQ0aXmJmam56VAAADs="
const upRight2 = "data:image/gif;base64,R0lGODlhIAAgAPECAAAAAAAAAP///wAAACH5BAEAAAAAIf8LSW1hZ2VNYWdpY2sOZ2FtbWE9MC40NTQ1NDUALAAAAAAgACAAAAKIhI+py+0PTZh0RjdFFjzcUwXcqGXeJ5IbWX5A2pWw9p7QDOOuNM5qbbn1WB1KR+hjrYKNVLKYs4GCOCKRiXAmRdyrNBuzimmY8Lj3VWye10hXcyZjnPHjgz1OL9h8txWvp3Z1FgiGttImZPeS5yfH+HfhZCiDdfcIWXiXNrlThumZ0BnKYOlSAAA7"
const right1 = "data:image/gif;base64,R0lGODlhIAAgAPECAAAAAAAAAP///wAAACH5BAEAAAAAIf8LSW1hZ2VNYWdpY2sOZ2FtbWE9MC40NTQ1NDUALAAAAAAgACAAAAKEhI+py+0PozyhTliFtldlDQpcBwThuZEligadybae68UsTYm1fRsf7tvEYKEKEbjaEE/LZSqXcoKkTASMRhXysM+s9hbVJW3eawlYLn5Ez11rqmwig0yTt7j4Gdm8duIHV1eVp7Wn5mI0UgOoJibBYZdopnKGM0l5RqGIydnp+QkaClAAADs="
const right2 = "data:image/gif;base64,R0lGODlhIAAgAPECAAAAAAAAAP///wAAACH5BAEAAAAAIf8LSW1hZ2VNYWdpY2sOZ2FtbWE9MC40NTQ1NDUALAAAAAAgACAAAAKAhI+py+0PYwpUtjCFwHbyE2hVZ4QfqG1kqCpsG70nIkNUus2oqO+4uHjxZrcfSyfEjQBJEZD2i2KaTlgpKqUaodjuUHjSer3hsVnJPXcpy+t63AZpi+Rek63Oub5DLF0PdcPGMVi4sSVnEiMI5rHCk9KzQhhHYnmJmam5ydkJUAAAOw=="
const downRight1 = "data:image/png;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAA/wAAAAAAAAAAAAAA//AAAP8AAAAAAAAAAAAAAP/wAA//AAAAAAAAAAAAAA//8AAA8AAAAAAAAAAAAAD/8AAP/wAAAAAAAAAAAAAP8A////DwAAAAAAAAAAAA/w///////wAAAAAAAAAAD/D///8P/w8AAAAAAAAAAA////D/D/8PAAAAAAAAAAD//wAP/w//DwAAAAAAAAAA//////////8AAAAAAAAAD///D///////AAAAAAAAAP///w///////wAAAAAAAP////8P////8P8AAAAAAA//////8A////D/8AAAAAD////////w//8A//AAAAAP/////////w/wAADwAAAAD/////////8A8AAAAAAAAA//////////AAAAAAAAAAAP////////8AAAAAAAAAAAD///AA/w/wAAAAAAAAAAAA//AA/w/wAAAAAAAAAAAAD/8AAA/w/wAAAAAAAAAA///wAAAP/w/wAAAAAAAAAAAAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////////////8ef//+HD///Bw///wYP//4AH//8AB//+AAP//AAD//gAA//4AAH/8AAC//AAA//gAAP/gAAD/wAAA/4AAAH8AAAB+AAAIfgAAHn4AAJ/+AAH//gAD//4AB//wHAf/4DAD//BgB///8B//////////////////w=="
const downRight2 = "data:image/png;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAP8P8AAP8AAAAAAAAAAAAA/wD//w//8AAAAAAAAAAAAP8PD//w///wAAAAAAAAAA//Dw//8AAAAAAAAAAAAAAP8P/w/w////APAAAAAAAA//D/8P////////AAAAAAD///D////////w/wAAAAAA///w//////////8AAAAAAP//8P/wAA/w//D/AAAAAAD///8P/w//8P/w/wAAAAAA////D/8P//D/8P8AAAAAAP///w//D//////wAAAAAA////8P/w//////8AAAAAAP////D//w//////AAAAAAD///8P///w//AP/wAAAAAA///w/////w/wAP8AAAAAAP////////8A8AAPAAAAAAAP////////8AAAAAAAAAAAAP///////wAAAAAAAAAAAAAA//////AAAAAAAAAAAAAAAAD///8AAAAAAAAAAAAP////8AAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//////////////////////+P////Ac///wAH//4AAf/+AAD//AAAv/wAAB/4AAAP8AAAD/AAAA/wAAAD8AAAD/AAAA/wAAAf4AAAH+AAAB/gAAAf4AACH+AAAx/gAAOf8AAf//gAP//gAH//wAD//+AP///8f/////////////w=="
const down1 = "data:image/gif;base64,R0lGODlhIAAgAPECAAAAAAAAAP///wAAACH5BAEAAAAAIf8LSW1hZ2VNYWdpY2sOZ2FtbWE9MC40NTQ1NDUALAAAAAAgACAAAAJ8hI8Zke1/ghAM2ifp3WpWzmUfeImktSxeenbTC49kBtfaSdu1jOr+vcnlXsIQkbJDeoIxz1G57DmnUBrPBUUKiSXqamiSDn1hjOjXpFwjkrGuvTaIrMlV1AGnp9VtSKpap7XQlVVYVvJHxoKTYtXY0tAYB0lZaXmJmdlSAAA7"
const down2 = "data:image/gif;base64,R0lGODlhIAAgAPECAAAAAAAAAP///wAAACH5BAEAAAAAIf8LSW1hZ2VNYWdpY2sOZ2FtbWE9MC40NTQ1NDUALAAAAAAgACAAAAKQhI8Rp7kIowmi0Trpk/wuPwkY14mfGY4kdJlgq66pS4uozNj6bm84zNv5ZMBgD5cz8oZEpY7ZrARByJRGKI1FPT3TDXn1iqXQEizsLUsUQvZTHXE7K/AMQO601BXFaQPcAhRY59D11EOYYLiYWHj4VpXTlxZpJcf3VXXGd1ZpxZIZSZXUCPrHoOGJulaqSlIAADs="

// misc

const ZZz = "data:image/gif;base64,R0lGODlhDwAIAHAAACH5BAEAAAEALAAAAAAPAAgAgQAAAAAAAAAAAAAAAAIUhA+hy5vd0oORQhlRmFYiU1kOUgAAOw=="
const footprintStraight = "data:image/gif;base64,R0lGODlhEgAQAHAAACH5BAEAAAEALAAAAAASABAAgQAAAAAAAAAAAAAAAAIojI8HyRoAX1NxwTUlwtncvl1cJ45kxJiZVZ3Wg06m2nygJ96wffNZAQA7"




// SETUP
// set up div for the neko to be contained within  

const nekoDiv = document.createElement("div");
nekoDiv.id = "nekoDiv";
nekoDiv.style.position = "fixed";
nekoDiv.style.zIndex = 2
nekoDiv.setAttribute("draggable", false); // stops transparent duplicate when dragging
nekoDiv.style.left = nekoXPos;
nekoDiv.style.top = nekoYPos;
nekoDiv.style.webkitTouchCallout = "none"; // stops blue outline when dragging.
nekoDiv.style.webkitUserSelect = "none";   // i think it applies these for the
nekoDiv.style.khtmlUserSelect = "none";    // entire site, which i don't really
nekoDiv.style.mozUserSelect = "none";      // like doing, but alas
nekoDiv.style.msUserSelect = "none";
nekoDiv.style.userSelect = "none";

// injects the innitial neko sprite
const nekoSprite = document.createElement("img");
nekoSprite.src = idle;
nekoSprite.setAttribute("draggable", false);
nekoDiv.appendChild(nekoSprite);
document.body.appendChild(nekoDiv);


// get mouse positions and call for neko to move
document.addEventListener("mousemove", getCursorPos);
function getCursorPos(event) {
  mouseX = event.clientX - 20; // was hoping this would make it go above the mouse
  mouseY = event.clientY - 20; // but it never actually lines up properly
  nekoMove();
}

// makes the neko movement togelable (so it isnt constantly following)
nekoDiv.addEventListener("click", function() {
  isNekoClicked = isNekoClicked ? 0 : 1;
});


// cool triangle math !!!
function getDist(mouseX, mouseY) {
  let distX = nekoXPos - mouseX;
  let distY = nekoYPos - mouseY;
  return Math.sqrt(distX*distX + distY*distY); // should return total euclid dist assuming i dont suck at maths
}

function getAngle() {
  return Math.atan2(mouseY - nekoYPos, mouseX - nekoXPos); // cool inverse triangle math !!!
}


// SPRITES / ANIMATION

// too many numbers
// hurting my head very much
// mogami river
function updateSprite(angle) {
  if (angle > -Math.PI / 8 && angle <= Math.PI / 8) {         // alot of these need to be adjusted, i was just guessing stuff until it worked
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
    // probably shouldn't happen
    nekoSprite.src = idle;
    nekoSprite.style.transform = "scaleX(1)";
  }
}

// idle animations

function idleAnimate() {
  let i = 0;          // animation frame counter
  isNekoIdle = 1;     // normally i'd use a decent variable name
                      // but i'm too used to using i for counting lol

  nekoSprite.src = idle;                              // injects an aditional frame, not sure why i added this in the first place
  let randInt = Math.floor((Math.random()) * 3);      // i know there was a reason though and now i'm too scared to remove it

  console.log(randInt)

  let animationFrames;
  let maxFrames;
  let snoreIntervalId;

  switch(randInt) {
    case 0: // yawn
      animationFrames = [yawn, yawn]; // breaks when theres < 2 or > 2 frames lol
      maxFrames = 3;
      break;

    case 1: // sleep
      animationFrames = [sleep1, sleep2];
      maxFrames = 100;
      
      let snoreTick = 0;
      snoreIntervalId = setInterval(function() {
        if (snoreTick % 10 === 0) {
          snore();
        }
        snoreTick++;
      }, tick);

      break;

    case 2: // scratch
      animationFrames = [scratch1, scratch2];
      maxFrames = 10;
      break;
  }

  var intervalId = setInterval(function() {
    if (i < maxFrames && isNekoActive == 0 && isNekoDrag == 0) {
      nekoSprite.src = i % 2 == 0 ? animationFrames[0] : animationFrames[1];
      lastFrameTime = Date.now();
      i++
    } else {
      clearInterval(intervalId);
      clearInterval(snoreIntervalId);
      isNekoIdle = 0
    }
  }, tick); // change frame
}

function snore() {
  if (isSnoreEnabled == 1) {
    let opacity = 1.15; // init opacity
    let snoreSprite = document.createElement("img"); // create new img element for snore
    snoreSprite.src = ZZz
    snoreSprite.style.position = "fixed";
    snoreSprite.style.opacity = opacity;

    nekoSprite.parentNode.appendChild(snoreSprite);

    let snoreInterval = setInterval(function() {
      if (opacity > 0) {
        opacity -= 0.20;
        snoreSprite.style.opacity = opacity;
      } else {
        clearInterval(snoreInterval);
        snoreSprite.parentNode.removeChild(snoreSprite);
        opacity = 1.15;
      }
    }, tick);
  }
}

function footprintPrint(angle) {
  if (isFootprintEnabled == 1 && isNekoActive == 1 && isNekoDrag == 0 && isNekoIdle == 0) {
    let opacity = 6;
    let footprintSprite = document.createElement("img");
    footprintSprite.style.position = "fixed";
    footprintSprite.style.opacity = opacity;
    footprintSprite.src = footprintStraight;
    footprintSprite.style.transform = "rotate(" + (angle * (180 / Math.PI) + 90) + "deg)";

    let rect = nekoSprite.getBoundingClientRect();

    footprintSprite.style.left = rect.left + 8 + "px";
    footprintSprite.style.top = rect.top + 8 + "px";

    let footprintDiv = document.getElementById("footprintDiv"); // i really don't like how i did this
    if (!footprintDiv) {                                        // but i really can't be bothered to 
      footprintDiv = document.createElement("div");             // redo the movement code just so the
      footprintDiv.id = "footprintDiv";                         // neko img and footprint img can be
      document.body.appendChild(footprintDiv);                  // in the same div
    }

    footprintDiv.appendChild(footprintSprite);


    let footprintInterval = setInterval(function() {
      if (opacity > 0) {
        if (isNekoClicked == 1 || isNekoActive == 0) {
          opacitySubtraction = 0.70;
        }
        else {
          opacitySubtraction = 0.25;
        }
        opacity -= opacitySubtraction;
        footprintSprite.style.opacity = opacity;
      } else {
        clearInterval(footprintInterval);
        footprintDiv.removeChild(footprintSprite);
        opacity = 6;
      }
    }, tick);
  }
}



// MAIN MOVEMENT

function nekoMove() {              // worst function name of all time (doesn't even handle movement !!!!)
  let currentTime = Date.now();    // TODO: rename functions (bc they all suck)
  let passedTime = currentTime - lastMoveTime;

  if (passedTime >= tick) {
    let angle = getAngle();
    let update = getNewPos(angle);
    let dist = getDist(mouseX, mouseY);
    nekoActiveMisc(dist, update, angle);
    footprintPrint(angle);
  }

  if (isNekoDrag == 0) { // stops issue with snapping back after dragging
    requestAnimationFrame(nekoMove);
  }
}


function getNewPos(angle) {
  let updateX = nekoXPos + Math.cos(angle) * nekoSpeed;
  let updateY = nekoYPos + Math.sin(angle) * nekoSpeed;
  return { updateX, updateY };
}

function nekoActiveMisc(dist, update, angle) {  // why is this the function that handles movement ??
  let currentTime = Date.now();                 
  let passedTime = currentTime - lastMoveTime;
  if (dist < maxDist || isNekoClicked ==  1) {
    isNekoActive = 0;
  }
  else {
    isNekoActive = 1;
  }

  if (isNekoActive == 1 && isNekoClicked == 0 && isNekoDrag == 0 && isNekoIdle == 0) {
    nekoXPos = update.updateX;
    nekoYPos = update.updateY;
    nekoDiv.style.left = nekoXPos + "px";
    nekoDiv.style.top = nekoYPos + "px";
    updateSprite(angle);
    lastMoveTime = Date.now();
    frameCounter++;
  }
  else if (isNekoActive == 1 && isNekoClicked == 0 && isNekoDrag == 0 && isNekoIdle == 1) {
    nekoSprite.src = awake; 
    isNekoIdle == 0;
  }
  else if (passedTime > (tick * 25) && isNekoDrag == 0 && isNekoIdle == 0) {
    lastMoveTime = currentTime;
    isNekoIdle = 1;
    idleAnimate();
  }
  else if (isNekoIdle == 0) {
    nekoSprite.src = idle
  }
}


// the only thing that sets this apart from the 50 other neko web implementations lol
function dragNeko(event) {
  if(isMouseDown) {
    let boundBox = nekoDiv.getBoundingClientRect();
    if(event.clientX > boundBox.left && event.clientX < boundBox.right && event.clientY > boundBox.top && event.clientY < boundBox.bottom) {
      isNekoDrag = 1;
    }
  }
  if(isNekoDrag) {
    isNekoClicked = 0 // defaults to sitting after dragging
    lastMoveTime = Date.now();
    nekoXPos = event.clientX - 15; // offset by 15 pixels because otherwise its outside the mouses bounding box lol
    nekoYPos = event.clientY - 15;
    nekoDiv.style.left = nekoXPos + "px";
    nekoDiv.style.top = nekoYPos + "px";
    nekoSprite.src = drag;
    if (event.clientX > lastMouseX + (lastMouseX * 0.008)) { // very sensitive, maybe 0085 might be better but i'm too lazy to test
      nekoSprite.style.transform = "scaleX(1)";
    } else if (event.clientX < lastMouseX) {
      nekoSprite.style.transform = "scaleX(-1)";
    }
    lastMouseX = event.clientX;
  }                        
}

document.addEventListener("mousedown", function() {
  isMouseDown = 1;
});

document.addEventListener("mouseup", function() {
  isMouseDown = 0;
  isNekoDrag = 0;
  nekoMove(); // makes neko move again on mouseup (assuming she isn't already manually sat down)
});

document.addEventListener("mousemove", dragNeko);