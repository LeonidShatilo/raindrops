const display = document.getElementById('display');
const gameField = document.querySelector('.game-field');
const scoreBoard = document.querySelector('.score');
const wrongAnswerText = document.querySelector('.wrong-answer');
const bonusAnswerText = document.querySelector('.bonus-answer');
const wave = document.querySelector('.wave');
const wave2 = document.querySelector('.wave-2');
const gameOverBoard = document.querySelector('.game-statistic');
const description = document.querySelector('.description');
const backButton = document.getElementById('back');
const nextButton = document.getElementById('next');
const play = document.getElementById('play');

let resultArray = [];
let dropsArray = [];
let durationAnimate;
let currentScore = 0;
let baseChangeScore = 10;
let countCorrectAnswer = 0;
let countDropFallen = 0;
let healthPoints = 3;
let enteredAnswer;
let correctAnswer;
let correctBonusAnswer;
let isCorrectAnswer;
let isCorrectBonusAnswer;
let isGameOver = false;
let position = 1;
let descriptionText = {
  one: `Solve the equation in the raindrop before it reaches the
        water. Select your answer on the number pad in the game and
        click <span class="bold-word">Enter</span> or use your computer
        keyboard and press the <span class="bold-word">Enter</span> key.
        <br>
        <br>
        Be accurate — wrong answers reduce your score.`,
  two: `The green drops are bonuses! Solve the equation inside the
        green drop and all the raindrop dry up.
        <br>
        <br>
        You get 10 points for evaporating each raindrops.`,
  three: `The game is over when three raindrops reach the water level.`,
};

function showGameOverBoard() {
  gameOverBoard.classList.add('visible');
}

function hideGameOverBoard() {
  gameOverBoard.classList.remove('visible');
}

function checkTouchToWave() {
  const drop = document.querySelector('.drop');
  const bonusDrop = document.querySelector('.bonus-drop');
  const liftingHeight = 50;
  const updateFrequency = 500;
  const delayShowStatistics = 500;

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
  }
  if (bonusDropCoordinateY >= waveCoordinateY) {
    gameField.removeChild(document.querySelector('.bonus-drop'));
  }

  if (
    dropCoordinateY >= waveCoordinateY ||
    bonusDropCoordinateY >= waveCoordinateY
  ) {
    countDropFallen++;
    wave.style.height = `${wave.offsetHeight + liftingHeight}px`;
    wave2.style.height = `${wave2.offsetHeight + liftingHeight}px`;
    if (countDropFallen >= healthPoints) {
      setTimeout(() => {
        showGameOverBoard();
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

function downWave() {
  wave.style.height = `${wave.offsetHeight - 150}px`;
  wave2.style.height = `${wave2.offsetHeight - 150}px`;
}

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

function playSplashAnimation(index, elementName, splashName) {
  const timeShowDropSplash = 450;

  createSplash(index, elementName, splashName);
  setTimeout(() => {
    try {
      gameField.removeChild(document.querySelector(`.${splashName}`));
    } catch (error) {}
  }, timeShowDropSplash);
}

function changeScore() {
  const countDropsOnWindow = document.querySelectorAll('.drop').length;

  let timeShowWrongAnswerText = 600;
  let addScore = currentScore + baseChangeScore + countCorrectAnswer;
  let removeScore = currentScore - baseChangeScore - countCorrectAnswer;

  if (isCorrectAnswer || isCorrectBonusAnswer) {
    if (isCorrectAnswer) {
      currentScore = addScore;
    }
    if (isCorrectBonusAnswer) {
      currentScore = addScore + countDropsOnWindow * baseChangeScore;
      bonusAnswerText.innerHTML = `+${
        baseChangeScore +
        countCorrectAnswer +
        countDropsOnWindow * baseChangeScore
      }`;
      bonusAnswerText.classList.add('show');
      setTimeout(() => {
        bonusAnswerText.classList.remove('show');
      }, timeShowWrongAnswerText);
    }
    scoreBoard.innerHTML = currentScore;
  } else {
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

function checkAnswer() {
  const allDrops = document.querySelectorAll('.drop');
  const bonusDrop = document.querySelector('.bonus-drop');

  let index = resultArray.indexOf(Number(enteredAnswer));

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

function create(elementName, position, value1, symbolOperand, value2) {
  const thisName = elementName;
  const dropElement = document.createElement('div');
  const firstOperand = document.createElement('span');
  const operator = document.createElement('span');
  const secondOperand = document.createElement('span');

  dropElement.className = `${thisName}`;
  firstOperand.className = `operand first-operand-${thisName}`;
  operator.className = 'operator';
  secondOperand.className = `operand second-operand-${thisName}`;
  dropElement.style.left = `${position}%`;
  dropElement.append(firstOperand, operator, secondOperand);
  firstOperand.innerHTML = value1;
  operator.innerHTML = symbolOperand;
  secondOperand.innerHTML = value2;
  resultArray.push(getResult(value1, symbolOperand, value2));
  gameField.append(dropElement);
  dropsArray.push(dropElement);
  animationFallDrop(dropElement);
  checkTouchToWave();
}

function playSceneOne() {
  durationAnimate = 15000;
  create('drop', 40, 2, '+', 2);

  setTimeout(() => {
    document.getElementById('4').classList.add('active');
    display.value = 4;
    enteredAnswer = display.value;
  }, 2500);
  setTimeout(() => {
    document.getElementById('4').classList.remove('active');
  }, 2700);
  setTimeout(() => {
    document.getElementById('enter').classList.add('active');
    checkAnswer();
    display.value = '';
  }, 3700);
  setTimeout(() => {
    document.getElementById('enter').classList.remove('active');
  }, 3900);
}

function playSceneTwo() {
  durationAnimate = 20000;
  create('drop', 5, 14, '-', 7);

  setTimeout(() => {
    create('drop', 45, 4, '+', 8);
  }, 1500);
  setTimeout(() => {
    create('drop', 25, 28, '÷', 7);
  }, 3000);
  setTimeout(() => {
    create('drop', 78, 5, '×', 5);
  }, 4500);
  setTimeout(() => {
    create('bonus-drop', 60, 81, '÷', 9);
  }, 6000);
  setTimeout(() => {
    document.getElementById('9').classList.add('active');
    display.value = 9;
    enteredAnswer = display.value;
  }, 8000);
  setTimeout(() => {
    document.getElementById('9').classList.remove('active');
  }, 8200);
  setTimeout(() => {
    document.getElementById('enter').classList.add('active');
    checkAnswer();
    display.value = '';
  }, 10200);
  setTimeout(() => {
    document.getElementById('enter').classList.remove('active');
  }, 10400);
}

function playSceneThree() {
  durationAnimate = 8000;
  create('drop', 10, 7, '-', 5);

  setTimeout(() => {
    create('drop', 40, 9, '÷', 3);
  }, 1500);
  setTimeout(() => {
    create('drop', 70, 4, '×', 2);
  }, 3000);
}

function chooseDescriptionText(position) {
  if (position === 1) {
    description.innerHTML = descriptionText.one;
    backButton.classList.add('inactive');
    backButton.disabled = true;
  }
  if (position === 2) {
    description.innerHTML = descriptionText.two;
    backButton.classList.remove('inactive');
    nextButton.classList.remove('inactive');
    backButton.disabled = false;
    nextButton.disabled = false;
  }
  if (position === 3) {
    description.innerHTML = descriptionText.three;
    nextButton.classList.add('inactive');
    nextButton.disabled = true;
  }
}

function playTutorial() {
  playSceneOne();
  setTimeout(() => {
    playSceneTwo();
  }, 5400);
  setTimeout(() => {
    playSceneThree();
  }, 18000);

  setTimeout(() => {
    isGameOver = false;
    countDropFallen = 0;
    currentScore = 0;
    scoreBoard.innerHTML = '0';
    downWave();
    hideGameOverBoard();
    playTutorial();
  }, 28000);
}

backButton.addEventListener('click', () => {
  position--;
  if (position <= 1) {
    position = 1;
  }
  chooseDescriptionText(position);
});

nextButton.addEventListener('click', () => {
  position++;
  if (position >= 3) {
    position = 3;
  }
  chooseDescriptionText(position);
});

play.addEventListener('click', () => {
  document.location.href = './play.html';
});

playTutorial();
