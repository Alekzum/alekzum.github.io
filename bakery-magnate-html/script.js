let currentFileName = "dyn_obj.bm";
let showResults = false;
let currentObjects = [];

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
const warehouseCount = document.getElementById("warehouseCount");
const warehouseCabinetsCount = document.getElementById(
  "warehouseCabinetsCount"
);
const otherCount = document.getElementById("otherCount");
const resultOutput = document.getElementById("resultOutput");

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

processButton.addEventListener("click", processData);
returnObjectsButton.addEventListener("click", handleReturnObjects);
downloadButton.addEventListener("click", downloadResult);
toggleResultsButton.addEventListener("click", toggleResults);

function processData() {
  const input = dataInput.value;

  if (!input.trim()) {
    statsInfo.innerHTML = "<p>Введите данные или загрузите файл</p>";
    return;
  }

  try {
    currentObjects = parseData(input);
    updateStats();
    updateResultsDisplay();
    updateResultOutput();
  } catch (error) {
    statsInfo.innerHTML = `<p style="color:red">Ошибка: ${error.message}</p>`;
  }
}

function handleReturnObjects() {
  if (currentObjects.length === 0) {
    alert("Нет данных для обработки");
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
    alert("Ошибка: " + error.message);
  }
}

function updateStats() {
  const objectsInStall = currentObjects.filter(isInStall);
  const objectsBehindWindow = currentObjects.filter(isBehindWindow);
  const objectsInShopTruck = currentObjects.filter(isInShopTruck);
  const objectsInOwnTruck = currentObjects.filter(isInOwnTruck);
  const objectsInWarehouse = currentObjects.filter(isInWarehouse);
  const objectsInWarehouseCabinets = currentObjects.filter(
    isInWarehouseCabinets
  );

  const otherObjects =
    currentObjects.length -
    objectsInStall.length -
    objectsBehindWindow.length -
    objectsInShopTruck.length -
    objectsInOwnTruck.length -
    objectsInWarehouse.length -
    objectsInWarehouseCabinets.length;

  stallCount.textContent = objectsInStall.length;
  windowCount.textContent = objectsBehindWindow.length;
  shopTruckCount.textContent = objectsInShopTruck.length;
  ownTruckCount.textContent = objectsInOwnTruck.length;
  warehouseCount.textContent = objectsInWarehouse.length;
  warehouseCabinetsCount.textContent = objectsInWarehouseCabinets.length;
  otherCount.textContent = otherObjects;

  statsInfo.innerHTML = `Всего объектов: <strong>${currentObjects.length}</strong>`;
}

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
    } else if (isInWarehouse(obj)) {
      classification = "in-warehouse";
      classificationText = "НА СКЛАДЕ";
    } else if (isInWarehouseCabinets(obj)) {
      classification = "in-warehouse-cabinets";
      classificationText = "В ШКАФАХ СКЛАДА";
    }

    html += `<div class="result ${classification}">
            <strong>${obj.name}</strong> | 
            Позиция: x=${obj.position.x}, y=${obj.position.y}, z=${
      obj.position.z
    } |
            ${classificationText ? "✓ " + classificationText : ""}
        </div>`;
  });

  resultsDiv.innerHTML = html;
  if (showResults) {
    resultsContainer.style.display = "block";
  }
}

function updateResultOutput() {
  resultOutput.value =
    currentObjects.length > 0 ? serializeData(currentObjects) : "";
}

function toggleResults() {
  showResults = !showResults;
  resultsContainer.style.display = showResults ? "block" : "none";
}

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

document.addEventListener("DOMContentLoaded", function () {
  downloadInfo.textContent = `Имя файла по умолчанию: ${currentFileName}`;
});
