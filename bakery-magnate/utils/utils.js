import { DataValidator } from "./validator.js";

function parseData(rawString) {
  const rawValidation = DataValidator.validateRawData(rawString);
  if (!rawValidation.isValid) {
    throw new Error(`Ошибка валидации: ${rawValidation.error}`);
  }

  let raw_objects = rawString.split("№").slice(0, -1);
  let result = raw_objects.map((raw_object) => {
    let raw_data = raw_object.split("|").slice(0, -1);

    // Проверяем, что достаточно частей
    if (raw_data.length < 4) {
      throw new Error(`Недостаточно данных в объекте: ${raw_object}`);
    }

    let obj = {
      name: raw_data[0],
      position: JSON.parse(raw_data[1]),
      rotation: JSON.parse(raw_data[2]),
      data: JSON.parse(raw_data[3]),
    };
    return obj;
  });

  // Валидируем распарсенные объекты
  const objectValidation = DataValidator.validateParsedObjects(result);
  if (!objectValidation.isValid) {
    throw new Error(`Ошибка валидации объектов: ${objectValidation.error}`);
  }

  return result;
}

export { parseData, DataValidator };
