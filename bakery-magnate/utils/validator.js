// Валидатор данных для Bakery Magnate Helper

class DataValidator {
  static validateRawData(rawString) {
    if (!rawString || typeof rawString !== "string") {
      return {
        isValid: false,
        error: "Данные должны быть строкой",
      };
    }

    if (rawString.trim().length === 0) {
      return {
        isValid: false,
        error: "Данные не могут быть пустыми",
      };
    }

    // Проверяем базовую структуру
    if (!rawString.includes("№") || !rawString.includes("|")) {
      return {
        isValid: false,
        error: "Неверный формат данных. Ожидается разделитель № и |",
      };
    }

    return { isValid: true };
  }

  static validateParsedObjects(objects) {
    if (!Array.isArray(objects)) {
      return {
        isValid: false,
        error: "Данные должны быть массивом объектов",
      };
    }

    if (objects.length === 0) {
      return {
        isValid: false,
        error: "Не найдено объектов для обработки",
      };
    }

    const errors = [];

    objects.forEach((obj, index) => {
      const objectErrors = [];

      // Проверяем обязательные поля
      if (!obj.name || typeof obj.name !== "string") {
        objectErrors.push('Поле "name" должно быть строкой');
      }

      // Проверяем position
      if (!obj.position || typeof obj.position !== "object") {
        objectErrors.push('Поле "position" должно быть объектом');
      } else {
        const { x, y, z } = obj.position;
        if (
          typeof x !== "number" ||
          typeof y !== "number" ||
          typeof z !== "number"
        ) {
          objectErrors.push(
            "Поля position.x, position.y, position.z должны быть числами"
          );
        }
      }

      // Проверяем rotation
      if (!obj.rotation || typeof obj.rotation !== "object") {
        objectErrors.push('Поле "rotation" должно быть объектом');
      } else {
        const { x, y, z, w } = obj.rotation;
        if (
          typeof x !== "number" ||
          typeof y !== "number" ||
          typeof z !== "number" ||
          typeof w !== "number"
        ) {
          objectErrors.push(
            "Поля rotation.x, rotation.y, rotation.z, rotation.w должны быть числами"
          );
        }
      }

      // Проверяем data
      if (!obj.data || typeof obj.data !== "object") {
        objectErrors.push('Поле "data" должно быть объектом');
      }

      if (objectErrors.length > 0) {
        errors.push({
          objectIndex: index,
          objectName: obj.name || "Без имени",
          errors: objectErrors,
        });
      }
    });

    if (errors.length > 0) {
      return {
        isValid: false,
        error: "Найдены ошибки в данных объектов",
        details: errors,
      };
    }

    return { isValid: true };
  }

  static validateObjectPositions(objects) {
    const warnings = [];

    objects.forEach((obj, index) => {
      const { x, y, z } = obj.position;

      //   // Проверяем на экстремальные значения
      //   if (Math.abs(x) > 10000 || Math.abs(y) > 10000 || Math.abs(z) > 10000) {
      //     warnings.push({
      //       objectIndex: index,
      //       objectName: obj.name,
      //       warning: "Объект имеет экстремальные координаты",
      //       position: { x, y, z },
      //     });
      //   }

      // Проверяем на NaN
      if (isNaN(x) || isNaN(y) || isNaN(z)) {
        warnings.push({
          objectIndex: index,
          objectName: obj.name,
          warning: "Объект имеет нечисловые координаты",
          position: { x, y, z },
        });
      }
    });

    return {
      hasWarnings: warnings.length > 0,
      warnings: warnings,
    };
  }

  static createValidationReport(objects) {
    const basicValidation = this.validateParsedObjects(objects);
    const positionValidation = this.validateObjectPositions(objects);

    return {
      isValid: basicValidation.isValid,
      totalObjects: objects.length,
      errors: basicValidation.details || [],
      warnings: positionValidation.warnings || [],
      hasWarnings: positionValidation.hasWarnings,
      summary: {
        validObjects: basicValidation.isValid
          ? objects.length - (basicValidation.details?.length || 0)
          : 0,
        invalidObjects: basicValidation.details?.length || 0,
        objectsWithWarnings: positionValidation.warnings?.length || 0,
      },
    };
  }
}

export { DataValidator };
