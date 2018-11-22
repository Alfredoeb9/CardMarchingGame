//  Programming cards through javascript format from Mike webinar
//  An array holds all of the cards
let cards = ['fa-diamond', 'fa-diamond',
              'fa-paper-plane-o', 'fa-paper-plane-o',
              'fa-anchor', 'fa-anchor',
              'fa-bolt', 'fa-bolt',
              'fa-cube', 'fa-cube',
              'fa-leaf', 'fa-leaf',
              'fa-bicycle', 'fa-bicycle',
              'fa-bomb', 'fa-bomb'];

//  template literal used in a function that generates the cards programatically
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


function initiateGame() {
  //  stores the unorderd list with the class .deck from the HTML file, where we will put cards
  let deck = document.querySelector('.deck');
  let cardHTML = shuffle(cards).map(function(card) {
    //  calls generateCard function for each card
    return generateCard(card);
  });
  deck.innerHTML = cardHTML.join('');
}

initiateGame();
// gameStopwatch();

// ***** Global Scope Variables ***** //


//  variable hold all cards
let allCards = document.querySelectorAll('.card');
//  Array holds all cards
let openCards = [];
//  moves counter
let moves = 0;
//  Grab the moves counter
let movesCounter = document.querySelector('.moves');
//  Grab the restart game "fa-repeat" icon
let restartGame = document.querySelector('.fa-repeat');
//  Grab minutes section
let displayMinutes = document.querySelector('.minutes');
//  Grab seconds section
let displaySeconds = document.querySelector('.seconds');
//  variable for timer to keep track of elapsed milliseconds
let hour = 0;
let minutes = 0;
let seconds = 0;
//variable to track matched cards to evaluate if game has been won
let matched = 0;
//need 8 pairs to win the gameStopwatch
const winningPairs = 8;
// Grab the modal 
const modal = document.querySelector('.modal');
//  Grab the play button
const yBtn = document.querySelector('.play-again');
//  Grab the no button
const nBtn = document.querySelector('.quit');
//  for gameStopwatch
var interval;

 // event listener for restart game button
 restartGame.addEventListener('click', function(e) {
   // removes any open, show or match classes from cards
   allCards.forEach(function(card) {
     card.classList.remove('open', 'show', 'match');
   });
   // adds stars back to star rating
   let stars = document.querySelectorAll('.fa-star');
  stars.forEach(function(element) {
      element.style.display = 'inline-block';
  })
   initiateGame();
   stopTimer();
   console.log('Reinitiate game');
   // resets # of moves when reset button is clicked
   moves = 0;
   movesCounter.innerText = moves;
   //  moves matched cards tracker back to 0
   matched = 0;
   milliseconds = 0;
   openCards = [];
 });

 // game stopwatch function
 function gameStopwatch() {

    interval = setInterval(function() {
      seconds++;
      if(seconds == 60) {
        minutes++;
        seconds = 0;
      }
      formatTimer();
    }, 1000)
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

//  check how many moves have been made and output stars
function starRating() {
  const three = document.querySelector('.three');
  const two = document.querySelector('.two');
  const one = document.querySelector('.one');
  if (moves === 10) {
    three.style.display = 'none';
    console.log('moves = 10');
  } else if (moves === 15) {
    two.style.display = 'none';
    console.log('moves = 15');
  } else {
    one.style.display = 'none';
    console.log('moves = 20');
  }
}

 // Grab deck class
 let deck = document.querySelector('.deck');

deck.addEventListener('click', event => {
  const clickTarget = event.target;
  if(clickTarget.classList.contains('card')) {
      gameStopwatch();
    //  If none of these are active don't do anything
     if (!clickTarget.classList.contains('open') && !clickTarget.classList.contains('show') && !clickTarget.classList.contains('match')) {
         // when a card is clicked push into target
         openCards.push(clickTarget);
         
         // After click add classes
         clickTarget.classList.add('open', 'show');

         /*
         * If two cards are clicked check if both match
         * else set timer and 
         * remove classes open and show
          */
         if (openCards.length == 2) {
           // If the cards match, add the .match, .open & .show classes
           if (openCards[0].dataset.card == openCards[1].dataset.card) {
               openCards[0].classList.add('match');
               openCards[0].classList.add('open');
               openCards[0].classList.add('show');

               openCards[1].classList.add('match');
               openCards[1].classList.add('open');
               openCards[1].classList.add('show');

               openCards = [];
               // If it is a match add 1 to matched cards
               matched++;
           } else {
          //  If it's not a match, hide the cards again
           setTimeout(function() {
             openCards.forEach(function(card) {
               card.classList.remove('open', 'show');
             });
             openCards = [];
           }, 350); // 300 might be a soomther fit
         }
         // Moves go up please one 
         moves += 1;
         movesCounter.innerText = moves;
         if (matched === winningPairs) {
           console.log("Game over!");
           clearInterval(interval);
           // Displays modal Window
           modal.style.display = 'block';
           // Writes final game stats to the modal window
           finalStats();
         }
       }
      starRating();
     }
   }
});

function finalStats() {
  const officialTime = document.querySelector('.End-time');
  const officialMoves = document.querySelector('.End-moves');
  const officialStars = document.querySelector('.End-stars');
  const officialMinutes = document.querySelector('.minutes').innerHTML;
  const officialSeconds = document.querySelector('.seconds').innerHTML;
  let stars = starCount();

  officialTime.innerHTML = `Time: ${officialMinutes}:${officialSeconds}`;
  officialMoves.innerHTML = `Moves: ${moves}`;

  function starCount() {
    findStars = document.querySelectorAll('.stars li');
    finalStars = 0;
    for (findStar of findStars) {
      if (findStar.style.display !== 'none') {
        finalStars++;
        officialStars.innerHTML = `Stars: ${finalStars}`;
        console.log(finalStars);
      }
    }
  }

  //  set modla to block
  modal.style.display = "block";
}

//  when yes btn is clicked restart game 100%
yBtn.addEventListener('click', function(e) {
  modal.style.display = 'none';
  initiateGame();
  moves = 0;
  movesCounter.innerText = moves;

  matched = 0;
  milliseconds = 0;
  gameStopwatch();
  openCards = [];

  let stars = document.querySelectorAll('.fa-star');
  stars.forEach(function(e) {
    e.style.display = 'inline-block;'
  })
});

//  When no btn is clicked set modal to none;
nBtn.addEventListener('click', function(e) {
  modal.style.display = 'none';
});