import { parseData } from "./utils/utils.js";
import {
  serializeData,
  returnObjectsStall,
  returnObjectsWarehouse,
} from "./utils/operations.js";
import {
  isInStall,
  isBehindWindow,
  isInShopTruck,
  isInOwnTruck,
  isInWarehouse,
  isInWarehouseCabinets,
  isOutsideStall,
  isOutsideWarehouse,
} from "./utils/classifications.js";

// Переменные для хранения состояния
let currentFileName = "dyn_obj.bm";
let showResults = false;
let currentObjects = [];

// Элементы DOM
const fileInput = document.getElementById("fileInput");
const dataInput = document.getElementById("dataInput");
const processButton = document.getElementById("processButton");
const returnObjectsButtonStall = document.getElementById(
  "returnObjectsButtonStall"
);
const returnObjectsButtonWarehouse = document.getElementById(
  "returnObjectsButtonWarehouse"
);
const downloadButton = document.getElementById("downloadButton");
const toggleResultsButton = document.getElementById("toggleResultsButton");
const resultsContainer = document.getElementById("resultsContainer");
const resultsDiv = document.getElementById("results");
const statsInfo = document.getElementById("statsInfo");
const fileInfo = document.getElementById("fileInfo");
const downloadInfo = document.getElementById("downloadInfo");
const inStallCount = document.getElementById("stallCount");
const windowCount = document.getElementById("windowCount");
const shopTruckCount = document.getElementById("shopTruckCount");
const ownTruckCount = document.getElementById("ownTruckCount");
const warehouseCount = document.getElementById("warehouseCount");
const warehouseCabinetsCount = document.getElementById(
  "warehouseCabinetsCount"
);
const outsideStallCount = document.getElementById("outsideStallCount");
const outsideWarehouseCount = document.getElementById("outsideWarehouseCount");
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
returnObjectsButtonStall.addEventListener("click", handleReturnObjectsStall);
returnObjectsButtonWarehouse.addEventListener(
  "click",
  handleReturnObjectsWarehouse
);

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
function handleReturnObjects(destination) {
  let func;
  try {
    if (destination == "stall") func = returnObjectsStall;
    else if (destination == "warehouse") func = returnObjectsWarehouse;
    else throw new Error("Unknown destination", destination);

    if (currentObjects.length === 0) {
      alert("Нет данных для обработки");
      return;
    }

    const result = func(currentObjects);

    if (!result.success) {
      alert(result.message);
      return;
    }

    // Обновляем объекты
    currentObjects = result.updatedObjects;

    // Обновляем отображение
    updateStats();
    updateResultsDisplay();
    updateResultOutput();

    alert(result.message);
  } catch (error) {
    statsInfo.innerHTML = `<p style="color:red">Ошибка: ${error.message}</p>`;
    console.error(error);
    alert("Ошибка: " + error.message);
  }
}

function handleReturnObjectsStall() {
  return handleReturnObjects("stall");
}

function handleReturnObjectsWarehouse() {
  return handleReturnObjects("warehouse");
}

// Обновление статистики
function updateStats() {
  const objectsInStall = [];
  const objectsBehindWindow = [];
  const objectsInShopTruck = [];
  const objectsInOwnTruck = [];
  const objectsInWarehouse = [];
  const objectsInWarehouseCabinets = [];
  const objectsOutsideWarehouse = [];
  const objectsOutsideStall = [];
  const priorities = [
    [isInStall, objectsInStall],
    [isBehindWindow, objectsBehindWindow],
    [isInShopTruck, objectsInShopTruck],
    [isInOwnTruck, objectsInOwnTruck],
    [isInWarehouseCabinets, objectsInWarehouseCabinets],
    [isInWarehouse, objectsInWarehouse],
    [isOutsideWarehouse, objectsOutsideWarehouse],
    [isOutsideStall, objectsOutsideStall],
  ];

  for (let i = 0; i < currentObjects.length; i++) {
    let obj = currentObjects[i];
    for (let index = 0; index < priorities.length; index++) {
      let [filter, array] = priorities[index];
      if (filter(obj)) {
        array.push(obj);
        break;
      }
    }
  }

  const otherObjects =
    currentObjects.length -
    objectsInStall.length -
    objectsBehindWindow.length -
    objectsInShopTruck.length -
    objectsInOwnTruck.length -
    objectsInWarehouse.length -
    objectsInWarehouseCabinets.length -
    objectsOutsideWarehouse.length -
    objectsOutsideStall.length;

  // Обновляем счетчики
  inStallCount.textContent = objectsInStall.length;
  windowCount.textContent = objectsBehindWindow.length;
  shopTruckCount.textContent = objectsInShopTruck.length;
  ownTruckCount.textContent = objectsInOwnTruck.length;
  warehouseCount.textContent = objectsInWarehouse.length;
  warehouseCabinetsCount.textContent = objectsInWarehouseCabinets.length;
  outsideWarehouseCount.textContent = objectsOutsideWarehouse.length;
  outsideStallCount.textContent = objectsOutsideStall.length;
  otherCount.textContent = otherObjects;

  statsInfo.innerHTML = `
        Всего объектов: <strong>${currentObjects.length}</strong> | 
        В ларьке: <strong>${objectsInStall.length}</strong> |
        За окном: <strong>${objectsBehindWindow.length}</strong> |
        В грузовике магазина: <strong>${objectsInShopTruck.length}</strong> |
        В своем грузовике: <strong>${objectsInOwnTruck.length}</strong> |
        На складе: <strong>${objectsInWarehouse.length}</strong> |
        В шкафах склада: <strong>${objectsInWarehouseCabinets.length}</strong> |
        Вне склада: <strong>${objectsOutsideWarehouse.length}</strong> |
        Вне ларька: <strong>${objectsOutsideStall.length}</strong> |
        Другие: <strong>${otherObjects}</strong>
    `;
}

// Обновление отображения результатов
function updateResultsDisplay() {
  const classifications = [
    [isInStall, ["in-stall", "В ЛАРЬКЕ"]],
    [isBehindWindow, ["behind-window", "ЗА ОКНОМ"]],
    [isInShopTruck, ["in-shop-truck", "В ГРУЗОВИКЕ МАГАЗИНА"]],
    [isInOwnTruck, ["in-own-truck", "В СВОЕМ ГРУЗОВИКЕ"]],
    [isInWarehouseCabinets, ["in-warehouse-cabinets", "В ШКАФАХ СКЛАДА"]],
    [isInWarehouse, ["in-warehouse", "НА СКЛАДЕ"]],
    [isOutsideWarehouse, ["outside-warehouse", "ВНЕ СКЛАДА"]],
    [isOutsideStall, ["outside-stall", "ВНЕ ЛАРЬКА"]],
    [(obj) => true, ["other", ""]],
  ];

  let html = "";

  let objText = "";
  let classification;
  let classificationText;
  let priorities = new Map();
  let i;

  currentObjects.forEach((obj) => {
    for (i = 0; i < classifications.length; i++) {
      const items = classifications[i];
      if (items[0](obj)) {
        [classification, classificationText] = items[1];
        break;
      }
    }
    objText = `<div class="result ${classification}"><strong>${
      obj.name
    }</strong>
    | Позиция: x=${obj.position.x}, y=${obj.position.y}, z=${obj.position.z}
    | ${classificationText ? "✓ " + classificationText : ""}</div>`;

    if (!priorities[i]) priorities[i] = [];
    priorities[i].push(objText);
  });

  for (let index = 0; index < classifications.length; index++) {
    const array = priorities[index];
    if (!array) continue;
    html += array.join("");
  }

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
    statsInfo.innerHTML = `<p style="color:red">Ошибка: ${error.message}</p>`;
    console.error(error);
    alert("Ошибка при создании файла: " + error.message);
  }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  downloadInfo.textContent = `Имя файла по умолчанию: ${currentFileName}`;
});
