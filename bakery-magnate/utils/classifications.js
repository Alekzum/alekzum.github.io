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
    {
      x: SHOP_TRUCK_BOUNDS.x.min,
      y: SHOP_TRUCK_BOUNDS.y.min,
      z: SHOP_TRUCK_BOUNDS.z.min,
    },
    {
      x: SHOP_TRUCK_BOUNDS.x.max,
      y: SHOP_TRUCK_BOUNDS.y.max,
      z: SHOP_TRUCK_BOUNDS.z.max,
    }
  );
}

function isInOwnTruck(obj) {
  return isBetween3d(
    obj.position,
    {
      x: OWN_TRUCK_BOUNDS.x.min,
      y: OWN_TRUCK_BOUNDS.y.min,
      z: OWN_TRUCK_BOUNDS.z.min,
    },
    {
      x: OWN_TRUCK_BOUNDS.x.max,
      y: OWN_TRUCK_BOUNDS.y.max,
      z: OWN_TRUCK_BOUNDS.z.max,
    }
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

function isInWarehouseFreezers(obj) {
  return isBetween3d(
    obj.position,
    {
      x: WAREHOUSE_FREEZERS_BOUNDS.x.min,
      y: WAREHOUSE_FREEZERS_BOUNDS.y.min,
      z: WAREHOUSE_FREEZERS_BOUNDS.z.min,
    },
    {
      x: WAREHOUSE_FREEZERS_BOUNDS.x.max,
      y: WAREHOUSE_FREEZERS_BOUNDS.y.max,
      z: WAREHOUSE_FREEZERS_BOUNDS.z.max,
    }
  );
}

function isInStallFreezer(obj) {
  return isBetween3d(
    obj.position,
    {
      x: STALL_FREEZER_BOUNDS.x.min,
      y: STALL_FREEZER_BOUNDS.y.min,
      z: STALL_FREEZER_BOUNDS.z.min,
    },
    {
      x: STALL_FREEZER_BOUNDS.x.max,
      y: STALL_FREEZER_BOUNDS.y.max,
      z: STALL_FREEZER_BOUNDS.z.max,
    }
  );
}

function isInStall(obj) {
  return isBetween3d(
    obj.position,
    { x: STALL_BOUNDS.x.min, y: STALL_BOUNDS.y.min, z: STALL_BOUNDS.z.min },
    { x: STALL_BOUNDS.x.max, y: STALL_BOUNDS.y.max, z: STALL_BOUNDS.z.max }
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
  x: { min: -196.07, max: -179 },
  y: { min: 13, max: 26.4 },
  z: { min: 1.1, max: 28.9 },
};
const STALL_FREEZER_BOUNDS = {
  x: { min: -183, max: -179.8 },
  y: { min: 15.4, max: 22.7 },
  z: { min: 2, max: 6.3 },
};
const WAREHOUSE_BOUNDS = {
  x: { min: -475, max: -435 },
  y: { min: 10, max: 32.2 },
  z: { min: -173, max: -109 },
};
const WAREHOUSE_FREEZERS_BOUNDS = {
  x: { min: -473.4, max: -468.4 },
  y: { min: 11.6, max: 25 },
  z: { min: -133.0, max: -118.1 },
};
const SHOP_TRUCK_BOUNDS = {
  x: { min: -467.4, max: -458.2 },
  y: { min: 17.7, max: 27.5 },
  z: { min: -107.7, max: -81.8 },
};
const OWN_TRUCK_BOUNDS = {
  x: { min: -456.5, max: -447.3 },
  y: SHOP_TRUCK_BOUNDS.y,
  z: SHOP_TRUCK_BOUNDS.z,
};

const OUTSIDE_DISTANCE = 100;

export {
  isInStallFreezer,
  isInStall,
  isInShopTruck,
  isInOwnTruck,
  isInWarehouse,
  isInWarehouseFreezers,
  isOutsideStall,
  isOutsideWarehouse,
  STALL_BOUNDS,
  WAREHOUSE_BOUNDS,
  OUTSIDE_DISTANCE
};
