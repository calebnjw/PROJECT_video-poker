// X set up game deck and board
//// X display "draw" button on screen
// X user adjusts bet amount - / + buttons (min 1, max 5)
//// X at 1, - button is disabled, at 5, + button is disabled. 
// X user clicks draw
//// X deduct bet amount from player credits
// X draw 5 cards
// X display cards on the board + "redraw" button
//// X add event listener for each card to be selected / deselected
// X player selects cards to keep
// X player clicks "redraw" button
//// X cards that were not selected are swapped out for random cards
// calculate score of current hand
//// 10 types of poker hands: 
////// 1. Five of a kind    (CAN'T BE ACHIEVED, no joker in deck)
////// 2. Straight flush    (5 same suit + 5 sequential rank)
////// 3. Four of a kind    (4 same rank)
////// 4. Full house        (3 same rank + 2 same rank)
////// 5. Flush             (5 same suit)
////// 6. Straight          (5 sequential rank)
////// 7. Three of a kind   (3 same rank)
////// 8. Two Pair          (2 same rank + 2 same rank)
////// 9. One pair          (2 same rank)
////// 10. High card        (NOT WORTH SCORING?)
//// score is multiplied by bet amount
////// 
//// add win amount to player credits
// display the type of win, or loss + "play again" button

// global game variables
// game states (not necessary?)
let STATE_DEAL = "deal";
let STATE_DRAW = "draw";
let STATE_RESULT = "result";
let gameState = STATE_DEAL;

// player start with 100 credits
let playerCredits = 100;
// player chooses bet amount, starting at 1
let playerBet = 1;
// player's hand: 5 random cards
const playerHand = [];

// variables to keep track of things
let keepIndex = { // object to keep track of indices of cards to be kept / swapped
  0: false,
  1: false,
  2: false,
  3: false,
  4: false,
};
let suitTally = { // object to keep track of number of each suit in hand
};
let rankTally = { // object to keep track of number of unique ranks in hand
};

// HTML page / DOM setup:
// container to hold page elements:
const pageContainer = document.createElement('div');
pageContainer.classList.add('container');
// container to hold title
const titleDisplay = document.createElement('div');
titleDisplay.classList.add('title-container');
// title
const subtitle = document.createElement('p');
subtitle.innerText = "Caleb's Gambling House presents"
subtitle.classList.add('subtitle')
const title = document.createElement('h1');
title.innerText = "VIDEO POKER";
title.classList.add('title');

// container to hold main game
const gameDisplay = document.createElement('div');
gameDisplay.classList.add('game-container');
// display different hands
const winningHands = document.createElement('div');
winningHands.classList.add('winning-hands')
// display game board
const gameBoard = document.createElement('div');
gameBoard.classList.add('game-board');
// div to display cards on game board
const cardDisplay = document.createElement('div');
cardDisplay.classList.add('card-display');

// container to hold credits and bets
const controlsDisplay = document.createElement('div');
controlsDisplay.classList.add('controls-container');
// credit score
const creditScore = document.createElement('div');
creditScore.classList.add('credit-score');

// bet controls (+) display (-)
const betControls = document.createElement('div');
betControls.classList.add('bet-controls');
const betPlus = document.createElement('button');
betPlus.innerText = "+";
const betDisplay = document.createElement('div');
betDisplay.classList.add('bet-display');
const betMinus = document.createElement('button');
betMinus.innerText = "-";
betMinus.disabled = true;

// deal / redraw / restart button container
const gameControls = document.createElement('div');
gameControls.classList.add('game-controls')
const dealButton = document.createElement('button');
dealButton.classList.add('wide-button');
dealButton.innerText = "Deal";
const redrawButton = document.createElement('button');
redrawButton.classList.add('wide-button');
redrawButton.innerText = "Redraw";
const restartButton = document.createElement('button');
restartButton.classList.add('wide-button');
restartButton.innerText = "Restart";

// putting title into title container
titleDisplay.append(subtitle, title);
// putting controls into container
betControls.append(betMinus, betDisplay, betPlus); 
// put score and controls into container
controlsDisplay.append(creditScore, betControls, gameControls); 
// put game info, card display and controls into game board
gameBoard.append(cardDisplay); 
// put scoring table and game board into game display area
gameDisplay.append(winningHands, gameBoard); 
// put title and game display area into page container
pageContainer.append(titleDisplay, gameDisplay, controlsDisplay);
// put page container into body
document.body.append(pageContainer);

// helper functions: 
// function to make deck: 
const makeDeck = () => {
  const newDeck = [];
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    const currentSuit = suits[suitIndex];
    
    let suitSymbol;
    const suitColor = suitIndex < 2 ? 'red' : 'black';
    
    if (currentSuit === 'hearts') {
      suitSymbol = '♥️';
    } else if (currentSuit === 'diamonds') {
      suitSymbol = '♦️';
    } else if (currentSuit === 'clubs') {
      suitSymbol = '♣️';
    } else if (currentSuit === 'spades') {
      suitSymbol = '♠️';
    }
    
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      let cardName = `${rankCounter}`;
      let cardDisplayName = `${rankCounter}`;
      
      if (cardName === '1') {
        cardName = 'ace';
        cardDisplayName = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        cardDisplayName = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        cardDisplayName = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        cardDisplayName = 'K';
      }
      
      const card = {
        suit: currentSuit,
        symbol: suitSymbol,
        name: cardName,
        displayName: cardDisplayName,
        color: suitColor,
        rank: rankCounter,
      };
      
      newDeck.push(card);
    }
  }
  
  return newDeck;
};

// function to get random index
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// function to shuffle deck
const shuffleCards = (cards) => {
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    const randomIndex = getRandomIndex(cards.length);
    const randomCard = cards[randomIndex];
    const currentCard = cards[currentIndex];
    [cards[currentIndex], cards[randomIndex]] = [randomCard, currentCard];
  }
  return cards;
};

// function to draw given number of cards to given hand
const dealCards = () => {
  for (let i = 0; i < 5; i += 1) {
    playerHand.push(deck.pop());  
  }
}

const redrawCards = () => {
  for (let i = 0; i < playerHand.length; i += 1) {
    if (keepIndex[i] === false) {
      playerHand.splice(i, 1, deck.pop());
    }
  }
}


// function to update player credit and bet amounts
const updateValues = () => {
  creditScore.innerText = `Credits: ${playerCredits}`
  betDisplay.innerText = `${playerBet}`
}

// function to increase bet size
const increaseBet = () => {
  playerBet += 1;
  updateValues();
  
  if (playerBet === 1) {
    betMinus.disabled = true;
  } else if (playerBet === 5) {
    betPlus.disabled = true;
  } else {
    betMinus.disabled = false;
    betPlus.disabled = false;
  }
}

// function to decrease bet size
const decreaseBet = () => {
  playerBet -= 1;
  updateValues();
  
  if (playerBet === 1) {
    betMinus.disabled = true;
  } else if (playerBet === 5) {
    betPlus.disabled = true;
  } else {
    betMinus.disabled = false;
    betPlus.disabled = false;
  }
}

// function to display cards and let them be clickable
const displayCards = () => {
  cardDisplay.innerHTML = ''
  playerHand.forEach((element, index) => {
    const cardElement = document.createElement('div')
    cardElement.classList.add('card');
    const topSuit = document.createElement('div');
    topSuit.innerText = `${element.symbol}`;
    const midName = document.createElement('div');
    midName.innerText = `${element.displayName}`;
    const botSuit = document.createElement('div');
    botSuit.innerText = `${element.symbol}`;
    cardElement.append(topSuit, midName, botSuit);
    if (gameState === STATE_DEAL) {
      cardElement.addEventListener('click', () => {
        cardToggle(index, cardElement);
      })
    }
    cardDisplay.append(cardElement);
  });
}

const cardToggle = (i, element) => {
  if (keepIndex[i] === false) {
    keepIndex[i] = true;
    element.classList.add('selected');
    console.log("keep index:", keepIndex);
  } else {
    keepIndex[i] = false;
    element.classList.remove('selected');
    console.log("keep index:", keepIndex);
  }
}

// check for winning hands
//// 10 types of poker hands: 
////// X 1. Five of a kind    (CAN'T BE ACHIEVED, no joker in deck)
////// X 2. Straight flush    (5 same suit + 5 sequential rank)
////// X 3. Four of a kind    (4 same rank)
////// X 4. Full house        (3 same rank + 2 same rank)
////// X 5. Flush             (5 same suit)
////// X 6. Straight          (5 sequential rank)
////// 7. Three of a kind   (3 same rank)
////// X 8. Two Pair          (2 same rank + 2 same rank)
////// X 9. One pair          (2 same rank)
////// 10. High card        (NOT WORTH SCORING?)
// function to check for winning hands
const checkWin = (hand) => {
  // tally card ranks and suits
  hand.forEach((element, index) => {
    if (element.rank in rankTally) {
      rankTally[element.rank] += 1;
    } else {
      rankTally[element.rank] = 1;
    }
    
    if (element.suit in suitTally) {
      suitTally[element.suit] += 1;
    } else {
      suitTally[element.suit] = 1;
    }
    
    console.log("rank tally", rankTally);
    console.log("suit tally", suitTally);
  });

  // first check if ranks are sequential
  // hand[0] - hand[1] === hand[1] - hand[2] === hand[2] - hand[3], etc. 
  //// check suits, if any = 5      (STRAIGHT FLUSH)
  //// if not                       (STRAIGHT)

  // check ranks, if any = 4,       (FOUR OF A KIND)

  // check ranks, if any = 2,
  //// check if other = 3           (FULL HOUSE)
  //// check if other = 2           (TWO PAIR)
  //// check if rank > 10           (ONE PAIR, JACKS OR HIGHER)
  
  // check suits, if any = 5        (FLUSH)

  // check ranks, if any = 3        (THREE OF A KIND)

  for (const [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);
}
}

// setup game deck
const deck = shuffleCards(makeDeck());

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// function to run when game starts: 
const gameStart = () => {
  cardDisplay.innerHTML = "Are you ready to play with your life? <br /> Click Deal to begin!";
  
  updateValues();
  
  gameControls.append(dealButton);
}

// function to run when player clicks deal: 
const gameDeal = () => {
  dealCards();
  console.log("current player hand:", playerHand)
  displayCards();
  
  playerCredits -= playerBet;
  updateValues();

  // swap out buttons
  gameControls.removeChild(dealButton);
  gameControls.appendChild(redrawButton);
  // disable bet modifications
  betMinus.disabled = true;
  betPlus.disabled = true;

  gameState = STATE_DRAW;
}

// function to run when while swapping cards:
const gameRedraw = () => {
  // then swap draw 5 - playerKeep.length number of cards
  redrawCards();
  console.log("current player hand:", playerHand)
  displayCards();


  
  // calculate hand and winnings, then update values
  checkWin(playerHand);
  
  updateValues();

  // swap out buttons
  gameControls.removeChild(redrawButton);
  gameControls.appendChild(restartButton);

  gameState = STATE_RESULT;
}

const gameRestart = () => {
  playerBet = 1; // reset player bet value, but keep credits
  playerHand.splice(0, 5); // clear out player hand
  deck.splice(0, 52, ...shuffleCards(makeDeck())); // clear out deck, and replace with reshuffled deck using spread operator
  cardDisplay.innerHTML = "" // reset card display
  keepIndex = { // reset the values of keep index
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
  };
  suitTally = {}; // reset suit tally
  rankTally = {}; // reset rank tally
  
  // refresh contents on screen
  cardDisplay.innerHTML = "Click Deal to play again! <br /> You know you want to win more!" 
  updateValues();

  // swap out buttons
  gameControls.removeChild(restartButton);
  gameControls.appendChild(dealButton);
  // renable bet modifications
  betPlus.disabled = false;

  gameState = STATE_DEAL;
}

gameStart();





// event listeners for game buttons
betPlus.addEventListener('click', increaseBet);
betMinus.addEventListener('click', decreaseBet);
dealButton.addEventListener('click', gameDeal);
redrawButton.addEventListener('click', gameRedraw);
restartButton.addEventListener('click', gameRestart);