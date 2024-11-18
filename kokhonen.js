const n = 10; // Кількість елементів у векторі
const m = 3; // Кількість класів

// original alpha = 0.1. Можна змінювати альфу та дивитись,
// як змінюються значення у фінальній матриці

let alpha = 0.1; // Початковий коефіцієнт навчання
const alphaDecay = 0.5; // Зменшення альфа
const epsilon = 0.0005; // Умови зупинки

// Ініціалізація матриці ваг
function initializeWeightMatrix(n, m) {
  return Array.from({ length: m }, () =>
    Array.from({ length: n }, () => parseFloat(Math.random().toFixed(3)))
  );
}

// Обчислення евклідової відстані між вектором і нейроном
function calculateDistance(vector, neuron) {
  return vector.reduce((sum, val, i) => sum + Math.pow(val - neuron[i], 2), 0);
}

// Оновлення ваг для нейрона-переможця
// Оновлення ваг для нейрона-переможця з округленням
function updateWeights(neuron, vector, alpha, winnerIndex, radius) {
  return neuron.map((w, i) => {
    const distance = Math.abs(i - winnerIndex); // Відстань між нейронами

    // Якщо відстань менша за радіус, то нейрон піддається корекції
    if (distance <= radius) {
      const influence = Math.exp(-distance / (2 * radius)); // Зменшення впливу з відстанню
      const newWeight = w + alpha * influence * (vector[i] - w); // Коригуємо вагу з урахуванням відстані
      return parseFloat(newWeight.toFixed(4)); // Округлюємо результат до 4 знаків після коми
    }

    return w; // Якщо нейрон не знаходиться в межах радіусу, його вага не змінюється
  });
}

// Перевірка умов зупинки
function checkStopCondition(oldWeights, newWeights, epsilon) {
  for (let i = 0; i < oldWeights.length; i++) {
    for (let j = 0; j < oldWeights[i].length; j++) {
      if (Math.abs(newWeights[i][j] - oldWeights[i][j]) > epsilon) {
        return false;
      }
    }
  }
  return true;
}

// Підготовка векторів
const v1 = [0, 1, 0, 0, 1, 0, 1, 0, 0, 1];

function invertBit(vector, index) {
  const newVector = [...vector]; // Копіюємо вектор
  newVector[index] = newVector[index] === 0 ? 1 : 0; // Інвертуємо елемент
  return newVector;
}

// Створюємо v2 і v3 шляхом інверсії:
const v2 = invertBit(v1, 1); // Інвертуємо 2-й елемент
const v3 = invertBit(v1, 2); // Інвертуємо 3-й елемент

function padVector(vector, targetLength) {
  const padding = Array(targetLength - vector.length).fill(0); // Додаємо нулі
  return [...vector, ...padding];
}

// Кодування прізвища та ім'я
const v4 = [0, 1, 0, 1, 0, 0, 0, 1]; // Прізвище
const v5 = [1, 0, 1]; // Ім'я

// Вирівнюємо довжину до v1:
const v4Padded = padVector(v4, v1.length);
const v5Padded = padVector(v5, v1.length);

// Для v4:
const v6 = invertBit(v4Padded, 1); // Інвертуємо 2-й елемент
const v7 = invertBit(v4Padded, 2); // Інвертуємо 3-й елемент

// Для v5:
const v8 = invertBit(v5Padded, 1); // Інвертуємо 2-й елемент
const v9 = invertBit(v5Padded, 2); // Інвертуємо 3-й елемент

// Массив векторів
const vectors = [v1, v2, v3, v4Padded, v5Padded, v6, v7, v8, v9];

// Основний алгоритм навчання
let weightMatrix = initializeWeightMatrix(n, m);
console.log("Початкова матриця ваг:", weightMatrix);

let iteration = 0;
while (true) {
  iteration++;
  console.log(`\nІтерація ${iteration}`);

  const oldWeights = JSON.parse(JSON.stringify(weightMatrix)); // Копія матриці ваг

  for (const vector of vectors) {
    // Обчислення відстаней
    const distances = weightMatrix.map((neuron) =>
      calculateDistance(vector, neuron)
    );
    console.log(`Відстані для вектора ${vector}:`, distances);

    // Визначення нейрона-переможця
    const winnerIndex = distances.indexOf(Math.min(...distances));
    console.log(`Переможець: A${winnerIndex + 1}`);

    // Оновлення ваг для нейрона-переможця
    weightMatrix[winnerIndex] = updateWeights(
      weightMatrix[winnerIndex],
      vector,
      alpha
    );
    console.log(
      `Оновлений нейрон A${winnerIndex + 1}:`,
      weightMatrix[winnerIndex]
    );
  }

  console.log("Оновлена матриця ваг:", weightMatrix);

  // Перевірка умови зупинки
  if (checkStopCondition(oldWeights, weightMatrix, epsilon)) {
    console.log("\nУмова зупинки виконана.");
    break;
  }

  // Оновлення коефіцієнта навчання
  alpha *= alphaDecay;
  console.log(`Новий коефіцієнт навчання: ${alpha.toFixed(4)}`);
}

console.log("\nФінальна матриця ваг:", weightMatrix);
