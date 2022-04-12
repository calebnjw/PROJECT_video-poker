// X set up game deck and board
//// X display "draw" button on screen
// user adjusts bet amount - / + buttons (min 1, max 5)
//// at 1, - button is disabled, at 5, + button is disabled. 
// X user clicks draw
//// deduct bet amount from player credits
// X draw 5 cards
// X display cards on the board + "redraw" button
//// X add event listener for each card to be selected / deselected
// X player selects cards to keep
// X player clicks "redraw" button
//// X cards that were not selected are swapped out for random cards
// calculate score of current hand
//// score is multiplied by bet amount
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
let playerHand = [];

// variables to keep track of things
let keepIndex = { // object to keep track of indices of cards to be kept / swapped
  0: false,
  1: false,
  2: false,
  3: false,
  4: false,
}

// HTML page / DOM setup:
// container to hold page elements:
const pageContainer = document.createElement('div');
pageContainer.classList.add('container');
// container to hold title
const titleDisplay = document.createElement('div');
titleDisplay.classList.add('title-container');
// title
const title = document.createElement('h1');
title.innerText = 'Video Poker Game Thing';
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
dealButton.innerText = "Deal";
const redrawButton = document.createElement('button');
redrawButton.innerText = "Redraw";
const restartButton = document.createElement('button');
restartButton.innerText = "Restart";

// putting title into title container
titleDisplay.append(title); 
// putting controls into container
betControls.append(betMinus, betDisplay, betPlus); 
// put score and controls into container
controlsDisplay.append(creditScore, betControls, gameControls); 
// put game info, card display and controls into game board
gameBoard.append(cardDisplay, controlsDisplay); 
// put scoring table and game board into game display area
gameDisplay.append(gameBoard, winningHands); 
// put title and game display area into page container
pageContainer.append(titleDisplay, gameDisplay);
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

const updateValues = () => {
  creditScore.innerText = `Credits: ${playerCredits}`
  betDisplay.innerText = `${playerBet}`
}

// function to output messages
const output = (message) => {
  gameInfo.innerText = message;
};

// function to draw given number of cards to given hand
const dealCards = () => {
  for (let i = 0; i < 5; i += 1) {
    playerHand.push(deck.pop());  
  }
}


const betModify = (direction) => {
  if (direction === "up") {
    playerBet += 1;
    betDisplay.innerText = playerBet;
  } 
  if (direction === "down") {
    playerBet -= 1;
    betDisplay.innerText = playerBet;
  }
  
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
    cardElement.addEventListener('click', () => {
      cardToggle(index, cardElement);
    })
    cardDisplay.append(cardElement);
  });
}

const cardToggle = (i, element) => {
  if (keepIndex[i] === false) {
    keepIndex[i] = true;
    element.classList.add('selected');
    console.log(keepIndex);
  } else {
    keepIndex[i] = false;
    element.classList.remove('selected');
    console.log(keepIndex);
  }
}

// check for winning hands
const checkWin = (hand) => {
  // function to check for winning hands
}

// setup game deck
const deck = shuffleCards(makeDeck());
// console.log(deck)

// function to run when game starts: 
const gameStart = () => {
  const welcomeText = document.createElement('div');
  welcomeText.innerText = "Are you ready to play with your life? Click Deal to begin!";
  
  updateValues();
  
  cardDisplay.append(welcomeText);
  gameControls.append(dealButton);
}

const gameDeal = () => {
  // on deal
  dealCards();
  console.log(playerHand)
  
  playerCredits -= playerBet;
  updateValues();
  
  displayCards();

  gameControls.removeChild(dealButton);
  gameControls.appendChild(redrawButton);
}

// function to run when while swapping cards:
const gameRedraw = () => {
  // then swap draw 5 - playerKeep.length number of cards
  for (let i = 0; i < playerHand.length; i += 1) {
    if (keepIndex[i] === false) {
      playerHand.splice(i, 1, deck.pop())
    }
  }
  displayCards();

  gameControls.removeChild(redrawButton);
  gameControls.appendChild(restartButton);
}

const gameRestart = () => {

}

gameStart();

betPlus.addEventListener('click', () => {
  betModify("up")
})
betMinus.addEventListener('click', () => {
  betModify("down")
})

dealButton.addEventListener('click', gameDeal);
redrawButton.addEventListener('click', gameRedraw)
restartButton.addEventListener('click', gameRestart)