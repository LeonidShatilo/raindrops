const display = document.getElementById('display');
const keyboard = document.querySelector('.wrapper-keyboard');
const gameField = document.querySelector('.game-field');
const scoreBoard = document.querySelector('.score');
const bestScoreBoard = document.querySelector('.best-score');
const wrongAnswerText = document.querySelector('.wrong-answer');
const wave = document.querySelector('.wave');
const wave2 = document.querySelector('.wave-2');
const soundButton = document.getElementById('sound');
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
  min: 0,
  max: 85,
};

// Минимальное и максимальное значение операнда
const limitOperandValue = {
  min: 1,
  max: 15,
};

const creationDropInterval = 5000; // Интервал создания капель

// Максимальное и минимальное значение для интервала создания бонусных капель
const creationBonusDropInterval = {
  min: 25365,
  max: 45735,
};

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

// Функция для изменения рейтинга
function changeScore() {
  let timeShowWrongAnswerText = 600;
  let addScore = currentScore + baseChangeScore + countCorrectAnswer;
  let removeScore = currentScore - baseChangeScore - countCorrectAnswer;

  if (isCorrectAnswer || isCorrectBonusAnswer) {
    if (isCorrectAnswer) {
      correctAnswerSound.currentTime = 0;
      correctAnswerSound.play();
    }
    if (isCorrectBonusAnswer) {
      correctBonusAnswerSound.currentTime = 0;
      correctBonusAnswerSound.play();
    }
    currentScore = addScore;
    scoreBoard.innerHTML = currentScore;
    countCorrectAnswer++;
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
function playSplashAnimation(elementName, splashName) {
  let timeShowDropSplash = 450;

  createSplash(elementName, splashName);
  popDropSound.currentTime = 0;
  popDropSound.play();
  setTimeout(() => {
    gameField.removeChild(document.querySelector(`.${splashName}`));
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
  const drop = document.querySelector('.drop');
  const allDrops = document.querySelectorAll('.drop');
  const bonusDrop = document.querySelector('.bonus-drop');
  const firstOperandDrop = document.querySelector('.first-operand-drop');
  const secondOperandDrop = document.querySelector('.second-operand-drop');
  const operator = document.querySelector('.operator');
  const firstOperandBonusDrop = document.querySelector(
    '.first-operand-bonus-drop'
  );
  const secondOperandBonusDrop = document.querySelector(
    '.second-operand-bonus-drop'
  );

  let firstValue;
  let secondValue;
  let operatorSymbol;
  let firstBonusValue;
  let secondBonusValue;

  try {
    firstValue = Number(firstOperandDrop.textContent);
    secondValue = Number(secondOperandDrop.textContent);
    operatorSymbol = operator.textContent;
    firstBonusValue = Number(firstOperandBonusDrop.textContent);
    secondBonusValue = Number(secondOperandBonusDrop.textContent);
  } catch (error) {}

  switch (operatorSymbol) {
    case '+':
      correctAnswer = firstValue + secondValue;
      correctBonusAnswer = firstBonusValue + secondBonusValue;
      break;
    case '-':
      correctAnswer = firstValue - secondValue;
      correctBonusAnswer = firstBonusValue - secondBonusValue;
      break;
    case '×':
      correctAnswer = firstValue * secondValue;
      correctBonusAnswer = firstBonusValue * secondBonusValue;
      break;
    case '÷':
      correctAnswer = firstValue / secondValue;
      correctBonusAnswer = firstBonusValue / secondBonusValue;
      break;
  }

  isCorrectAnswer = enteredAnswer == correctAnswer;
  isCorrectBonusAnswer = enteredAnswer == correctBonusAnswer;

  if (isCorrectBonusAnswer) {
    playSplashAnimation('bonus-drop', 'bonus-drop-splash');
    gameField.removeChild(bonusDrop);
    allDrops.forEach((allDrops) => {
      playSplashAnimation('drop', 'drop-splash');
      gameField.removeChild(allDrops);
    });
    changeScore();
    return;
  } else if (isCorrectAnswer) {
    playSplashAnimation('drop', 'drop-splash');
    gameField.removeChild(drop);
  }
  changeScore();
}

// Функция для обновления значения на дисплее
function updateDisplay(number) {
  if (display.value.length < 3) {
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
  if (display.value.length < 3) {
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
function setRandomOperandValue(
  min = limitOperandValue.min,
  max = limitOperandValue.max
) {
  return getRandomValue(min, max);
}

// Функция для установки операндов и оператора в зависимости от значений операндов
function setOperandsAndOperator() {
  const arrayValues = [];
  let firstOperand = setRandomOperandValue();
  let secondOperand = setRandomOperandValue();
  let operatorSymbol;

  if (
    firstOperand % secondOperand === 0 &&
    firstOperand / secondOperand !== 1 &&
    secondOperand > 1
  ) {
    operatorSymbol = '÷';
  } else if (
    firstOperand > 2 &&
    secondOperand >= 2 &&
    secondOperand <= 10 &&
    firstOperand * secondOperand <= 90
  ) {
    operatorSymbol = '×';
  } else if (firstOperand > secondOperand) {
    operatorSymbol = '-';
  } else if (firstOperand < secondOperand) {
    operatorSymbol = '+';
  } else {
    operatorSymbol = '+';
  }

  arrayValues.push(firstOperand);
  arrayValues.push(operatorSymbol);
  arrayValues.push(secondOperand);

  return arrayValues;
}

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
  const duration = 20000; // Продолжительность анимации

  dropElement.animate(
    [
      {
        top: 0,
      },
      {
        top: `${gameField.offsetHeight}px`,
      },
    ],
    duration
  );
}

// Функция для создания брызг
function createSplash(elementName, splashName) {
  const thisElementName = document.querySelector(`.${elementName}`);
  const thisSplashName = splashName;

  let offsetTopСorrection = 50;
  let offsetLeftСorrection = 10;
  let imageSplash = new Image(80, 80);

  imageSplash.src = `/raindrops/assets/images/svg/${thisSplashName}.svg`;
  imageSplash.className = `${thisSplashName}`;
  imageSplash.style.top = `${
    thisElementName.offsetTop + offsetTopСorrection
  }px`;
  imageSplash.style.left = `${
    thisElementName.offsetLeft + offsetLeftСorrection
  }px`;
  gameField.append(imageSplash);
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

// Функция для создания элемента капли в зависимости от получаемого имени
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

// Слушаем нажатие на физическую клавиатуру
window.addEventListener('keydown', useNumpad);

startGame(); // Запуск игры
