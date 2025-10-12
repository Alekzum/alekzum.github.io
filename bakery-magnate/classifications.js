function isInStall(obj) {
  return (
    obj.position.z >= 2 &&
    obj.position.z <= 12 &&
    obj.position.y >= 14 &&
    obj.position.y <= 21 &&
    obj.position.x >= -195 &&
    obj.position.x <= -185
  );
}

function isBehindWindow(obj) {
  return (
    obj.position.z >= -2 &&
    obj.position.z <= 16 &&
    obj.position.y >= 0 &&
    obj.position.y <= 30 &&
    obj.position.x < -195
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
