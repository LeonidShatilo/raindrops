const display = document.getElementById('display');
const keyboard = document.querySelector('.wrapper-keyboard');
const gameField = document.querySelector('.game-field');
const wave = document.querySelector('.wave');
const wave2 = document.querySelector('.wave-2');
const soundButton = document.getElementById('sound');
const rainSound = document.querySelector('.rain-sound');
const seaSound = document.querySelector('.sea-sound');

const animationDuration = 7000; // Продолжительность анимации

// Минимальное и максимальное значение для случайного положения капли
const limitPositionValue = {
  min: 0,
  max: 85,
};

// Минимальное и максимальное значение операнда
const limitOperandValue = {
  min: 2,
  max: 10,
};

// Символы всех используемых операторов
const operatorSymbol = ['+', '-', '×', '÷'];

// Минимальное и максимальное значение индекса массива с операторами
const limitIndexArrSymbol = {
  min: 0,
  max: operatorSymbol.length - 1,
};

let enteredResult; // Введённый результат
let isSoundOn = true; // Флаг для определения, должны ли проигрываться фоновые звуки

// Функция для обновления значения на дисплее
function updateDisplay(number) {
  if (display.value.length < 3) {
    if (display.value === '' && number == 0) {
      display.value = '';
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
function enterResult() {
  if (display.value !== '') {
    enteredResult = display.value;
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
      enterResult();
      clearDisplay();
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
        if (display.value === '') {
          display.value = '';
        } else {
          display.value += 0;
        }
        break;
      case 'Numpad1':
        display.value += 1;
        break;
      case 'Numpad2':
        display.value += 2;
        break;
      case 'Numpad3':
        display.value += 3;
        break;
      case 'Numpad4':
        display.value += 4;
        break;
      case 'Numpad5':
        display.value += 5;
        break;
      case 'Numpad6':
        display.value += 6;
        break;
      case 'Numpad7':
        display.value += 7;
        break;
      case 'Numpad8':
        display.value += 8;
        break;
      case 'Numpad9':
        display.value += 9;
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
      enterResult();
      clearDisplay();
  }
}

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

// Функция для установки случайного оператора
function setRandomOperator(
  arraySymbol = operatorSymbol,
  min = limitIndexArrSymbol.min,
  max = limitIndexArrSymbol.max
) {
  let randomIndex = getRandomValue(min, max);
  return arraySymbol[randomIndex];
}

// Функция для заполнения капли операндами и оператором
function fillDropValues(firstOperand, operator, secondOperand) {
  let operatorSymbol = setRandomOperator();
  let firstValue = setRandomOperandValue();
  let secondValue = setRandomOperandValue();
  operator.innerHTML = operatorSymbol;
  firstOperand.innerHTML = firstValue;
  secondOperand.innerHTML = secondValue;
}

// Функция для определения расстояния до волны
function findDistanceToWave() {
  let touchСorrection = 70; // Корректировка касания волны
  return gameField.offsetHeight - wave.offsetHeight - touchСorrection;
}

// Функция для анимации падения капли
function animationFallDrop(element, duration) {
  let liftingHeight = 150; // Высота подъёма воды
  element
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
      wave.style.height = `${wave.offsetHeight + liftingHeight}px`;
      wave2.style.height = `${wave2.offsetHeight + liftingHeight}px`;
    });
}

// Функция для создания капли
function createDrop() {
  const drop = document.createElement('div');
  const operator = document.createElement('span');
  const firstOperand = document.createElement('span');
  const secondOperand = document.createElement('span');

  drop.className = 'drop';
  operator.className = 'operator';
  firstOperand.className = 'operand';
  secondOperand.className = 'operand';
  drop.style.left = `${setRandomDropPosition()}%`;
  drop.append(firstOperand, operator, secondOperand);
  gameField.append(drop);
  fillDropValues(firstOperand, operator, secondOperand);
  animationFallDrop(drop, animationDuration);
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

createDrop();
