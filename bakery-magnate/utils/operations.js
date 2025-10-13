function returnObjects(objects) {
  const objectsToReturn = objects.filter(
    (obj) =>
      classifications.isBehindWindow(obj) &&
      !classifications.isInShopTruck(obj) &&
      !classifications.isInOwnTruck(obj)
  );

  if (objectsToReturn.length === 0) {
    return {
      success: false,
      message: "Нет объектов за окном для возврата",
    };
  }

  const stallBounds = {
    x: { min: -195.3, max: -185 },
    y: { min: 15, max: 21 },
    z: { min: 2, max: 12 },
  };

  const center = {
    x: (stallBounds.x.min + stallBounds.x.max) / 2,
    y: (stallBounds.y.min + stallBounds.y.max) / 2,
    z: (stallBounds.z.min + stallBounds.z.max) / 2,
  };

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
      stallBounds.x.min,
      Math.min(stallBounds.x.max, obj.position.x)
    );
    obj.position.y = Math.max(
      stallBounds.y.min,
      Math.min(stallBounds.y.max, obj.position.y)
    );
    obj.position.z = Math.max(
      stallBounds.z.min,
      Math.min(stallBounds.z.max, obj.position.z)
    );
  });

  return {
    success: true,
    message: `Возвращено ${objectsToReturn.length} объектов из-за окна`,
    updatedObjects: objects,
  };
}
