// script.js

// Переменные для хранения состояния
let currentFileName = "dyn_obj.bm";
let showResults = false;
let currentObjects = [];

// Элементы DOM
const fileInput = document.getElementById("fileInput");
const dataInput = document.getElementById("dataInput");
const processButton = document.getElementById("processButton");
const returnObjectsButton = document.getElementById("returnObjectsButton");
const downloadButton = document.getElementById("downloadButton");
const toggleResultsButton = document.getElementById("toggleResultsButton");
const resultsContainer = document.getElementById("resultsContainer");
const resultsDiv = document.getElementById("results");
const statsInfo = document.getElementById("statsInfo");
const fileInfo = document.getElementById("fileInfo");
const downloadInfo = document.getElementById("downloadInfo");
const stallCount = document.getElementById("stallCount");
const windowCount = document.getElementById("windowCount");
const shopTruckCount = document.getElementById("shopTruckCount");
const ownTruckCount = document.getElementById("ownTruckCount");
const otherCount = document.getElementById("otherCount");
const resultOutput = document.getElementById("resultOutput");

// Обработчик загрузки файла
fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  currentFileName = file.name;
  fileInfo.textContent = `Выбран файл: ${file.name}`;

  const reader = new FileReader();
  reader.onload = function (e) {
    dataInput.value = e.target.result;
    processData();
  };
  reader.readAsText(file);
});

// Обработчик кнопки обработки данных
processButton.addEventListener("click", processData);

// Обработчик кнопки возврата объектов
returnObjectsButton.addEventListener("click", handleReturnObjects);

// Обработчик кнопки скачивания
downloadButton.addEventListener("click", downloadResult);

// Обработчик кнопки показа/скрытия результатов
toggleResultsButton.addEventListener("click", toggleResults);

// Основная функция обработки
function processData() {
  const input = dataInput.value;

  if (!input.trim()) {
    statsInfo.innerHTML = "<p>Введите данные или загрузите файл</p>";
    return;
  }

  try {
    currentObjects = parseData(input);

    // Обновляем статистику
    updateStats();

    // Обновляем отображение результатов
    updateResultsDisplay();

    // Обновляем поле с результатом (без изменения исходных данных)
    updateResultOutput();
  } catch (error) {
    statsInfo.innerHTML = `<p style="color:red">Ошибка: ${error.message}</p>`;
    console.error(error);
  }
}

// Обработчик возврата объектов
function handleReturnObjects() {
  if (currentObjects.length === 0) {
    alert("No data to process");
    return;
  }

  try {
    const result = returnObjects(currentObjects);

    if (!result.success) {
      alert(result.message);
      return;
    }

    currentObjects = result.updatedObjects;
    updateStats();
    updateResultsDisplay();
    updateResultOutput();

    alert(result.message);
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Обновление статистики
function updateStats() {
  const objectsInStall = currentObjects.filter(isInStall);
  const objectsBehindWindow = currentObjects.filter(isBehindWindow);
  const objectsInShopTruck = currentObjects.filter(isInShopTruck);
  const objectsInOwnTruck = currentObjects.filter(isInOwnTruck);

  const otherObjects =
    currentObjects.length -
    objectsInStall.length -
    objectsBehindWindow.length -
    objectsInShopTruck.length -
    objectsInOwnTruck.length;

  // Обновляем счетчики
  stallCount.textContent = objectsInStall.length;
  windowCount.textContent = objectsBehindWindow.length;
  shopTruckCount.textContent = objectsInShopTruck.length;
  ownTruckCount.textContent = objectsInOwnTruck.length;
  otherCount.textContent = otherObjects;

  statsInfo.innerHTML = `
        Всего объектов: <strong>${currentObjects.length}</strong> | 
        В ларьке: <strong>${objectsInStall.length}</strong> |
        За окном: <strong>${objectsBehindWindow.length}</strong> |
        В грузовике магазина: <strong>${objectsInShopTruck.length}</strong> |
        В своем грузовике: <strong>${objectsInOwnTruck.length}</strong> |
        Другие: <strong>${otherObjects}</strong>
    `;
}

// Обновление отображения результатов
function updateResultsDisplay() {
  let html = "";

  currentObjects.forEach((obj) => {
    let classification = "other";
    let classificationText = "";

    if (isInStall(obj)) {
      classification = "in-stall";
      classificationText = "В ЛАРЬКЕ";
    } else if (isBehindWindow(obj)) {
      classification = "behind-window";
      classificationText = "ЗА ОКНОМ";
    } else if (isInShopTruck(obj)) {
      classification = "in-shop-truck";
      classificationText = "В ГРУЗОВИКЕ МАГАЗИНА";
    } else if (isInOwnTruck(obj)) {
      classification = "in-own-truck";
      classificationText = "В СВОЕМ ГРУЗОВИКЕ";
    }

    html += `
            <div class="result ${classification}">
                <strong>${obj.name}</strong> | 
                Позиция: x=${obj.position.x}, y=${obj.position.y}, z=${
      obj.position.z
    } |
                ${classificationText ? "✓ " + classificationText : ""}
            </div>`;
  });

  resultsDiv.innerHTML = html;

  // Если результаты показываются, обновляем контейнер
  if (showResults) {
    resultsContainer.style.display = "block";
  }
}

// Обновление поля с результатом
function updateResultOutput() {
  if (currentObjects.length > 0) {
    resultOutput.value = serializeData(currentObjects);
  } else {
    resultOutput.value = "";
  }
}

// Переключение видимости результатов
function toggleResults() {
  showResults = !showResults;
  resultsContainer.style.display = showResults ? "block" : "none";
}

// Скачивание результата
function downloadResult() {
  if (currentObjects.length === 0) {
    alert("Нет данных для скачивания");
    return;
  }

  try {
    const data = serializeData(currentObjects);
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = currentFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    downloadInfo.textContent = `Файл "${currentFileName}" готов к скачиванию`;
  } catch (error) {
    alert("Ошибка при создании файла: " + error.message);
  }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  downloadInfo.textContent = `Имя файла по умолчанию: ${currentFileName}`;
});
