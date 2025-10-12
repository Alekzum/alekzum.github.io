// Переменные для хранения состояния
let currentFileName = "dyn_obj.bm";
let showResults = false;
let currentObjects = [];

// Элементы DOM
const fileInput = document.getElementById('fileInput');
const dataInput = document.getElementById('dataInput');
const processButton = document.getElementById('processButton');
const returnObjectsButton = document.getElementById('returnObjectsButton');
const downloadButton = document.getElementById('downloadButton');
const toggleResultsButton = document.getElementById('toggleResultsButton');
const resultsContainer = document.getElementById('resultsContainer');
const resultsDiv = document.getElementById('results');
const statsInfo = document.getElementById('statsInfo');
const fileInfo = document.getElementById('fileInfo');
const downloadInfo = document.getElementById('downloadInfo');
const stallCount = document.getElementById('stallCount');
const windowCount = document.getElementById('windowCount');
const otherCount = document.getElementById('otherCount');

// Обработчик загрузки файла
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    currentFileName = file.name;
    fileInfo.textContent = `Выбран файл: ${file.name}`;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        dataInput.value = e.target.result;
        processData();
    };
    reader.readAsText(file);
});

// Обработчик кнопки обработки данных
processButton.addEventListener('click', processData);

// Обработчик кнопки возврата объектов
returnObjectsButton.addEventListener('click', returnObjects);

// Обработчик кнопки скачивания
downloadButton.addEventListener('click', downloadResult);

// Обработчик кнопки показа/скрытия результатов
toggleResultsButton.addEventListener('click', toggleResults);

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
        
    } catch (error) {
        statsInfo.innerHTML = `<p style="color:red">Ошибка: ${error.message}</p>`;
        console.error(error);
    }
}

// Функция возврата объектов
function returnObjects() {
    if (currentObjects.length === 0) {
        alert("Нет данных для обработки");
        return;
    }

    try {
        // Фильтруем объекты по условиям ларька
        const objectsInStall = currentObjects.filter(isInStall);

        if (objectsInStall.length === 0) {
            alert("Нет объектов в границах ларька для возврата");
            return;
        }

        // Границы ларька
        const stallBounds = {
            x: { min: -195, max: -185 },
            y: { min: 15, max: 21 },
            z: { min: 2, max: 12 }
        };

        // Центр ларька
        const center = {
            x: (stallBounds.x.min + stallBounds.x.max) / 2,
            y: (stallBounds.y.min + stallBounds.y.max) / 2,
            z: (stallBounds.z.min + stallBounds.z.max) / 2
        };

        // Размещаем объекты по сетке от центра
        objectsInStall.forEach((obj, index) => {
            const offset = Math.ceil((index + 1) / 2) * ((index % 2 === 0) ? 1 : -1);
            
            if (index % 3 === 0) {
                obj.position.x = center.x + offset;
                obj.position.y = center.y;
                obj.position.z = center.z;
            } else if (index % 3 === 1) {
                obj.position.x = center.x;
                obj.position.y = center.y + offset;
                obj.position.z = center.z;
            } else {
                obj.position.x = center.x;
                obj.position.y = center.y;
                obj.position.z = center.z + offset;
            }

            // Ограничиваем позиции границами ларька
            obj.position.x = Math.max(stallBounds.x.min, Math.min(stallBounds.x.max, obj.position.x));
            obj.position.y = Math.max(stallBounds.y.min, Math.min(stallBounds.y.max, obj.position.y));
            obj.position.z = Math.max(stallBounds.z.min, Math.min(stallBounds.z.max, obj.position.z));
        });

        // Обновляем данные в textarea
        dataInput.value = serializeData(currentObjects);
        
        // Обновляем отображение
        processData();
        
        alert(`Возвращено ${objectsInStall.length} объектов в границы ларька`);

    } catch (error) {
        alert("Ошибка: " + error.message);
    }
}

// Функция проверки объекта в ларьке
function isInStall(obj) {
    return obj.position.z >= 2 && obj.position.z <= 12 &&
           obj.position.y >= 14 && obj.position.y <= 21 &&
           obj.position.x >= -195 && obj.position.x <= -185;
}

// Функция проверки объекта за окном
function isBehindWindow(obj) {
    return obj.position.z >= -2 && obj.position.z <= 16 &&
           obj.position.y >= 0 && obj.position.y <= 30 &&
           obj.position.x < -195;
}

// Функция сериализации данных
function serializeData(objects) {
    return objects.map(obj => 
        `${obj.name}|${JSON.stringify(obj.position)}|${JSON.stringify(obj.rotation)}|${JSON.stringify(obj.data)}|`
    ).join('№') + '№';
}

// Обновление статистики
function updateStats() {
    const objectsInStall = currentObjects.filter(isInStall);
    const objectsBehindWindow = currentObjects.filter(isBehindWindow);
    const otherObjects = currentObjects.length - objectsInStall.length - objectsBehindWindow.length;
    
    // Обновляем счетчики
    stallCount.textContent = objectsInStall.length;
    windowCount.textContent = objectsBehindWindow.length;
    otherCount.textContent = otherObjects;
    
    statsInfo.innerHTML = `
        Всего объектов: <strong>${currentObjects.length}</strong> | 
        В ларьке: <strong>${objectsInStall.length}</strong> |
        За окном: <strong>${objectsBehindWindow.length}</strong> |
        Другие: <strong>${otherObjects}</strong>
    `;
}

// Обновление отображения результатов
function updateResultsDisplay() {
    let html = '';
    
    currentObjects.forEach((obj) => {
        let classification = "other";
        let classificationText = "";
        
        if (isInStall(obj)) {
            classification = "in-stall";
            classificationText = "В ЛАРЬКЕ";
        } else if (isBehindWindow(obj)) {
            classification = "behind-window";
            classificationText = "ЗА ОКНОМ";
        }

        html += `
            <div class="result ${classification}">
                <strong>${obj.name}</strong> | 
                Позиция: x=${obj.position.x}, y=${obj.position.y}, z=${obj.position.z} |
                ${classificationText ? "✓ " + classificationText : ""}
            </div>`;
    });

    resultsDiv.innerHTML = html;
    
    // Если результаты показываются, обновляем контейнер
    if (showResults) {
        resultsContainer.style.display = 'block';
    }
}

// Переключение видимости результатов
function toggleResults() {
    showResults = !showResults;
    resultsContainer.style.display = showResults ? 'block' : 'none';
}

// Скачивание результата
function downloadResult() {
    if (currentObjects.length === 0) {
        alert("Нет данных для скачивания");
        return;
    }

    try {
        const data = serializeData(currentObjects);
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
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
document.addEventListener('DOMContentLoaded', function() {
    downloadInfo.textContent = `Имя файла по умолчанию: ${currentFileName}`;
});