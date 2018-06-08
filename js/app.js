// This is the list that holds all my cards.
let cards = ['anchor', 'anchor', 'bolt', 'bolt', 'paper-plane-o', 'paper-plane-o', 'diamond', 'diamond', 'cube', 'cube', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb'];
// This is the container that holds all my cards
let cardholder = document.getElementById('card-holder');
// Let us set a variable with the open card so that we can compare the second card to it.
let openCard;
// This keeps track of how many moves we have made
let moves = 0;
// This keeps track of how many matches we've made so far.
let matches = 0;
// This lets us know there is a play in session so that quick clicks don't mess us up.
let playInSession = false;
// This lets us know how much time has elapsed.
let time = 0;
// This is our time interval variable that allows us to clear out the timer.
let x;
// This is where we shove the time code.
let timerEl = document.getElementById('timer');
// This is how many stars we have
let stars = 3;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/** Set the cards in the DOM
 * @param {array} shuffled
 */
function setCards(shuffled) {

    // Create a document fragment to store all the card elements in
    const fragment = document.createDocumentFragment();

    // Loop through all the shuffled cards
    for (const card in shuffled) {
        // Create the li element
        const cardEl = document.createElement('li');
        // Add the card class to it.
        cardEl.className = 'card';
        // Set a card name on it so we can reference that later.
        cardEl.setAttribute('cardName', shuffled[card]);
        // Set the inner html to the icon
        cardEl.innerHTML = '<i class="fa fa-' + shuffled[card] + '"></i>';
        // Append this card element to the fragment we created earlier.
        fragment.appendChild(cardEl);
    }

    // Append the fragment to the cardholder div.
    cardholder.appendChild(fragment);

}

/* Set the board up
 */
function setBoard() {
    // Set up the board to start play

    // Set the moves to zero
    moves = 0;
    // Set the time to zero
    time = 0;
    // Set the moves text to the moves variable
    document.getElementById('moves').innerText = moves;
    // Hide the congratulations box if it is visible.
    document.getElementById("congratulations").style.display = 'none';
    // Set the timer text to zero
    timerEl.innerText = time;
    // Clear the interval out so it's ready to start over.
    clearInterval(x);
    // Set x to empty
    x = '';
    // Clear out all the existing code in the card-holder div.
    cardholder.innerHTML = '';
    // Get the shuffled cards
    let shuffled = shuffle(cards);
    // Run the set cards with the shuffled cards.
    setCards(shuffled);

    // After the cards have been set, run through and give them all a click event and remove the match class if it exists.
    let cardEls = document.getElementsByClassName('card');
    Array.from(cardEls).forEach(function(element) {
        element.addEventListener('click', cardClick);
        element.classList.remove('match');
    });

}

/* This is the timer for our stopwatch
 */
function timer() {
    x = setInterval( function(){
        time++;
        timerEl.innerText = time;
    }, 1000);
}

/* This is what happens when you click a card.
 * @param {event} shuffled
 */
function cardClick(e) {
    // If a timer doesn't exist, start one.
    if(!x) {
        timer();
    }

    // If there is no play in session already
    if(!playInSession) {

        // If the current click does not contain a matched element
        if(!e.target.classList.contains('match') && !e.target.classList.contains('open')) {
            // Set the current card to the current target of the click
            let currentCard = e.target;
            // Add the open and show class to the current target of the click
            currentCard.classList.add('open', 'show');

            // If there is an open card in existence, meaning this is the second click
            if(openCard) {
                // Set the play session to true.
                playInSession = true;
                // Increase the moves counter
                moves++;
                // If the moves are within a certain range, adjust the star rating.
                if(moves > 16 && moves < 30) {
                    document.getElementsByClassName('fa-star')[2].style.color = 'transparent';
                    document.getElementsByClassName('fa-star')[5].style.color = 'transparent';
                    stars--;
                } else if(moves > 30) {
                    document.getElementsByClassName('fa-star')[1].style.color = 'transparent';
                    document.getElementsByClassName('fa-star')[4].style.color = 'transparent';
                    stars--;
                } else {
                    //nothing needs to be done
                }
                // Update the front end moves text
                document.getElementById('moves').innerText = moves;

                // Check to see if the card already open and the newly clicked card have the same icon type
                if(openCard.getAttribute('cardName') === e.target.getAttribute('cardName')) {
                    // The cards match

                    // Remove the open class from the open card
                    openCard.classList.remove('open');
                    // Remove the show class from the open card
                    openCard.classList.remove('show');
                    // Add the match class from the open card
                    openCard.classList.add('match');

                    // Remove the open class from the newly clicked card
                    e.target.classList.remove('open');
                    // Remove the show class from the newly clicked card
                    e.target.classList.remove('show');
                    // Add the match class to the newly clicked card
                    e.target.classList.add('match');

                    // Set the open card to undefined so the next click will start the session over.
                    openCard = undefined;
                    // Set the play in session to false because this session is over
                    playInSession = false;

                    // Increase the match count
                    matches++;

                } else {
                    // The cards do not match

                    // Set a timeout so that it gives the user a second to see the icons
                    setTimeout(function(){
                        // Remove the open and show class from the open card.
                        openCard.classList.remove('open', 'show');
                        // Remove the open and show class from the currently clicked card.
                        e.target.classList.remove('open', 'show');

                        // Set the open card to undefined so the next click will start the session over.
                        openCard = undefined;
                        // Set the play in session to false because this session is over
                        playInSession = false;

                    }, 800);

                }


            } else {
                // There is no open session, so set the currently clicked card to be the open card.
                openCard = e.target;
            }
        }

        // All the matches are found
        if(matches === 8) {
            // Set all the session variables on the game over box.
            document.getElementById('time').innerText = time + ' seconds';
            document.getElementsByClassName('star-rating').innerText = stars;

            // Show the game over box.
            document.getElementById('congratulations').style.display = 'block';
            // Reset the timer
            clearInterval(x);
            x = '';
        }

    }

    e.stopPropagation();

}

//Get and set the click events on the restart and play again buttons.
let reset = document.getElementById("restart");
let playAgain = document.getElementById("play-again");
reset.addEventListener('click', setBoard, false);
playAgain.addEventListener('click', setBoard, false);

// Set the board for play
setBoard();