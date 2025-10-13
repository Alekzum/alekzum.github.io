function isBetween(num, min, max) {
  if (min > max) {
    let err = ["Invalid bounds!", min, max];
    console.error(...err);
    throw new Error(...err);
  }
  return num >= min && num <= max;
}

function isBetween3d(positionXYZ, minCornerXYZ, maxCornerXYZ) {
  return (
    isBetween(positionXYZ.x, minCornerXYZ.x, maxCornerXYZ.x) &&
    isBetween(positionXYZ.y, minCornerXYZ.y, maxCornerXYZ.y) &&
    isBetween(positionXYZ.z, minCornerXYZ.z, maxCornerXYZ.z)
  );
}

function isInShopTruck(obj) {
  return isBetween3d(
    obj.position,
    { x: -467.3, y: 17.7, z: -107.7 },
    { x: -458.3, y: 27.5, z: -81.8 }
  );
}

function isInOwnTruck(obj) {
  return isBetween3d(
    obj.position,
    { x: -455.7, y: 17.7, z: -107.7 },
    { x: -447.8, y: 27.5, z: -81.8 }
  );
}

function isInWarehouse(obj) {
  return isBetween3d(
    obj.position,
    {
      x: WAREHOUSE_BOUNDS.x.min,
      y: WAREHOUSE_BOUNDS.y.min,
      z: WAREHOUSE_BOUNDS.z.min,
    },
    {
      x: WAREHOUSE_BOUNDS.x.max,
      y: WAREHOUSE_BOUNDS.y.max,
      z: WAREHOUSE_BOUNDS.z.max,
    }
  );
}

function isInWarehouseCabinets(obj) {
  return isBetween3d(
    obj.position,
    { x: -473.4, y: 11.5, z: -133.2 },
    { x: -467.1, y: 25.8, z: -118.0 }
  );
}

function isInStall(obj) {
  return isBetween3d(
    obj.position,
    { x: STALL_BOUNDS.x.min, y: STALL_BOUNDS.y.min, z: STALL_BOUNDS.z.min },
    { x: STALL_BOUNDS.x.max, y: STALL_BOUNDS.y.max, z: STALL_BOUNDS.z.max }
  );
}

function isBehindWindow(obj) {
  return isBetween3d(
    obj.position,
    { x: -Infinity, y: 0, z: -2 },
    { x: -197.0, y: 30, z: 30 }
  );
}

function isOutsideStall(obj) {
  return isBetween3d(
    obj.position,
    {
      x: STALL_BOUNDS.x.min - OUTSIDE_DISTANCE,
      y: STALL_BOUNDS.y.min - OUTSIDE_DISTANCE,
      z: STALL_BOUNDS.z.min - OUTSIDE_DISTANCE,
    },
    {
      x: STALL_BOUNDS.x.max + OUTSIDE_DISTANCE,
      y: STALL_BOUNDS.y.max + OUTSIDE_DISTANCE,
      z: STALL_BOUNDS.z.max + OUTSIDE_DISTANCE,
    }
  );
}

function isOutsideWarehouse(obj) {
  return isBetween3d(
    obj.position,
    {
      x: WAREHOUSE_BOUNDS.x.min - OUTSIDE_DISTANCE,
      y: WAREHOUSE_BOUNDS.y.min - OUTSIDE_DISTANCE,
      z: WAREHOUSE_BOUNDS.z.min - OUTSIDE_DISTANCE,
    },
    {
      x: WAREHOUSE_BOUNDS.x.max + OUTSIDE_DISTANCE,
      y: WAREHOUSE_BOUNDS.y.max + OUTSIDE_DISTANCE,
      z: WAREHOUSE_BOUNDS.z.max + OUTSIDE_DISTANCE,
    }
  );
}

const STALL_BOUNDS = {
  x: { min: -197, max: -179 },
  y: { min: 13, max: 27 },
  z: { min: 1, max: 27.5 },
};
const WAREHOUSE_BOUNDS = {
  x: { min: -473.4, max: -437 },
  y: { min: 10, max: 29 },
  z: { min: -172.2, max: -109.6 },
};
const OUTSIDE_DISTANCE = 100;

export {
  isInStall,
  isBehindWindow,
  isInShopTruck,
  isInOwnTruck,
  isInWarehouse,
  isInWarehouseCabinets,
  isOutsideStall,
  isOutsideWarehouse,
  STALL_BOUNDS,
  WAREHOUSE_BOUNDS,
  OUTSIDE_DISTANCE
};
