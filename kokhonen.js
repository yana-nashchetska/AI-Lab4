const n = 10; // Кількість елементів у векторі
const m = 3; // Кількість класів
let alpha = 0.5; // Початковий коефіцієнт
const alphaDecay = 0.9; // Сповільнення зменшення alpha
const epsilon = 0.00001; // Точність для зупинки
const initialRadius = Math.floor(n / 2); // Початковий радіус сусідства
const radiusDecay = 0.9; // Швидкість зменшення радіусу

let iteration = 0;

// Ініціалізація матриці ваг
function initializeWeightMatrix(n, m) {
  return Array.from({ length: m }, () =>
    Array.from({ length: n }, () => parseFloat(Math.random().toFixed(3)))
  );
}

// Обчислення евклідової відстані між вектором і нейроном
function calculateDistance(vector, neuron) {
  return Math.sqrt(
    vector.reduce((sum, val, i) => sum + Math.pow(val - neuron[i], 2), 0)
  );
}

// Оновлення ваг для нейронів у радіусі
function updateWeights(weightMatrix, vector, winnerIndex, alpha, radius) {
  return weightMatrix.map((neuron, i) => {
    const distance = Math.abs(i - winnerIndex); // Відстань до переможця
    if (distance <= radius) {
      const influence = Math.exp(
        -Math.pow(distance, 2) / (2 * Math.pow(radius, 2))
      );
      return neuron.map((w, j) => {
        const newWeight = w + alpha * influence * (vector[j] - w); // Оновлення ваги
        return parseFloat(newWeight.toFixed(4)); // Округлення
      });
    }
    return neuron; // Якщо поза радіусом, вага не змінюється
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
  const newVector = [...vector];
  newVector[index] = newVector[index] === 0 ? 1 : 0; // Інверсія
  return newVector;
}

const v2 = invertBit(v1, 1);
const v3 = invertBit(v1, 2);

const vectors = [v1, v2, v3];

// Основний алгоритм навчання
let weightMatrix = initializeWeightMatrix(n, m);
console.log("Початкова матриця ваг:", weightMatrix);

let radius = initialRadius;

while (true) {
  iteration++;
  console.log(`\nІтерація ${iteration}`);

  const oldWeights = JSON.parse(JSON.stringify(weightMatrix)); // Копія матриці ваг

  for (const vector of vectors) {
    // Обчислення відстаней
    const distances = weightMatrix.map((neuron) =>
      calculateDistance(vector, neuron)
    );

    // Визначення нейрона-переможця
    const winnerIndex = distances.indexOf(Math.min(...distances));
    console.log(`Переможець: A${winnerIndex + 1}`);

    // Оновлення ваг для нейронів у радіусі
    weightMatrix = updateWeights(
      weightMatrix,
      vector,
      winnerIndex,
      alpha,
      radius
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
  radius *= radiusDecay;

  console.log(`Новий коефіцієнт навчання: ${alpha.toFixed(4)}`);
  console.log(`Новий радіус сусідства: ${radius.toFixed(4)}`);

  if (alpha < 0.0001) {
    console.log("Alpha стало надто малим, алгоритм зупинено.");
    break;
  }
}

console.log("\nФінальна матриця ваг:", weightMatrix);
