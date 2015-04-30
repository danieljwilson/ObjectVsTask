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

//You can change the upper and lower limit of the win percentage here
var lowerBound = 0.2;
var upperBound = 0.8;
var winPercentageLeft;
var winPercentageRight;

var randomNumber;

//for stepping through the instructions at the beginning
var page = 0;
var introImgBW;
var introImgColor;

var nextTrial = false;
var newRound = true;
var textNum = 0;
var textPos;

//Image arrays
var images = [];
var BWimages = [];

//Set the selection keys
var lettersSmall = [114, 116, 121, 117, 102, 103, 104, 106];
var lettersBig = [82, 84, 89, 85, 70, 71, 72, 74, 75];

var rightIndex; 
var leftIndex;

var rightLetterSmall; 
var rightLetterBig;
var leftLetterSmall;
var leftLetterBig;

//For randomizing the left and right of the BW/Color images
var leftPos = 0+25;
var rightPos = 512 +12;
var colorPos; 
var BWPos;

//For randomizing image order
var colorImageSelect;
var BWImageSelect;
var colorShuffle = [];
var BWShuffle = [];
var imageCounter = 1;

//For timing
var imageOn;
var elapsedT;

//Recorded data variables
var trialTotal = 0;
var wins = 0;
var losses = 0;
var money = 0;
var round = 0;
var trial = 0;
var win = false;
var selected;
var leftSequentialSelect = 0;
var rightSequentialSelect = 0;
//also include the bw and color image for the trial

//USING THIS TO EXPLICITLY STATE THE NUMBER OF IMAGES (instead of .length)
var imageNumber = 20;
var i;



function preload() {
    //LOAD COLOR IMAGES
  for (i = 0; i< imageNumber; i++ ){
    images[i] = loadImage( "static/images/color" + i + ".jpg" );   // make sure images "0.jpg" to "11.jpg" exist
    }
  //  psiturk.preloadImages(images);
  //LOAD BW IMAGES
  for (i = 0; i< imageNumber; i++ ){
    BWimages[i] = loadImage( "static/images/bw_color" + i + ".jpg" );   // make sure images "0.jpg" to "11.jpg" exist
    }
   // psiturk.preloadImages(BWimages);
}



/////////////////////////////////////////////////
//////SETUP/////
/////////////////////////////////////////////////

function setup() {

  //set screen size
  createCanvas(1024, 520);

  introImgBW = loadImage("static/images/intro_bw.jpg"); 
  introImgColor = loadImage("static/images/intro_color.jpg"); 

  
  round = 0;

  
  //Initialize Array
  for (var i = 0; i < imageNumber; i++) {
    colorShuffle[i] = i;
    BWShuffle[i] = i;
  }
    
    //underscore has a shuffle method
    colorShuffle.shuffle();
    BWShuffle.shuffle();
}

function draw() {
  //Background color and stroke color
  background(255);
  stroke(0);

  //Each draw cycle sets a different random value between 0 and 1
  //This is used to decide whether the selection wins or loses
  //The randomNumber is compared to the selected bandit's winPercentage
  randomNumber = random(0,1);

  //INSTRUCTIONS: Describe the experiment here
  if (page==0){
    instructions();

    if(mouseIsPressed){
      page+=1;
    }
  }
  
  //PRACTICE
  if (page>=1 && page<=3){
    p5image(introImgColor, width/2+12, 60);
    p5image(introImgBW, 0+25, 60);

    }
   
  if (page==1) {
    page1();    
    if (key == 'g' || key == 'G') {
      page+=1;
    }
  }
  
  if (page == 2) { 
      page2();
      if (key == 'h' || key == 'H') {
          page+=1;
      }
  }
  
  if (page ==3) {
      page3();
    if (key == 'b' || key == 'B') {
          page+=1;
        }   
  }
  
   if (page==4){
    printRoundTitle();

    if (mouseIsPressed){
      page+=1;
      key='a';
      setLetters();
    }
  }
  
  if (page == 5){  
    //////////////////
    //THE EXPERIMENT//
    //////////////////
    if(newRound){
      
        updateRound();
        newRound = false;
        imageSelect();
        //UNCOMMENT...starts timer
        //imageOn = new Date().getTime();
        imageOn = millis();
    }
    
    if(!newRound){
       p5image(images[colorImageSelect], colorPos, 60);
       p5image(BWimages[BWImageSelect], BWPos, 60);
       
      if(!nextTrial) {
        printRound();
        //FOR LEFT SELECTION
        if (key == String.fromCharCode(leftLetterSmall) || key == String.fromCharCode(leftLetterBig)) {
          //TIMING CALCULATION
          elapsedT = millis() - imageOn;
          leftSelect();
         }
        //FOR RIGHT SELECTION
        if (key == String.fromCharCode(rightLetterSmall) || key == String.fromCharCode(rightLetterBig)) {
          //TIMING CALCULATION
          elapsedT = millis() - imageOn;
          rightSelect();
        }
       
      upperBanner();
      text("Select an image.      Left = '" + String.fromCharCode(leftLetterBig) + "', Right ='" + String.fromCharCode(rightLetterBig) + "'", width/2-200, 38);
      //JAVA VERSION
      //text("Select an image.      Left = '" + char(leftLetterBig) + "', Right ='" + char(rightLetterBig) + "'", width/2-200, 38);
     }
      
    printEarnings();
    
    //TEXT INDICATING WIN/LOSS  
    //////////////////////////
     if(nextTrial) {
       printRound();
       printOutcome();          
       upperBanner();
       text("Press the 'B' key to continue", width/2-135, 38);
        
        if(key == 'B' || key == 'b'){
          nextTrial = false;
          setLetters();

          //RECORD DATA HERE
          record_responses(elapsedT, colorPos, BWPos, colorImageSelect, BWImageSelect, trialTotal, round, winPercentageLeft, winPercentageRight, trial, selected, win, wins, losses, money, leftSequentialSelect, rightSequentialSelect);
          //RESET TIMER
          imageOn = millis();

          //After 10 trials (or 5 consecutive selections of one bandit) move on to the next round
          if (trial == 10 || leftSequentialSelect == 5 || rightSequentialSelect == 5){
            newRound = true;
            page-=1;
            leftSequentialSelect =0;
            rightSequentialSelect = 0;
          }

          if (trialTotal >= 20){
            //Then save the data
            psiTurk.saveData();
            //Then compute the bonus [this is NOT working yet]
            psiTurk.computeBonus('compute_bonus');
            //Then finish which loads the debriefing page
            finish();
           }
            
        }
     }
    }
  }
}


/////////////////////////////////////////////////
//////// RECORD DATA FUNCTION////////////////////
/////////////////////////////////////////////////

  function record_responses(elapsedT, colorPos, BWPos, colorImageSelect, BWImageSelect, trialTotal, round, winPercentageLeft, winPercentageRight, trial, selected, win, wins, losses, money, leftSequentialSelect, rightSequentialSelect) {

    psiTurk.recordTrialData({ 
      "Round": round,
      "Left_Win Percentage": winPercentageLeft,
      "Right_Wind Percentage": winPercentageRight,
      "Color Image": colorImageSelect,
      "BW Image": BWImageSelect,
      "Color Position": colorPos,
      "BW Position": BWPos,
      "Trial": trial,
      "Selected Image": selected,
      //UNCOMMENT
      "Time Elapsed": elapsedT,
      "Win?": win,
      "Win Total": wins,
      "Loss Total": losses,
      "Earnings": money,
      "Left Sequential": leftSequentialSelect,
      "Right Sequential": rightSequentialSelect,
      "Total Trials": trialTotal
        });
        //use the window alert below if you want to test what is being written to any given value
    //window.alert("Trial #" + trial + "  Amount: " + money);
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



function upperBanner(){
    fill(0,0,0,155);
    rect(width/2-240, 12, 480, 35);

    textSize(20);
    fill(255);
}

function lowerBanner(){
    fill(0,0,0,155);
    rect(width/2-150, 440, 300, 60);
      
    textSize(40);
    fill(200);
}

function setLetters(){
  rightIndex = int(random(lettersSmall.length)); 
  leftIndex = int(random(lettersSmall.length));
  
  while (rightIndex == leftIndex){
    leftIndex = int(random(lettersSmall.length));
  }
  
  rightLetterSmall = lettersSmall[rightIndex]; 
  rightLetterBig = lettersBig[rightIndex];
  leftLetterSmall = lettersSmall[leftIndex];
  leftLetterBig = lettersBig[leftIndex];
}

Array.prototype.shuffle = function() {
    var input = this;
     
    for (var i = input.length-1; i >=0; i--) {
     
        var randomIndex = Math.floor(Math.random()*(i+1)); 
        var itemAtIndex = input[randomIndex]; 
         
        input[randomIndex] = input[i]; 
        input[i] = itemAtIndex;
    }
    return input;
}

function imageSelect(){
  if (random(0,1) < 0.5){
    colorPos = rightPos;
    BWPos = leftPos;
    } else {
      colorPos = leftPos;
      BWPos = rightPos;
    }
   
   colorImageSelect = colorShuffle[imageCounter%colorShuffle.length];
   BWImageSelect = BWShuffle[imageCounter%BWShuffle.length];
   
   while (colorImageSelect == BWImageSelect){
     imageCounter+=1;
     colorImageSelect = colorShuffle[imageCounter%colorShuffle.length];
     BWImageSelect = BWShuffle[imageCounter%BWShuffle.length];
   }
   imageCounter+=1;
}

function printOutcome(){
  fill(255,255,255,100);
  rect(textPos, 190, 250, 100);
  textSize(90);
  fill(0);
       
  if(textNum ==1){
    text("WIN", textPos+38, height/2+13);
    }
  if(textNum ==2){
    text("LOSE", textPos+9, height/2+13);
    }
}

function printRound(){
  textSize(24);
  fill(0);
  text("ROUND " + round, 30, 455);
}

function printEarnings(){
  //KEEP TRACK OF EARNINGS  
  ////////////////////////
    
  //FOR JAVA VERSION
  //money = (0.05*wins - 0.05*losses);
  //FOR JAVASCRIPT VERSION  
  money = (0.05*wins - 0.05*losses).toFixed(2);
  lowerBanner();
  textSize(32);
  text("TOTAL = $" + money, width/2-122, 440+40);
}

function leftSelect(){
  if (randomNumber < winPercentageLeft) {
    //UNCOMMENT timer
    //elapsedT = new Date().getTime() - imageOn;
    win = true;
      wins +=1;
      textNum = 1;
    } else {
      win = false;
        losses +=1;
        textNum = 2;
       }
     //add datapoints to save here
     textPos = 138;
     selected = "left";
     trial++;
     nextTrial = true;
     leftSequentialSelect+=1;
     rightSequentialSelect=0;
     trialTotal++;
     print("  Total Trials: " + trialTotal);
   }

function rightSelect(){
  if (randomNumber <winPercentageRight) {
    //UNCOMMENT timer
    //elapsedT = new Date().getTime() - imageOn;
    win = true;
      wins +=1;
      textNum = 1;
    } else {
      win = false;
        losses +=1;
        textNum = 2;
        }
       //add datapoints to save here
     textPos = width/2+138;
     selected = "right";
     trial++;
     nextTrial = true;
     leftSequentialSelect=0;
     rightSequentialSelect+=1;
     trialTotal++;
     print("  trial: " + trial);
     print("Total Trials: " + trialTotal);

}

function printRoundTitle(){
  background(255);
  fill(0,0,0,30);
  rect(200, 200, 624, 120);
  textSize(90);
  fill(0);
  text("ROUND " + (round+1), 310, height/2+13);
  textSize(30);
  fill(80);
  text("Click here to continue", 360, height/2+50);
}

function updateRound(){
  winPercentageLeft = random(lowerBound,upperBound);
  winPercentageRight = random(lowerBound,upperBound);
  trial=0;
  round+=1;
  
  print("  Round #" + round);
  print("  Left: "+ winPercentageLeft);
  print("  Right: " + winPercentageRight);
}

  //ADD INSTRUCTIONS HERE
  ///////////////////////
function instructions(){
  textSize(30);
  fill(0);
  text("Welcome to our test experiment...", 50, 50);

  textSize(13);
  textStyle(NORMAL);
  textFont("Helvetica");
  text("NOTE: This is not a real experiment, we are just testing out the process at this point.", 50, 80);
  text("Everything should work normally, but data will not be used and the trial length is shorter.", 50, 95);
  text("In the experiment you will select either the left or right box - each has a different image.", 50, 110);
  text("When you select the box you will either 'win' or 'lose'.", 50, 125);
  text("This will result in a bonus of either +$0.05 or - $0.05.", 50, 140);
  text("A tally will be kept over the course of the trial of your total bonus.", 50, 155);
  text("If upon completion you have a positive value you will be bonused this amount.", 50, 170);
  text("If you have a negative amount, this will just be calculated as a ZERO bonus.", 50, 185);
  text("On the next screen you will practice the process.", 50, 205);
  text("The actual trial will begin when you see the screen 'Round 01'.", 50, 220);
  
  fill(0,0,0,100);
  rect(362,250, 300,50);
  fill(0);
  textSize(24);
  text("Click here to continue.", 383, 284);

}

function page1() {
    upperBanner();
    text("Press the 'G' key to select the left image", width/2-190, 38);

    lowerBanner();
    text("PRACTICE", width/2-90, 440+45);
}
function page2() {
    upperBanner();
    text("Press the 'H' key to select the right image", width/2-190, 38);

    lowerBanner();
    text("PRACTICE", width/2-90, 440+45);
    
    fill(255,255,255,100);
    rect(138, 190, 250, 100);
    textSize(90);
    fill(0);
       
    text("LEFT", 138+28, height/2+13);
}

function page3 () {
    upperBanner();
    text("Press the 'B' key to begin", width/2-115, 38);
    
    lowerBanner();
    text("PRACTICE", width/2-90, 440+45);
    
    fill(255,255,255,100);
    rect(width/2+113, 190, 300, 100);
    textSize(90);
    fill(0);
       
    text("RIGHT", width/2+113+18, height/2+13);
}
