const display = document.getElementById('display');
const keyboard = document.querySelector('.wrapper-keyboard');
const gameField = document.querySelector('.game-field');
const wave = document.querySelector('.wave');

const animationDuration = 7000; // Продолжительность анимации

// Минимальное и максимальное значение для случайного положения капли
const randomPositionValue = {
  min: 0,
  max: 85,
};

let enteredResult; // Введённый результат

// Функция для обновления значения на дисплее
function updateDisplay(number) {
  if (display.value.length < 4) {
    display.value += number;
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
  enteredResult = display.value;
  clearDisplay();
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
      enteredResult = display.value;
      clearDisplay();
      break;
  }
}

// Вешаем событие на обёртку клавиатуры и узнаём, на какую именно кнопку нажали
keyboard.onclick = function (event) {
  let number = event.target.getAttribute('data-number');
  let operation = event.target.getAttribute('data-operation');
  if (number) {
    console.log(number);
    updateDisplay(number);
  } else if (operation) {
    console.log(operation);
    enterOperation(operation);
  }
};

// Функция для появляения капли из случайного места по горизонтали
function dropRandomPosition(
  min = randomPositionValue.min,
  max = randomPositionValue.max
) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Функция для определения расстояния до волны
function findDistanceToWave() {
  let touchСorrection = 70; // Корректировка касания волны
  return gameField.offsetHeight - wave.offsetHeight - touchСorrection;
}

// Функция для анимации падения капли
function animationFallDrop(element, duration) {
  element.animate(
    [
      {
        top: 0,
      },
      {
        top: `${findDistanceToWave()}px`,
      },
    ],
    duration
  );
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
  drop.style.left = `${dropRandomPosition()}%`;
  drop.append(firstOperand, operator, secondOperand);
  gameField.append(drop);

  animationFallDrop(drop, animationDuration);
}
