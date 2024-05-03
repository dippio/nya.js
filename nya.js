// nya.js ~ javascript neko
// by tyler / dippio (github.com/dippio)
//
// this is my first js project so don't be too harsh qwq
//
// TODO: actually finish the script
//       reimplement neko98s footprint feature, and maybe the ZZz's in onekos sleep animation? 
//       maybe fully implement awaken function? i don't like that behavior very much though so idk (togglable?)
//       in terms of quality, this script kinda sucks. really bad. maybe i'll fix it one day
//       mode where the cat can run around without input from the user (like neko98s pace mode)
//       doesn't wory particually well on mobile





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
let footprints = 0; // doesn't do anything yet  



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

const idle = "data:image/x-icon;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///w/wAP8P//8P//AAAAAAD/8P/w//D/8AAAAAAAAAD///D/8P/w///wAAAAAAAA//8A//D/8A//8AAAAAAAAA/wD//w//8A/wAAAAAAAAAAAA//////AAAAAAAAAAAAAAAP/////wAAAAAAAAAAAAAAAP////AAAAAAAAAAAAAAAAAP//8AAAAAAAAAAAAAAAAAAP/wAAAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAA//////AAAAAAAAAAAAAAD///////AAAAAAAAAAAAAPAA/w/wAPAAAAAAAAAAAAD////////wAAAAAAAAAAAA//D///D/8AAAAAAAAAAAAP/w///w//AAAAAAAAAAAAD/8P//8P/wAAAAAAAAAAAA////////8AAAAAAAAAAAAP//8AD///AAAAAAAAAAAAAP//AA//8AAAAAAAAAAAAAD/8AAA//AAAAAAAAAAAAAAD/AAAP8AAAAAAAAAAAAAAA8AAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////////////////4AIAB+AAAAPwAAAH8AAAf/AAAH/4AAD//IAJ//+AD///wB///+A////wf///wB///4AP//8AB//+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//wIH//8HB///hw///4+P///f3/////////////////w=="
const awake = "data:image/png;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///w/wAP8P//8AAAAAAAAAD/8P/w//D/8AAAAAAAAAD///D/8P/w///wAAAAAAAA//8A//D/8A//8AAAAAAAAA/wD//w//8A/wAAAAAAAAAAAA//////DwAAAAAAAAAAAAAP/////w/wAAAAAAAAAAAAAP////AA/wAAAAAAAAAAAAAP//8AAA/wAAAAAAAAAAAAAP/wAAAA8AAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAA//////AAAAAAAAAAAAAAD///////AAAAAAAAAAAAAPAA/w/wAPAAAAAAAAAAAAD////////wAAAAAAAAAAAA//D///D/8AAAAAAAAAAAAP/w///w//AAAAAAAAAAAAD/8P//8P/wAAAAAAAAAAAA////////8AAAAAAAAAAAAP//8AD///AAAAAAAAAAAAAP//AA//8AAAAAAAAAAAAAD/8AAA//AAAAAAAAAAAAAAD/AAAP8AAAAAAAAAAAAAAA8AAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////////////////4AIAP+AAAD/wAAB/8AAAf/AAAH/4AAD//IAB//+AAf//wBD//+A4f//wfH//wB7//4AP//8AB//+AAP//gAD//4AA/w+AAOH/gAD//4AA//mAAJ/nwIHnn8HB+f9hw//+4+N//ff3v/v//9///////////w=="
const yawn = "data:image/x-icon;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///w/wAP8P//8P//AAAAAAD/8P/w//D/8AAAAAAAAAD///D/8P/w///wAAAAAAAA//8A//D/8A//8AAAAAAAAA/wD//w//8A/wAAAAAAAAAAAA//////AAAAAAAAAAAAAAAP/////wAAAAAAAAAAAAAAAP////AAAAAAAAAAAAAAAAAP//8AAAAAAAAAAAAAAAAAAP/wAAAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAA//AP//AAAAAAAAAAAAAAD/8JkP//AAAAAAAAAAAAAP//ARD///AAAAAAAAAAAAD//wEQ///wAAAAAAAAAAAAAP8BEP/wAAAAAAAAAAAAAP8P8A//D/AAAAAAAAAAAAD//w8PD//wAAAAAAAAAAAA8AD///AA8AAAAAAAAAAAAP//8AD///AAAAAAAAAAAAAP//AA//8AAAAAAAAAAAAAD/8AAA//AAAAAAAAAAAAAAD/AAAP8AAAAAAAAAAAAAAA8AAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////////////////4AIAB+AAAAPwAAAH8AAAf/AAAH/4AAD//IAJ//+AD///wB///+A////wf///wB///4AP//8AB//+AAP//gAD//4AA//+AAP//gAD//4AA//+AAP//wIH//8HB///hw///4+P///f3/////////////////w=="
const drag = "data:image/gif;base64,R0lGODlhIAAgAHAAACH5BAEAAAMALAAAAAAgACAAgQAAAP///xoaGgAAAAKRnI8wigvcYnwugQANlTyF/ygP1h3UtnzqCJbmYqry1bqTPNd2Q+Pzbun5dLbTEMfISCChnpOkLLEwoBUm6hJWq1gp9UgsrrRU1O7ZHANjw+aafexmwau3Jl5/k8tOPZ4lt/TXd0ZnRFIIdiGCOGeIGAhnGOlBp5Z4tcdVRMOUNtYoGGYxFtgpNtogsLqz6tpRAAA7"
const scratch1 = "data:image/x-icon;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///w/wAP8AAP////AAAAAAD/8P/w//D/AAAAAAAAAAD///D/8P/w//8AAAAAAAAA//8A//D/8A//8AAAAAAAAA/wD//w//8P//AAAAAAAAAAAA//////D///AAAAAAAAAAAP/////w///wAAAAAAAAAAAP////D///8AAAAAAAAP//8A//8AD///AAAAAAAAAPD////w/w///wAAAAAAD///////8PAP//8AAAAAAAAA//8P//8A///wAAAAAAAP//8P8A//AP//AAAAAAAAD///D////wD/8AAAAAAAAP////D///8A8AAAAAAAAA//////D///APAAAAAAAAAP/////////wDwAAAAAAAA//AAD/////8A8AAAAAAAAAAAAA/////wAAAAAAAAAAAAAAAP///wAAAAAAAAAAAAAAAAD///AAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////////////////4AIAB+AAAAPwAAAH8AAA//AAAH/4AAA//IAAP/+AAD/8AAA/8AAAP+AAAD/gAAA/4AAAf+AAAP/gAAH/wAAD/4AAB/+AAAf/AAAH/w4AT//+AP///gP///4H///+H////n////////////////////////w=="
const scratch2 = "data:image/x-icon;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///w/wAP8AAP////AAAAAAD/8P/w//D/AAAAAAAAAAD///D/8P/w///wAAAAAAAA//8A//D/8A//8AAAAAAAAA/wD//w//8P//8AAAAAAAAAAA//////D///AAAAAAAAAAAP//8ADw///wAAAAAAAAAAAP8A//D///8AAAAAAAAP//8AD///////AAAAAAAAAPD/8AAAD////wAAAAAAD////wD//wD///AAAAAAAAAA////AP8AAAAAAAAAAAAP///w////AAAAAAAAAAAAD////wD///AAAAAAAAAAAA//////D//wAAAAAAAAAAAP////////8AAAAAAAAAAA/////////wAAAAAAAAAAAP//AP////8AAAAAAAAAAAD/8AAP///wAAAAAAAAAAAA/wAAD///AAAAAAAAAAAAAPAAAAD/8AAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////////////////4AIAB+AAAAPwAAAH8AAAf/AAAH/4AAA//IAAP/+AAD/8AAA/8AAAP+AAAD/gAAB/4AAA/+AAP//gAB//4AAf/+AAH//AAD//wAA//8GAf//DgP//x8H//+/D////x////+////////////////////////w=="
const sleep1 = "data:image/x-icon;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wAA/w/wAAAAAAD/////AAAAAP8A/wAAAAAP////8P///w8A8A8AAAAAD////w///w///w8PAAAAAA////D/8AD/8P/w8AAAAAAP///w8A////8A8PAAAAAAD///D////////wDwAAAAAAD//w/////////wAAAAAAAAD/8P////////8AAAAAAAAA//D/////////AAAAAAAAAAD/D///AP//8PAAAAAAAAAAAA//8PD//w8AAAAAAAAAAAAA/wAAD/8AAAAAAAAAAAAAAA8AAA//AAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////////////4BgP/AAAB/gAAAfwAAAH8AAAB/AAAAfwAAAP8AAAD/gAAA/8AAAf/AAAH/4AAB//gAA///AAf//44P///fD////4/////f////////////////////////////////////////////////////////////////w=="
const sleep2 = "data:image/x-icon;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wAA/w/wAAAAAAD/////AAAAAP8A/wAAAAAP////8P///w8A8A8AAAAAD////w///w///w8PAAAAAA////D//wD/8P/w8AAAAAAP///w8AD///8P8PAAAAAAD///D///////8PDwAAAAAAD//w/////////wAAAAAAAA//8P////////8AAAAAAAAP//D/////////AAAAAAAAAP//D//wD///8PAAAAAAAAAA/w//D/D//w8AAAAAAAAAAAAA8AAAD/8AAAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////////////4BgP/AAAB/gAAAfwAAAH8AAAB/AAAAfwAAAP8AAAD/gAAA/4AAAf+AAAH/wAAB/+AAA//4AAf//x4P//++H////x////+f////////////////////////////////////////////////////////////////w=="

// directional
// maybe convert all of them to a more efficient format

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
nekoDiv.style.position = 'fixed';
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

  nekoSprite.src = idle;                                  // injects an aditional frame, not sure why i added this in the first place
  let randInt = Math.floor((Math.random() + 1) * 2);      // i know there was a reason though and now i'm too scared to remove it

  let animationFrames;
  let maxFrames;

  switch(randInt) {
    case 1: // yawn
      animationFrames = [yawn, idle];
      maxFrames = 6;
      break;
    case 2: // sleep
      animationFrames = [sleep1, sleep2];
      maxFrames = 100;
      break;
    case 3: // scratch
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
      isNekoIdle = 0
    }
  }, tick); // change frame
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