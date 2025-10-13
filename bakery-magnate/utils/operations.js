import {
  isBehindWindow,
  isInShopTruck,
  isInOwnTruck,
  isOutsideWarehouse,
  isInWarehouse,
  isInStall,
  isOutsideStall,
  WAREHOUSE_BOUNDS,
  STALL_BOUNDS,
} from "./classifications.js";

function serializeData(objects) {
  return (
    objects
      .map(
        (obj) =>
          `${obj.name}|${JSON.stringify(obj.position)}|${JSON.stringify(
            obj.rotation
          )}|${JSON.stringify(obj.data)}|`
      )
      .join("№") + "№"
  );
}

function innerReturnObjects({
  objects,
  filter,
  destinationName,
  target = null,
  bounds = null,
} = {}) {
  const objectsToReturn = objects.filter((obj) => filter(obj));
  if (objectsToReturn.length === 0) {
    return {
      success: false,
      message: "Нет объектов за окном для возврата",
    };
  }

  if (!target && !bounds) {
    throw new Error("Didn't found bounds for returning objects!");
  } else if (target && bounds) {
    throw new Error("Too much bounds for returning objects!");
  }
  let center;
  let targetBounds;

  if (bounds) {
    center = {
      x: (bounds.x.max + bounds.x.min) / 2,
      y: (bounds.y.max + bounds.y.min) / 2,
      z: (bounds.z.max + bounds.z.min) / 2,
    };
    targetBounds = bounds;
  } else {
    center = target;
    targetBounds = { x: target + 10, y: target + 10, z: target + 10 };
  }

  objectsToReturn.forEach((obj, index) => {
    const offset = Math.ceil((index + 1) / 2) * (index % 2 === 0 ? 1 : -1);

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

    obj.position.x = Math.max(
      targetBounds.x.min,
      Math.min(targetBounds.x.max, obj.position.x)
    );
    obj.position.y = Math.max(
      targetBounds.y.min,
      Math.min(targetBounds.y.max, obj.position.y)
    );
    obj.position.z = Math.max(
      targetBounds.z.min,
      Math.min(targetBounds.z.max, obj.position.z)
    );
  });

  return {
    success: true,
    message: `Возвращено ${objectsToReturn.length} объектов ${destinationName}`,
    updatedObjects: objects,
  };
}

function returnObjectsStall(objects) {
  return innerReturnObjects({
    objects: objects,
    filter: (obj) => isOutsideStall(obj) && !isInStall(obj),
    destinationName: "в лавку",
    bounds: STALL_BOUNDS,
  });
}

function returnObjectsWarehouse(objects) {
  return innerReturnObjects({
    objects: objects,
    filter: (obj) =>
      isOutsideWarehouse(obj) &&
      !isInWarehouse(obj) &&
      !isInShopTruck(obj) &&
      !isInOwnTruck(obj),
    destinationName: "в склад",
    bounds: WAREHOUSE_BOUNDS,
  });
}

export { serializeData, returnObjectsStall, returnObjectsWarehouse };
