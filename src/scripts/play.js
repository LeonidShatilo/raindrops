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
const randomPositionValue = {
  min: 0,
  max: 85,
};

// Минимальное и максимальное значение операнда
const randomOperandValue = {
  min: 2,
  max: 100,
};

let enteredResult; // Введённый результат
let isSoundOn = true; // Флаг для определения, должны ли проигрываться фоновые звуки

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
    updateDisplay(number);
  } else if (operation) {
    enterOperation(operation);
  }
};

// Функция для появления капли из случайного места по горизонтали
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
  drop.style.left = `${dropRandomPosition()}%`;
  drop.append(firstOperand, operator, secondOperand);
  gameField.append(drop);

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