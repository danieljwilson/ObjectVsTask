/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
  "instructions/instruct-1.html",
  "instructions/instruct-2.html",
  "instructions/instruct-3.html",
  "instructions/instruct-ready.html",
  "stage.html",
  "postquestionnaire.html",
  "debriefing.html"
];

//call this inside of preload
psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
  "instructions/instruct-1.html",
  "instructions/instruct-2.html",
  "instructions/instruct-3.html",
  "instructions/instruct-ready.html"
];

//CAN WE USE THIS TO LOAD THE INSTRUCTION PAGES?
/*
$(window).load( function(){
    psiTurk.doInstructions(
      instructionPages, // a list of pages you want to display in sequence
      function() { currentview = new ImageExperiment(); } // what you want to do when you are done with instructions
    );
});
*/
var lastTrial = 10;

var width = 1024;
var height = 540;
var left = width*0.7;
var right = width*0.3;

var rPosition;
var ePosition;
var textPosition;

var howBig = 220;
var r, g, b;

var newTrial = true;
var results = false;
var even, high, yellow, blue;

var rightAnswer;
var correct;
var answer;
var trialOn;
var elapsedT;
var selected;
var numberSelect;

var trialNumber = 0;
var win;
var wins = 0;
var losses = 0;

function setup() {
  createCanvas(1024, 540);

  left = 0.3*width;
  right = 0.7*width;
  sideSelect();

  noStroke();
}

function draw() {
  background(102);
  if (!results) {

    drawShapes();
    numberOn();
    directionsOn();
    newTrial = false;

    if (key == 'h' || key == 'H') {
      if (correct == 1) {
        rightAnswer = true;
      } else {
        rightAnswer = false;
      }
      selected = 1;
      goToResults();
    }
    if (key == 'g' || key == 'G') {
      if (correct == 2) {
        rightAnswer = true;
      } else {
        rightAnswer = false;
      }
      selected = 2;
      goToResults();
    }
    if (key == 'n' || key == 'N') {
      if (correct == 3) {
        rightAnswer = true;
      } else {
        rightAnswer = false;
      }
      selected = 3;
      goToResults();
    }
    if (key == 'b' || key == 'B') {
      if (correct == 4) {
        rightAnswer = true;
      } else {
        rightAnswer = false;
      }
      selected = 4;
      goToResults();
    }
  }

  if (results) {
    drawShapes();
    numberOn();
    directionsOn();
    if (rightAnswer) {
      answer = "RIGHT";
      resultText();
    }
    if (!rightAnswer) {
      answer = "WRONG";
      resultText();
    }
    if (keyCode == 32) {
      results = false;
      newTrial = true;
      sideSelect();
    }
  }
  if (trialNumber >= lastTrial){
    //Then save the data
    psiTurk.saveData();
    //Then compute the bonus [this is NOT working yet]
    psiTurk.computeBonus('compute_bonus');
    //Then finish which loads the debriefing page
    finish();
    }
}



/////////////////////////////////////////////////
//////// RECORD DATA FUNCTION////////////////////
/////////////////////////////////////////////////

  function record_responses(circlePos, squarePos, color, numberSelect, correct, selected, win, elapsedT, wins, losses, trialNumber) {

    psiTurk.recordTrialData({ 
      "Circle Position": circlePos,
      "Square Position": squarePos,
      "Number Color": color,
      "Number Value": numberSelect,
      "Correct Selection": correct,
      "Actual Selection": selected,
      "Right?": win,
      "Time Elapsed": elapsedT,
      "Correct Total": wins,
      "Wrong Total": losses,
      "Total Trials": trialNumber
        });
        //use the window alert below if you want to test what is being written to any given value
    //window.alert("Trial #" + trial + "  Amount: " + money);
  };

function goToResults() {
  elapsedT = millis() - trialOn;
  var color;
  if (blue == true) {color = "blue";}
  if (yellow == true) {color = "yellow";}

  var circlePos;
  var squarePos;
  if (ePosition > 500) {circlePos = "right"; squarePos = "left";}
  if (ePosition < 500) {circlePos = "left"; squarePos = "right";}

  winLoss();
  trialNumber+=1;
  //RECORD DATA HERE
  record_responses(circlePos, squarePos, color, numberSelect, correct, selected, win, elapsedT, wins, losses, trialNumber);
  results = true;


}


function winLoss(){
  if (rightAnswer){
    wins+=1;
    win = true;
  }
  if(!rightAnswer){
    losses+=1;
    win = false;
  }
}

function drawShapes() {
  fill(255, 255, 255);
  rect(rPosition-howBig/2, height*0.5-howBig/2, howBig, howBig);
  ellipse(ePosition, height*0.5, howBig, howBig);
}

function resultText() {
  fill(0, 0, 0);
  textSize(60);
  text(answer, width*0.5-120, 64); 
  textSize(24);
  text("To continue press the spacebar...", width*0.5-120, 96);
}

function sideSelect() {
  if (random(1)<0.5) {
    rPosition = left;
    ePosition = right;
  } else {
    rPosition = right;
    ePosition = left;
  }
}

function directionsOn() {
  fill(0, 0, 0);
  textSize(24);
  text("If the number is BLUE and EVEN press 'H'", 200, 420);
  text("If the number is BLUE and ODD press 'G'", 200, 450);
  text("If the number is YELLOW and GREATER THAN 5 press 'N'", 200, 480);
  text("If the number is YELLOW and LESS THAN 6 press 'B'", 200, 510);
}

function numberOn() {
  textSize(180);
  //randomize the side
  if (newTrial) {
    if (random(1)<0.5) {
      textPosition = left;
    } else {
      textPosition = right;
    }
    var choose = random(1);
    //randomize the color
    if (choose<0.5) {
      r = 0;
      g = 0;
      b = 255;
      blue = true;
      yellow = false;
    } if(choose>=0.5) {
      r = 255;
      g = 255;
      b = 0;
      yellow = true;
      blue = false;
    }
    //random number
    numberSelect = int(random(10))+1;
    if (numberSelect%2 == 0) {
      even = true;
    } else {
      even = false;
    }
    if (numberSelect >5) {
      high = true;
    } else {
      high = false;
    }
    if (blue && even) {
      correct = 1;
    }
    if (blue && !even) {
      correct = 2;
    }
    if (yellow && high) {
      correct = 3;
    }
    if (yellow && !high) {
      correct = 4;
    }
    trialOn = millis();
  }
  numberWrite();
}

function numberWrite() {
  fill(r, g, b);
  var offset;
  if (numberSelect>9){
    offset = 105;
  }
  else{
    offset = 55;
  }
  text(numberSelect, textPosition-offset, height/2+70);
};


var finish = function() {
      
      currentview = new endExperiment();
  };

/////////////////////////////////////////////////
////////END: SEND TO DEBRIEF/////////////////////
/////////////////////////////////////////////////

var endExperiment = function() {

  prompt_resubmit = function() {
    replaceBody(error_message);
    $("#resubmit").click(resubmit);
  };

  resubmit = function() {
    replaceBody("<h1>Trying to resubmit...</h1>");
    reprompt = setTimeout(prompt_resubmit, 10000);
    
    psiTurk.saveData({
      success: function() {
          clearInterval(reprompt); 
      }, 
      error: prompt_resubmit
    });
  };
  // Load the debriefing page 
  psiTurk.showPage('debriefing.html');

  //code for bonus??
  $("#next").click(function () {
      record_responses();
      psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() { 
                  psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit});
  });

}


