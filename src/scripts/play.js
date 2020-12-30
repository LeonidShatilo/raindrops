const gameContainer = document.querySelector('.game-container');
const display = document.getElementById('display');
const keyboard = document.querySelector('.wrapper-keyboard');
const gameField = document.querySelector('.game-field');
const scoreBoard = document.querySelector('.score');
const bestScoreBoard = document.querySelector('.best-score');
const wrongAnswerText = document.querySelector('.wrong-answer');
const bonusAnswerText = document.querySelector('.bonus-answer');
const wave = document.querySelector('.wave');
const wave2 = document.querySelector('.wave-2');
const soundButton = document.getElementById('sound');
const fullscreenButton = document.getElementById('fullscreen');
const rainSound = document.querySelector('.rain-sound');
const seaSound = document.querySelector('.sea-sound');
const correctAnswerSound = document.querySelector('.correct-answer-sound');
const correctBonusAnswerSound = document.querySelector('.correct-bonus-answer-sound');
const wrongAnswerSound = document.querySelector('.wrong-answer-sound');
const fallInSeaSound = document.querySelector('.fall-in-sea-sound');
const popDropSound = document.querySelector('.pop-drop-sound');
const gameOverSound = document.querySelector('.game-over-sound');
const gameStatistic = document.querySelector('.game-statistic');
const scorePoints = document.querySelector('.score-points');
const totalEquations = document.querySelector('.total-equations');
const equationsPerMinute = document.querySelector('.equations-per-minute');
const overall = document.querySelector('.overall');

// Minimum and maximum values for random drop position
const limitPositionValue = {
  min: 1,
  max: 85,
};

// Minimum and maximum operand value depending on the level
const limitOperandValue = {
  level1: {
    min: 1,
    max: 10,
  },
  level2: {
    min: 2,
    max: 20,
  },
  level3: {
    min: 4,
    max: 30,
  },
  level4: {
    min: 6,
    max: 40,
  },
  level5: {
    min: 8,
    max: 60,
  },
};

// Maximum and minimum value for the interval of bonus drops creation
const creationBonusDropInterval = {
  min: 34365,
  max: 62735,
};

let resultArray = []; // Array for storing the results of calculation of drops
let dropsArray = []; // Array for storing the list of drop items
let durationAnimate = 20000; // Animation duration
let creationDropInterval = 6000; // Drop creation interval
let currentScore = 0; // Current score value
let baseChangeScore = 10; // The base value of the score change
let countCorrectAnswer = 0; // Counting correct answers
let countDrop = 1; // Counting the created drops
let countDropFallen = 0; // Counting the drops that have fallen into the sea
let healthPoints = 3; // Amount of health points
let enteredAnswer; // Entered answer
let correctAnswer; // Correct answer
let correctBonusAnswer; // Correct bonus answer
let isSoundOn = true; // Flag to determine whether background sounds are to be played
let isCorrectAnswer; // Flag to determine the correctness of the answer
let isCorrectBonusAnswer; // Flag to determine the correctness of the bonus answer
let isGameOver = false; // Flag to determine the end of the game

// Function for changing the fall speed of the raindrop
function changeDropFallSpeed() {
  durationAnimate -= 250;
  creationDropInterval -= 70;

  if (durationAnimate <= 4000) {
    durationAnimate = 4000;
  }
  if (creationDropInterval <= 3000) {
    creationDropInterval = 3000;
  }
}

// Function to change the score
function changeScore() {
  const countDropsOnWindow = document.querySelectorAll('.drop').length;

  let timeShowWrongAnswerText = 600;
  let addScore = currentScore + baseChangeScore + countCorrectAnswer;
  let removeScore = currentScore - baseChangeScore - countCorrectAnswer;

  if (isCorrectAnswer || isCorrectBonusAnswer) {
    if (isCorrectAnswer) {
      correctAnswerSound.currentTime = 0;
      correctAnswerSound.play();
      currentScore = addScore;
    }
    if (isCorrectBonusAnswer) {
      correctBonusAnswerSound.currentTime = 0;
      correctBonusAnswerSound.play();
      currentScore = addScore + countDropsOnWindow * baseChangeScore;
      bonusAnswerText.innerHTML = `+${
        baseChangeScore + countCorrectAnswer +
        countDropsOnWindow * baseChangeScore
      }`;
      bonusAnswerText.classList.add('show');
      setTimeout(() => {
        bonusAnswerText.classList.remove('show');
      }, timeShowWrongAnswerText);
    }
    scoreBoard.innerHTML = currentScore;
    countCorrectAnswer++;
    changeDropFallSpeed();
  } else {
    wrongAnswerSound.currentTime = 0;
    wrongAnswerSound.play();
    if (removeScore > 0) {
      currentScore = removeScore;
    } else {
      currentScore = 0;
    }
    scoreBoard.innerHTML = currentScore;
    wrongAnswerText.innerHTML = -baseChangeScore - countCorrectAnswer;
    wrongAnswerText.classList.add('show');
    setTimeout(() => {
      wrongAnswerText.classList.remove('show');
    }, timeShowWrongAnswerText);
  }
}

// Function for running the splash animation
function playSplashAnimation(index, elementName, splashName) {
  const timeShowDropSplash = 450;

  createSplash(index, elementName, splashName);
  popDropSound.currentTime = 0;
  popDropSound.play();
  setTimeout(() => {
    try {
      gameField.removeChild(document.querySelector(`.${splashName}`));
    } catch (error) {}
  }, timeShowDropSplash);
}

// Function to get a best score
function getBestScore() {
  if (localStorage.getItem('best-score') === null) {
    bestScoreBoard.textContent = 0;
  } else {
    bestScoreBoard.textContent = localStorage.getItem('best-score');
  }
}

// Function to set the best score
function setBestScore() {
  if (currentScore > Number(localStorage.getItem('best-score'))) {
    localStorage.setItem('best-score', currentScore);
  }
}

// Function for checking the entered answer
function checkAnswer() {
  const allDrops = document.querySelectorAll('.drop');
  const bonusDrop = document.querySelector('.bonus-drop');

  let index = resultArray.indexOf(Number(enteredAnswer));

  if (resultArray.length === 0) {
    return;
  }
  if (index !== -1) {
    if (dropsArray[index].classList.contains('bonus-drop')) {
      isCorrectBonusAnswer = true;
      changeScore();
      playSplashAnimation(index, 'bonus-drop', 'bonus-drop-splash');
      for (let i = 0; i < dropsArray.length; i++) {
        playSplashAnimation(i, 'drop', 'drop-splash');
      }
      gameField.removeChild(bonusDrop);
      allDrops.forEach((allDrops) => {
        gameField.removeChild(allDrops);
      });
      dropsArray.splice(0, dropsArray.length);
      resultArray.splice(0, resultArray.length);
    } else if (dropsArray[index].classList.contains('drop')) {
      isCorrectAnswer = true;
      changeScore();
      playSplashAnimation(index, 'drop', 'drop-splash');
      dropsArray[index].remove();
      resultArray.splice(index, 1);
      dropsArray.splice(index, 1);
    }
  } else {
    changeScore();
  }

  isCorrectBonusAnswer = false;
  isCorrectAnswer = false;
}

// Function to update the value on the display
function updateDisplay(number) {
  if (display.value.length < 4) {
    if (display.value == 0) {
      display.value = number;
    } else {
      display.value += number;
    }
  }
}

// Function for cleaning the display
function clearDisplay() {
  display.value = '';
}

// Function for deleting the last digit on the display
function deleteDigit() {
  display.value = display.value.slice(0, display.value.length - 1);
}

// Function for saving the value of the entered answer
function enterAnswer() {
  if (display.value !== '') {
    enteredAnswer = display.value;
    clearDisplay();
    checkAnswer();
  }
}

// Function for entering and processing operations
function enterOperation(operation) {
  switch (operation) {
    case 'clear':
      clearDisplay();
      break;
    case 'delete':
      deleteDigit();
      break;
    case 'enter':
      enterAnswer();
      break;
  }
}

// Hang the event on the keyboard wrapper and find out which button was pressed
keyboard.onclick = function (event) {
  let number = event.target.getAttribute('data-number');
  let operation = event.target.getAttribute('data-operation');

  if (number) {
    updateDisplay(number);
  } else if (operation) {
    enterOperation(operation);
  }
};

// Function for using the number block on the physical keyboard
function useNumpad(event) {
  if (display.value.length < 4) {
    switch (event.code) {
      case 'Numpad0':
        if (display.value == 0) {
          display.value = 0;
        } else {
          display.value += 0;
        }
        break;
      case 'Numpad1':
        if (display.value == 0) {
          display.value = 1;
        } else {
          display.value += 1;
        }
        break;
      case 'Numpad2':
        if (display.value == 0) {
          display.value = 2;
        } else {
          display.value += 2;
        }
        break;
      case 'Numpad3':
        if (display.value == 0) {
          display.value = 3;
        } else {
          display.value += 3;
        }
        break;
      case 'Numpad4':
        if (display.value == 0) {
          display.value = 4;
        } else {
          display.value += 4;
        }
        break;
      case 'Numpad5':
        if (display.value == 0) {
          display.value = 5;
        } else {
          display.value += 5;
        }
        break;
      case 'Numpad6':
        if (display.value == 0) {
          display.value = 6;
        } else {
          display.value += 6;
        }
        break;
      case 'Numpad7':
        if (display.value == 0) {
          display.value = 7;
        } else {
          display.value += 7;
        }
        break;
      case 'Numpad8':
        if (display.value == 0) {
          display.value = 8;
        } else {
          display.value += 8;
        }
        break;
      case 'Numpad9':
        if (display.value == 0) {
          display.value = 9;
        } else {
          display.value += 9;
        }
        break;
    }
  }
  switch (event.code) {
    case 'Backspace':
      clearDisplay();
      break;
    case 'NumpadDecimal':
      deleteDigit();
      break;
    case 'NumpadEnter':
      enterAnswer();
  }
}

// Function for getting a random value, taking into account the received range
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function for the appearance of a drop from a random location horizontally
function setRandomDropPosition(
  min = limitPositionValue.min,
  max = limitPositionValue.max
) {
  return getRandomValue(min, max);
}

// Function for setting a random operator value
function setRandomOperandValue() {
  let min;
  let max;

  if (countCorrectAnswer >= 0 && countCorrectAnswer < 50) {
    min = limitOperandValue.level1.min;
    max = limitOperandValue.level1.max;
  } else if (countCorrectAnswer >= 50 && countCorrectAnswer < 100) {
    min = limitOperandValue.level2.min;
    max = limitOperandValue.level2.max;
  } else if (countCorrectAnswer >= 100 && countCorrectAnswer < 150) {
    min = limitOperandValue.level3.min;
    max = limitOperandValue.level3.max;
  } else if (countCorrectAnswer >= 150 && countCorrectAnswer < 200) {
    min = limitOperandValue.level4.min;
    max = limitOperandValue.level4.max;
  } else {
    min = limitOperandValue.level5.min;
    max = limitOperandValue.level5.max;
  }

  return getRandomValue(min, max);
}

// Function for getting the result of the calculation
function getResult(firstOperand, operator, secondOperand) {
  switch (operator) {
    case '+':
      return firstOperand + secondOperand;
    case '-':
      return firstOperand - secondOperand;
    case '×':
      return firstOperand * secondOperand;
    case '÷':
      return firstOperand / secondOperand;
  }
}

// Function for setting operands and operator depending on operand values
function setOperandsAndOperator() {
  const firstOperand = setRandomOperandValue();
  const secondOperand = setRandomOperandValue();

  let arrayValues = [];
  let operatorSymbol;

  if (firstOperand > secondOperand) {
    if (
      firstOperand % secondOperand === 0 &&
      firstOperand / secondOperand !== 1 &&
      secondOperand > 1
    ) {
      operatorSymbol = '÷';
    } else if (firstOperand >= 2 && secondOperand >= 2) {
      operatorSymbol = '×';
    } else {
      operatorSymbol = '-';
    }
  } else {
    operatorSymbol = '+';
  }

  arrayValues.push(firstOperand);
  arrayValues.push(operatorSymbol);
  arrayValues.push(secondOperand);
  resultArray.push(getResult(firstOperand, operatorSymbol, secondOperand));

  return arrayValues;
}

// Function for setting random creation time of bonus drops
function setRandomTimeCreateBonusDrop(
  min = creationBonusDropInterval.min,
  max = creationBonusDropInterval.max
) {
  return getRandomValue(min, max);
}

// Function for filling a drop with operands and operator
function fillDropValues(firstOperand, operator, secondOperand) {
  const values = setOperandsAndOperator();

  let firstValue = values[0];
  let operatorSymbol = values[1];
  let secondValue = values[2];

  firstOperand.innerHTML = firstValue;
  operator.innerHTML = operatorSymbol;
  secondOperand.innerHTML = secondValue;
}

// Function for calculating and displaying game statistics
function showGameStatistics() {
  const convertMsToMin = 60000;
  const convertToPercent = 100;

  equationsPerMinute.innerHTML = Math.round(
    countCorrectAnswer / (performance.now() / convertMsToMin)
  );
  totalEquations.innerHTML = countCorrectAnswer;
  overall.innerHTML = `${Math.ceil(
    (countCorrectAnswer / countDrop) * convertToPercent
  )}%`;
  scorePoints.innerHTML = currentScore;

  gameStatistic.classList.add('visible');
  pauseSound();
  gameOverSound.play();
  setBestScore();
}

// Function for animating the fall of a raindrop
function animationFallDrop(dropElement) {
  dropElement.animate(
    [
      {
        top: 0,
      },
      {
        top: `${gameField.offsetHeight}px`,
      },
    ],
    durationAnimate
  );
}

// Function for creating a splash
function createSplash(index, elementName, splashName) {
  const thisSplashName = splashName;
  const offsetTopСorrection = 50;
  const offsetLeftСorrection = 10;
  const imageSplash = new Image(80, 80);

  let thisElementName;
  let thisItem;

  imageSplash.src = `/raindrops/assets/images/svg/${thisSplashName}.svg`;
  imageSplash.className = `${thisSplashName}`;

  try {
    if (elementName === 'drop') {
      thisElementName = document.querySelectorAll(`.${elementName}`);
      thisItem = thisElementName[index];
      imageSplash.style.top = `${thisItem.offsetTop + offsetTopСorrection}px`;
      imageSplash.style.left = `${
        thisItem.offsetLeft + offsetLeftСorrection
      }px`;
      gameField.append(imageSplash);
    }
  } catch (error) {}
  try {
    if (elementName === 'bonus-drop') {
      thisElementName = document.querySelector(`.${elementName}`);
      imageSplash.style.top = `${
        thisElementName.offsetTop + offsetTopСorrection
      }px`;
      imageSplash.style.left = `${
        thisElementName.offsetLeft + offsetLeftСorrection
      }px`;
      gameField.append(imageSplash);
    }
  } catch (error) {}
}

// Function for checking the wave touch
function checkTouchToWave() {
  const drop = document.querySelector('.drop');
  const bonusDrop = document.querySelector('.bonus-drop');
  const liftWaveCoefficient = 0.25; // Wave lift coefficient
  const updateFrequency = 500; // Frequency of coordinate update
  const delayShowStatistics = 500; // Delay before statistics are displayed

  let dropCoordinateY;
  let bonusDropCoordinateY;
  let waveCoordinateY = wave.offsetTop;

  try {
    dropCoordinateY = drop.offsetTop + drop.offsetHeight;
  } catch (error) {}
  try {
    bonusDropCoordinateY = bonusDrop.offsetTop + bonusDrop.offsetHeight;
  } catch (error) {}

  if (dropCoordinateY >= waveCoordinateY) {
    gameField.removeChild(document.querySelector('.drop'));
    resultArray.splice(0, 1);
    dropsArray.splice(0, 1);
  }
  if (bonusDropCoordinateY >= waveCoordinateY) {
    gameField.removeChild(document.querySelector('.bonus-drop'));
    resultArray.splice(0, 1);
    dropsArray.splice(0, 1);
  }

  if (
    dropCoordinateY >= waveCoordinateY ||
    bonusDropCoordinateY >= waveCoordinateY
  ) {
    countDropFallen++;
    wave.style.height = `${
      wave.offsetHeight + wave.offsetHeight * liftWaveCoefficient
    }px`;
    wave2.style.height = `${
      wave2.offsetHeight + wave2.offsetHeight * liftWaveCoefficient
    }px`;
    fallInSeaSound.currentTime = 0;
    fallInSeaSound.play();
    if (countDropFallen >= healthPoints) {
      setTimeout(() => {
        showGameStatistics();
        isGameOver = true;
        document
          .querySelectorAll('.drop')
          .forEach(() =>
            gameField.removeChild(document.querySelector('.drop'))
          );
      }, delayShowStatistics);
    }
  }

  setTimeout(() => {
    if (isGameOver) {
      return;
    }
    try {
      checkTouchToWave();
    } catch (error) {
      return;
    }
  }, updateFrequency);
}

// Function for creating a drop item depending on the received name
function create(ElementName) {
  const thisName = ElementName;
  const dropElement = document.createElement('div');
  const firstOperand = document.createElement('span');
  const operator = document.createElement('span');
  const secondOperand = document.createElement('span');

  dropElement.className = `${thisName}`;
  firstOperand.className = `operand first-operand-${thisName}`;
  operator.className = 'operator';
  secondOperand.className = `operand second-operand-${thisName}`;
  dropElement.style.left = `${setRandomDropPosition()}%`;
  dropElement.append(firstOperand, operator, secondOperand);
  fillDropValues(firstOperand, operator, secondOperand);
  gameField.append(dropElement);
  dropsArray.push(dropElement);
  animationFallDrop(dropElement);
  checkTouchToWave();

  if (thisName === 'drop') {
    setTimeout(() => {
      if (isGameOver) {
        return;
      }
      create(thisName);
      countDrop++;
    }, creationDropInterval);
  }
  if (thisName === 'bonus-drop') {
    setTimeout(() => {
      if (isGameOver) {
        return;
      }
      create(thisName);
      countDrop++;
    }, setRandomTimeCreateBonusDrop());
  }
}

// Function to start the game
function startGame() {
  playSound(); // Turning on the background sound
  getBestScore(); // Getting the best score before the start
  currentScore = 0; // Set the value of the current rating to zero
  create('drop'); // Starting the creation of raindrops
  setTimeout(() => {
    if (isGameOver) {
      return;
    }
    create('bonus-drop'); // Starting the creation of bonus raindrops
  }, setRandomTimeCreateBonusDrop());
}

// Function to start playing background sounds
function playSound() {
  rainSound.play();
  seaSound.play();
}

// Function for stopping the playback of background sounds
function pauseSound() {
  rainSound.pause();
  seaSound.pause();
}

// Hang an event handler on the sound button
soundButton.addEventListener('click', () => {
  isSoundOn = !isSoundOn;

  if (isSoundOn) {
    playSound();
    soundButton.classList.toggle('sound-off');
  } else {
    pauseSound();
    soundButton.classList.toggle('sound-off');
  }
});

// Enable fullscreen mode by pressing the corresponding button
fullscreenButton.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    gameContainer.requestFullscreen();
  }
});

// Listening to the press of the physical keyboard
window.addEventListener('keydown', useNumpad);

startGame(); // Running the game
