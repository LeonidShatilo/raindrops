const display = document.getElementById('display');
const keyboard = document.querySelector('.wrapper-keyboard');

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
