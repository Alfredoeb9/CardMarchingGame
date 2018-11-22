//  Programming cards through javascript format from Mike webinar
//An array holds all of the cards
let cards = ['fa-diamond', 'fa-diamond',
              'fa-paper-plane-o', 'fa-paper-plane-o',
              'fa-anchor', 'fa-anchor',
              'fa-bolt', 'fa-bolt',
              'fa-cube', 'fa-cube',
              'fa-leaf', 'fa-leaf',
              'fa-bicycle', 'fa-bicycle',
              'fa-bomb', 'fa-bomb'];

//template literal used in a function that generates the cards programatically
function generateCard(card) {
    return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


 //function to initiate the game
function initiateGame() {
  //stores the unorderd list with the class .deck from the HTML file, where we will put cards
  let deck = document.querySelector('.deck');
  let cardHTML = shuffle(cards).map(function(card) {
    //calls generateCard function for each card
    return generateCard(card);
  });
  deck.innerHTML = cardHTML.join('');
}

initiateGame();
gameStopwatch();

// ***** Global Scope Variables ***** //


//variable hold all cards
let allCards = document.querySelectorAll('.card');
//Array to hold cards that are open. Initially empty.
let openCards = [];
//moves counter - begins at 0
let moves = 0;
//selects the moves counter in index.html
let movesCounter = document.querySelector('.moves');
//selects the restart game "fa-repeat" icon
let restartGame = document.querySelector('.fa-repeat');
//selects minutes section of HTML stopwatch
let displayMinutes = document.querySelector('.minutes');
//selects seconds section of HTML stopwatch
let displaySeconds = document.querySelector('.seconds');
//variable for timer to keep track of elapsed milliseconds
let milliseconds = 0;
let hour = 0;
let minutes = 0;
let seconds = 0;
//variable to track matched cards to evaluate if game has been won
let matched = 0;
//need 8 pairs to win the gameStopwatch
const winningPairs = 8;
//for gameStopwatch
var interval;

 //event listener for restart game button
 restartGame.addEventListener('click', function(e) {
   //removes any open, show or match classes from cards
   allCards.forEach(function(card) {
     card.classList.remove('open', 'show', 'match');
   });
   //adds stars back to star rating
   let stars = document.querySelectorAll('.fa-star');
  stars.forEach(function(element) {
      element.style.display = 'inline-block';
  })
   initiateGame();
   stopTimer();
   console.log('Reinitiate game');
   //resets # of moves when reset button is clicked
   moves = 0;
   movesCounter.innerText = moves;
   //moves matched cards tracker back to 0
   matched = 0;
   milliseconds = 0;
   openCards = [];
 });

 //game stopwatch function
 function gameStopwatch() {
    //clearInterval(interval); Supposed to reset stopwatch, but not doing anything
    //setInterval evaluates an expression at specified intervals (every 1000 milliseconds/1 second here)
    var interval = setInterval(function() {
      milliseconds++;
      convertSeconds(Math.floor(milliseconds));
    }, 1000);
 }

 function stopTimer() {
     clearInterval(interval);
     displaySeconds.innerHTML = gameStopwatch();
 }

 function formatTimer() {
     let sec = seconds > 9 ? String(seconds) : "0" + String(seconds);
     let min = minutes > 9 ? String(minutes) : "0" + String(minutes);
    //  displayMinutes.innerHTML = min;
     displaySeconds.innerHTML = min + ':' + sec;
 }

// converts milliseconds to seconds and minutes to be displayed
function convertSeconds(milliseconds) {
  let minutes = Math.floor(((milliseconds % 864000) % 3600) / 60);
  let seconds = ((milliseconds % 86400) % 3600) % 60;
  displayMinutes.innerHTML = minutes;
  if(seconds < 10) {
     displaySeconds.innerHTML = "0" + seconds;
} else {
     displaySeconds.innerHTML = seconds;
   }
}

//function to check how many moves have been made & change star rating
function starRating() {
  const three = document.querySelector('.three');
  const two = document.querySelector('.two');
  const one = document.querySelector('.one');
  if (moves === 10) {
    three.style.display = 'none';
    console.log('moves = 10');
  } else if (moves === 15) {
    two.style.display = 'none';
    console.log('moves = 15')
  }
}

 //event listner for clicks on cards
 let deck = document.querySelector('.deck');

deck.addEventListener('click', event => {
  const clickTarget = event.target;
  if(clickTarget.classList.contains('card')) {
    //   gameStopwatch();
    //disables ability to click on a matched card or the same card twice
     if (!clickTarget.classList.contains('open') && !clickTarget.classList.contains('show') && !clickTarget.classList.contains('match')) {
         //when a card is clicked, the card gets added to the openCards array
         openCards.push(clickTarget);
         //adds .open and .show classes when card is clicked
         clickTarget.classList.add('open', 'show');

         //if 2 or more cards are showing, see if they are a match or not
         //since the array gets cleared out each time, there will only be 2 cards in the array at a time
         if (openCards.length == 2) {
           //if the cards match, add the .match, .open & .show classes
           if (openCards[0].dataset.card == openCards[1].dataset.card) {
               openCards[0].classList.add('match');
               openCards[0].classList.add('open');
               openCards[0].classList.add('show');

               openCards[1].classList.add('match');
               openCards[1].classList.add('open');
               openCards[1].classList.add('show');

               openCards = [];
               //Adds 1 to matched variable for each pair of matched cards
               matched++;
           } else {
          //if it's not a match, hide the cards again
           setTimeout(function() {
             openCards.forEach(function(card) {
               card.classList.remove('open', 'show');
             });
             openCards = [];
           }, 350);
         }
         moves += 1;
         movesCounter.innerText = moves;
         if (matched === winningPairs) {
           console.log("Game over!");
           clearInterval(interval);
           //displays modal Window
           modal.style.display = 'block';
           //writes final game stats to the modal window
           finalStats();
         }
       }
      starRating();
     }
   }
});