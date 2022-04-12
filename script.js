// set up game deck and board
// player clicks draw, draws 5 cards
// display cards on the board
// 
//
//
//

// global game variables
// player start with 100 credits
let playerCredits = 100; 
// player chooses bet amount, starting at 1
let playerBet = 1;
// player's hand: 5 random cards
let playerHand = [];
// user selects cards to keep
let playerKeep = [];

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

// div to display game info in the game board
const gameInfo = document.createElement('div');
gameInfo.classList.add('game-info')
gameInfo.innerText = 'Its player 1 turn. Click to draw a card!';

// div to display cards?
const cardDisplay = document.createElement('div');
cardDisplay.classList.add('card-display');


// container to hold credits and bets
const controlsDisplay = document.createElement('div');
controlsDisplay.classList.add('controls-container');
// credit score
const creditScore = document.createElement('div');
creditScore.classList.add('credit-score');
creditScore.innerText = `${playerCredits}`

// bet controls (+) display (-)
const betControls = document.createElement('div');
betControls.classList.add('bet-controls');
const betPlus = document.createElement('button');
betPlus.classList.add('bet-button');
betPlus.innerText = "+";
const betDisplay = document.createElement('div');
betDisplay.classList.add('bet-display');
betDisplay.innerText = `${playerBet}`
const betMinus = document.createElement('button');
betMinus.classList.add('bet-button');
betMinus.innerText = "-";


// putting title into title container
titleDisplay.append(title); 
// putting controls into container
betControls.append(betMinus, betDisplay, betPlus); 
// put score and controls into container
controlsDisplay.append(creditScore, betControls); 
// put game info, card display and controls into game board
gameBoard.append(gameInfo, cardDisplay, controlsDisplay); 
// put scoring table and game board into game display area
gameDisplay.append(winningHands, gameBoard); 
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
      let cardDisplay = `${rankCounter}`;

      if (cardName === '1') {
        cardName = 'ace';
        cardDisplay = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        cardDisplay = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        cardDisplay = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        cardDisplay = 'K';
      }

      const card = {
        suit: currentSuit,
        symbol: suitSymbol,
        name: cardName,
        displayName: cardDisplay,
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

// function to output messages
const output = (message) => {
  gameInfo.innerText = message;
};

// function to draw given number of cards to given hand
const dealCards = (number, hand) => {
  for (let i = 0; i < number; i += 1) {
    hand.push(deck.pop());  
  }
}

// function to display cards and let them be clickable
const displayCards = () => {
  playerHand.forEach(element => {
    const cardElement = document.createElement('div')
    cardElement.classList.add('card');
    const topSuit = document.createElement('div');
    topSuit.innerText = `${element.suitSymbol}`;
    const midName = document.createElement('div');
    midName.innerText = `${element.displayName}`;
    const botSuit = document.createElement('div');
    botSuit.innerText = `${element.suitSymbol}`;
    cardElement.append(topSuit, midName, botSuit);
    cardElement.addEventListener('click', (e) => {
      cardSelect(e.target)
    })
  });
}

// check for winning hands
const checkWin = (hand) => {
  // function to check for winning hands
}

// setup game deck
const deck = shuffleCards(makeDeck());
// console.log(deck)

// function to run when game starts: 
const gamePlay = () => {
  // on deal
  dealCards(5,playerHand);
  console.log(playerHand)
}

// function to run when while swapping cards:
const gameSwap = () => {
  // then swap draw 5 - playerKeep.length number of cards
  dealCards(5-playerKeep.length,playerHand); 
}

gamePlay();