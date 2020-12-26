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

// Минимальное и максимальное значение для случайного положения капли
const limitPositionValue = {
  min: 1,
  max: 85,
};

// Минимальное и максимальное значение операнда в зависимости от уровня
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

// Максимальное и минимальное значение для интервала создания бонусных капель
const creationBonusDropInterval = {
  min: 34365,
  max: 62735,
};

let resultArray = []; // Массив для хранения результатов вычисления капель
let dropsArray = []; // Массив для хранения списка элементов капель
let durationAnimate = 20000; // Продолжительность анимации
let creationDropInterval = 6000; // Интервал создания капель
let currentScore = 0; // Текущее значение рейтинга
let baseChangeScore = 10; // Базовая величина изменения рейтинга
let countCorrectAnswer = 0; // Подсчёт правильных ответов
let countDrop = 1; // Подсчёт созданных капель
let countDropFallen = 0; // Подсчёт упавших в море капель
let healthPoints = 3; // Количество очков здоровья
let enteredAnswer; // Введённый ответ
let correctAnswer; // Правильный ответ
let correctBonusAnswer; // Правильный бонусный ответ
let isSoundOn = true; // Флаг для определения, должны ли проигрываться фоновые звуки
let isCorrectAnswer; // Флаг для определения корректности ответа
let isCorrectBonusAnswer; // Флаг для определения корректности бонусного ответа
let isGameOver = false; // Флаг для определения завершения игры

// Функция для изменения скорости падения капли
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

// Функция для изменения рейтинга
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

// Функция для запуска анимации брызг
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

// Функция для получения лучшего рейтинга
function getBestScore() {
  if (localStorage.getItem('best-score') === null) {
    bestScoreBoard.textContent = 0;
  } else {
    bestScoreBoard.textContent = localStorage.getItem('best-score');
  }
}

// Функция для установки лучшего рейтинга
function setBestScore() {
  if (currentScore > Number(localStorage.getItem('best-score'))) {
    localStorage.setItem('best-score', currentScore);
  }
}

// Функция для проверки введённого ответа
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

// Функция для обновления значения на дисплее
function updateDisplay(number) {
  if (display.value.length < 4) {
    if (display.value == 0) {
      display.value = number;
    } else {
      display.value += number;
    }
  }
}

// Функция для очистки дисплея
function clearDisplay() {
  display.value = '';
}

// Функция для удаления последней цифры на дисплее
function deleteDigit() {
  display.value = display.value.slice(0, display.value.length - 1);
}

// Функция для сохранения значения введённого результата
function enterAnswer() {
  if (display.value !== '') {
    enteredAnswer = display.value;
    clearDisplay();
    checkAnswer();
  }
}

// Функция для ввода и обработки операций
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

// Вешаем событие на обёртку клавиатуры и узнаём, на какую именно кнопку нажали
keyboard.onclick = function (event) {
  let number = event.target.getAttribute('data-number');
  let operation = event.target.getAttribute('data-operation');

  if (number) {
    updateDisplay(number);
  } else if (operation) {
    enterOperation(operation);
  }
};

// Функция для использования цифрового блока на физической клавиатуре
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

// Функция для получения рандомного значения с учётом принимаемого диапазона
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Функция для появления капли из случайного места по горизонтали
function setRandomDropPosition(
  min = limitPositionValue.min,
  max = limitPositionValue.max
) {
  return getRandomValue(min, max);
}

// Функция для установки случайного значения оператора
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

// Функция для получения результата вычисления
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

// Функция для установки операндов и оператора в зависимости от значений операндов
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

// Функция для установки рандомного времени создания бонусных капель
function setRandomTimeCreateBonusDrop(
  min = creationBonusDropInterval.min,
  max = creationBonusDropInterval.max
) {
  return getRandomValue(min, max);
}

// Функция для заполнения капли операндами и оператором
function fillDropValues(firstOperand, operator, secondOperand) {
  const values = setOperandsAndOperator();

  let firstValue = values[0];
  let operatorSymbol = values[1];
  let secondValue = values[2];

  firstOperand.innerHTML = firstValue;
  operator.innerHTML = operatorSymbol;
  secondOperand.innerHTML = secondValue;
}

// Функция для подсчёта и показа игровой статистики
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

// Функция для анимации падения капли
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

// Функция для создания брызг
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

// Функция для проверки касания волны
function checkTouchToWave() {
  const drop = document.querySelector('.drop');
  const bonusDrop = document.querySelector('.bonus-drop');
  const liftingHeight = 50; // Высота подъёма воды
  const updateFrequency = 500; // Частота обновления координат
  const delayShowStatistics = 500; // Задержка перед отображением статистики

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

// Функция для создания элемента капли в зависимости от принимаемого имени
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

// Функция для запуска игры
function startGame() {
  playSound(); // Включаем фоновый звук
  getBestScore(); // Получаем лучший результат перед стартом
  currentScore = 0; // Устанавливаем значение текущего рейтинга равным нулю
  create('drop'); // Запускаем создание капель
  setTimeout(() => {
    if (isGameOver) {
      return;
    }
    create('bonus-drop'); // Запускаем создание бонусных капель
  }, setRandomTimeCreateBonusDrop());
}

// Функция для запуска проигрывания фоновых звуков
function playSound() {
  rainSound.play();
  seaSound.play();
}

// Функция для остановки проигрывания фоновых звуков
function pauseSound() {
  rainSound.pause();
  seaSound.pause();
}

// Вешаем на кнопку звука обработчик события
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

// Включаем полноэкранный режим при нажатии на соответствующую кнопку
fullscreenButton.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    gameContainer.requestFullscreen();
  }
});

// Слушаем нажатие на физическую клавиатуру
window.addEventListener('keydown', useNumpad);

startGame(); // Запуск игры
