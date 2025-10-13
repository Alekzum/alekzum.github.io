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

function parseData(rawString) {
  let raw_objects = rawString.split("№").slice(0, -1);
  let result = raw_objects.map((raw_object) => {
    let raw_data = raw_object.split("|").slice(0, -1);
    let obj = {
      name: raw_data[0],
      position: JSON.parse(raw_data[1]),
      rotation: JSON.parse(raw_data[2]),
      data: JSON.parse(raw_data[3]),
    };
    return obj;
  });
  return result;
}
