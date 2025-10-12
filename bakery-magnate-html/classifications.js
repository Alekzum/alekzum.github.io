function isInStall(obj) {
  return (
    obj.position.x >= -195.3 &&
    obj.position.x <= -179.6 &&
    obj.position.y >= 13.4 &&
    obj.position.y <= 21.0 &&
    obj.position.z >= 1.7 &&
    obj.position.z <= 27.3
  );
}

function isBehindWindow(obj) {
  return (
    obj.position.z >= -2 &&
    obj.position.z <= 16 &&
    obj.position.y >= 0 &&
    obj.position.y <= 30 &&
    obj.position.x < -195.3
  );
}

function isInShopTruck(obj) {
  return (
    obj.position.x >= -466.6 &&
    obj.position.x <= -458.6 &&
    obj.position.y >= 18.6 &&
    obj.position.y <= 27.5 &&
    obj.position.z >= -107.1 &&
    obj.position.z <= -82.3
  );
}

function isInOwnTruck(obj) {
  return (
    obj.position.x >= -456.1 &&
    obj.position.x <= -447.9 &&
    obj.position.y >= 18.6 &&
    obj.position.y <= 27.5 &&
    obj.position.z >= -107.1 &&
    obj.position.z <= -82.3
  );
}

function isInWarehouse(obj) {
  return (
    obj.position.x >= -474.3 &&
    obj.position.x <= -437.2 &&
    obj.position.y >= 11.6 &&
    obj.position.y <= 16.5 &&
    obj.position.z >= -172.0 &&
    obj.position.z <= -110.6
  );
}

function isInWarehouseCabinets(obj) {
  return (
    obj.position.x >= -473.2 &&
    obj.position.x <= -467.2 &&
    obj.position.y >= 11.5 &&
    obj.position.y <= 25.2 &&
    obj.position.z >= -133.3 &&
    obj.position.z <= -117.9
  );
}
