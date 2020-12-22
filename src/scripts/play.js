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
const wrongAnswerSound = document.querySelector('.wrong-answer-sound');
const fallInSeaSound = document.querySelector('.fall-in-sea-sound');
const popDropSound = document.querySelector('.pop-drop-sound');

const animationDuration = 17000; // Продолжительность анимации

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

let currentScore = 0; // Текущее значение рейтинга
let savedScore = 0; // Сохранённое значение рейтинга
let baseChangeScore = 10; // Базовая величина изменения рейтинга
let countCorrectAnswer = 0; // Подсчёт правильных ответов
let countDropFallen = 0; // Подсчёт упавших в море капель
let healthPoints = 3; // Количество очков здоровья
let enteredAnswer; // Введённый ответ
let correctAnswer; // Правильный ответ
let isSoundOn = true; // Флаг для определения, должны ли проигрываться фоновые звуки
let isCorrectAnswer; // Флаг для определения корректности ответа
let isGameOver = false; // Флаг для определения завершения игры

// Функция для изменения рейтинга
function changeScore() {
  let timeShowWrongAnswerText = 600;
  let addScore = currentScore + baseChangeScore + countCorrectAnswer;
  let removeScore = currentScore - baseChangeScore - countCorrectAnswer;

  if (isCorrectAnswer) {
    correctAnswerSound.currentTime = 0;
    correctAnswerSound.play();
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
function playSplashAnimation() {
  let timeShowDropSplash = 450;

  createSplash();
  popDropSound.currentTime = 0;
  popDropSound.play();
  setTimeout(() => {
    gameField.removeChild(document.querySelector('.splash'));
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
  if (savedScore > Number(localStorage.getItem('best-score'))) {
    localStorage.setItem('best-score', savedScore);
  }
}

// Функция для проверки введённого ответа
function checkAnswer() {
  const drop = document.querySelector('.drop');
  const firstOperand = document.querySelector('.first-operand');
  const operator = document.querySelector('.operator');
  const secondOperand = document.querySelector('.second-operand');

  let firstValue = Number(firstOperand.textContent);
  let operatorSymbol = operator.textContent;
  let secondValue = Number(secondOperand.textContent);

  switch (operatorSymbol) {
    case '+':
      correctAnswer = firstValue + secondValue;
      break;
    case '-':
      correctAnswer = firstValue - secondValue;
      break;
    case '×':
      correctAnswer = firstValue * secondValue;
      break;
    case '÷':
      correctAnswer = firstValue / secondValue;
      break;
  }

  isCorrectAnswer = enteredAnswer == correctAnswer;
  if (isCorrectAnswer) {
    playSplashAnimation();
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
  return Math.floor(Math.random() * (max - min) + min);
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
    (firstOperand / secondOperand === 1 ||
      firstOperand % secondOperand === 0) &&
    secondOperand > 1
  ) {
    operatorSymbol = '÷';
  } else if (
    secondOperand >= 2 &&
    secondOperand <= 10 &&
    firstOperand * secondOperand <= 90
  ) {
    operatorSymbol = '×';
  } else if (firstOperand > secondOperand) {
    operatorSymbol = '-';
  } else if (firstOperand < secondOperand) {
    operatorSymbol = '+';
  }

  arrayValues.push(firstOperand);
  arrayValues.push(operatorSymbol);
  arrayValues.push(secondOperand);

  return arrayValues;
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

// Функция для определения расстояния до волны
function findDistanceToWave() {
  let touchСorrection = 100; // Корректировка касания волны
  let distanceToWave =
    gameField.offsetHeight - wave.offsetHeight - touchСorrection;

  return distanceToWave;
}

// Функция для анимации падения капли
function animationFallDrop(dropElement, duration) {
  let liftingHeight = 50; // Высота подъёма воды

  dropElement
    .animate(
      [
        {
          top: 0,
        },
        {
          top: `${findDistanceToWave()}px`,
        },
      ],
      duration
    )
    .finished.then(() => {
      try {
        gameField.removeChild(document.querySelector('.drop'));
        countDropFallen++;
        wave.style.height = `${wave.offsetHeight + liftingHeight}px`;
        wave2.style.height = `${wave2.offsetHeight + liftingHeight}px`;
        fallInSeaSound.currentTime = 0;
        fallInSeaSound.play();
        if (countDropFallen >= healthPoints) {
          isGameOver = true;
          document
            .querySelectorAll('.drop')
            .forEach(() =>
              gameField.removeChild(document.querySelector('.drop'))
            );
        }
      } catch {
        // Выходим, если словили ошибку
        return;
      }
    });
}

// Функция для создания брызг
function createSplash() {
  const drop = document.querySelector('.drop');
  let offsetTopСorrection = 50;
  let offsetLeftСorrection = 10;
  let imageSplash = new Image(80, 80);

  imageSplash.src = '/raindrops/assets/images/svg/splash.svg';
  imageSplash.className = 'splash';
  imageSplash.style.top = `${drop.offsetTop + offsetTopСorrection}px`;
  imageSplash.style.left = `${drop.offsetLeft + offsetLeftСorrection}px`;
  gameField.append(imageSplash);
}

// Функция для создания капли
function createDrop() {
  const dropElement = document.createElement('div');
  const firstOperand = document.createElement('span');
  const operator = document.createElement('span');
  const secondOperand = document.createElement('span');

  let creationInterval = 5000;

  dropElement.className = 'drop';
  firstOperand.className = 'operand first-operand';
  operator.className = 'operator';
  secondOperand.className = 'operand second-operand';
  dropElement.style.left = `${setRandomDropPosition()}%`;
  dropElement.append(firstOperand, operator, secondOperand);
  gameField.append(dropElement);
  fillDropValues(firstOperand, operator, secondOperand);
  animationFallDrop(dropElement, animationDuration);

  setTimeout(() => {
    if (isGameOver) {
      return;
    }
    createDrop();
  }, creationInterval);
}

// Функция для запуска игры
function startGame() {
  getBestScore(); // Получаем лучший результат перед стартом
  currentScore = 0; // Устанавливаем значение текущего рейтинга равным нулю
  createDrop(); // Запускаем создание капель
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
