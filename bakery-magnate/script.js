import { parseData } from "./utils/utils.js";
import {
  serializeData,
  returnObjectsStall,
  returnObjectsWarehouse,
} from "./utils/operations.js";
import {
  isInStallFreezer,
  isInStall,
  isInShopTruck,
  isInOwnTruck,
  isInWarehouse,
  isInWarehouseFreezers,
  isOutsideStall,
  isOutsideWarehouse,
} from "./utils/classifications.js";

// Переменные для хранения состояния
let currentFileName = "dyn_obj.bm";
let showResults = false;
let currentObjects = [];
let validationReport = null;

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
const inStallFreezerCount = document.getElementById("stallFreezerCount");
const inStallCount = document.getElementById("stallCount");
const shopTruckCount = document.getElementById("shopTruckCount");
const ownTruckCount = document.getElementById("ownTruckCount");
const warehouseCount = document.getElementById("warehouseCount");
const warehouseFreezersCount = document.getElementById(
  "warehouseFreezersCount"
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
  fileInput.value = "";
  fileInfo.textContent = "Файл не выбран";
  const input = dataInput.value;

  try {
    if (!input.trim()) {
      statsInfo.innerHTML = "<p>Введите данные или загрузите файл</p>";
      return;
    }

    currentObjects = parseData(input);

    updateStats();
    updateResultsDisplay();
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
  const objectsInStallFreezer = [];
  const objectsInShopTruck = [];
  const objectsInOwnTruck = [];
  const objectsInWarehouse = [];
  const objectsInWarehouseFreezers = [];
  const objectsOutsideWarehouse = [];
  const objectsOutsideStall = [];
  const priorities = [
    [isInStallFreezer, objectsInStallFreezer],
    [isInStall, objectsInStall],
    [isInShopTruck, objectsInShopTruck],
    [isInOwnTruck, objectsInOwnTruck],
    [isInWarehouseFreezers, objectsInWarehouseFreezers],
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
    objectsInStallFreezer.length -
    objectsInStall.length -
    objectsInShopTruck.length -
    objectsInOwnTruck.length -
    objectsInWarehouse.length -
    objectsInWarehouseFreezers.length -
    objectsOutsideWarehouse.length -
    objectsOutsideStall.length;

  // Обновляем счетчики
  inStallFreezerCount.textContent = objectsInStallFreezer.length;
  inStallCount.textContent = objectsInStall.length;
  shopTruckCount.textContent = objectsInShopTruck.length;
  ownTruckCount.textContent = objectsInOwnTruck.length;
  warehouseCount.textContent = objectsInWarehouse.length;
  warehouseFreezersCount.textContent = objectsInWarehouseFreezers.length;
  outsideWarehouseCount.textContent = objectsOutsideWarehouse.length;
  outsideStallCount.textContent = objectsOutsideStall.length;
  otherCount.textContent = otherObjects;

  // Добавляем информацию о валидации
  let validationInfo = "";
  if (validationReport) {
    if (!validationReport.isValid) {
      validationInfo = ` | <span style="color: #dc3545;">Ошибки: ${validationReport.summary.invalidObjects}</span>`;
    } else if (validationReport.hasWarnings) {
      validationInfo = ` | <span style="color: #ffc107;">Предупреждения: ${validationReport.summary.objectsWithWarnings}</span>`;
    } else {
      validationInfo = ` | <span style="color: #28a745;">✓ Валидация пройдена</span>`;
    }
  }

  statsInfo.innerHTML = `
        Всего объектов: <strong>${currentObjects.length}</strong>${validationInfo} |
        В холодильнике ларька: <strong>${objectsInStallFreezer.length}</strong> |
        В ларьке: <strong>${objectsInStall.length}</strong> |
        В грузовике магазина: <strong>${objectsInShopTruck.length}</strong> |
        В своем грузовике: <strong>${objectsInOwnTruck.length}</strong> |
        На складе: <strong>${objectsInWarehouse.length}</strong> |
        В холодильниках склада: <strong>${objectsInWarehouseFreezers.length}</strong> |
        Вне склада: <strong>${objectsOutsideWarehouse.length}</strong> |
        Вне ларька: <strong>${objectsOutsideStall.length}</strong> |
        Другие: <strong>${otherObjects}</strong>
    `;
}

// Обновление отображения результатов
function updateResultsDisplay() {
  const classifications = [
    [isInStallFreezer, ["in-stall-freezer", "В ХОЛОДИЛЬНИКЕ ЛАРЬКА"]],
    [isInStall, ["in-stall", "В ЛАРЬКЕ"]],
    [isInShopTruck, ["in-shop-truck", "В ГРУЗОВИКЕ МАГАЗИНА"]],
    [isInOwnTruck, ["in-own-truck", "В СВОЕМ ГРУЗОВИКЕ"]],
    [
      isInWarehouseFreezers,
      ["in-warehouse-freezers", "В ХОЛОДИЛЬНИКАХ СКЛАДА"],
    ],
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

  currentObjects.sort((obj1, obj2) => {
    var [name1, name2] = [obj1.name, obj2.name];
    var name = name1 < name2 ? -1 : name1 == name2 ? 0 : 1;
    return name;
  });

  currentObjects.forEach((obj) => {
    for (i = 0; i < classifications.length; i++) {
      const items = classifications[i];
      if (items[0](obj)) {
        [classification, classificationText] = items[1];
        break;
      }
    }

    // Добавляем иконку валидации если есть проблемы
    let validationIcon = "";
    if (validationReport) {
      const hasErrors = validationReport.errors.some(
        (e) => e.objectIndex === currentObjects.indexOf(obj)
      );
      const hasWarnings = validationReport.warnings.some(
        (w) => w.objectIndex === currentObjects.indexOf(obj)
      );

      if (hasErrors) {
        validationIcon = " ❌";
      } else if (hasWarnings) {
        validationIcon = " ⚠️";
      }
    }

    objText = `<div class="result ${classification}">
            <strong>${obj.name}</strong>${validationIcon}
            | Позиция: x=${obj.position.x}, y=${obj.position.y}, z=${
      obj.position.z
    }
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
    downloadButton.removeAttribute("disabled");
  } else {
    resultOutput.value = "";
    downloadButton.setAttribute("disabled", null);
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
    downloadInfo.style.display = "none";
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

    downloadInfo.style = "";
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

// Переключение темы
const themeToggle = document.getElementById("themeToggle");

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateToggleButton(savedTheme);
}

function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateToggleButton(newTheme);
}

function updateToggleButton(theme) {
  if (theme === "dark") {
    themeToggle.textContent = "☀️ Светлая тема";
  } else {
    themeToggle.textContent = "🌙 Тёмная тема";
  }
}

// Инициализация темы
themeToggle.addEventListener("click", toggleTheme);
document.addEventListener("DOMContentLoaded", loadTheme);
