import { useState, useCallback } from "react";
import { parseData } from "../utils/parseData";
import { serializeData, returnObjects } from "../utils/operations";
import {
  isInStall,
  isBehindWindow,
  isInShopTruck,
  isInOwnTruck,
  isInWarehouse,
  isInWarehouseCabinets,
} from "../utils/classifications";

export function useBakeryMagnateHelper() {
  const [currentFileName, setCurrentFileName] = useState("dyn_obj.bm");
  const [showResults, setShowResults] = useState(false);
  const [currentObjects, setCurrentObjects] = useState([]);
  const [fileInfo, setFileInfo] = useState("Файл не выбран");
  const [downloadInfo, setDownloadInfo] = useState("");

  const processData = useCallback((input) => {
    if (!input.trim()) {
      return { error: "Введите данные или загрузите файл" };
    }

    try {
      const objects = parseData(input);
      setCurrentObjects(objects);
      return { objects };
    } catch (error) {
      return { error: error.message };
    }
  }, []);

  const handleReturnObjects = useCallback(() => {
    if (currentObjects.length === 0) {
      return { error: "Нет данных для обработки" };
    }

    try {
      const result = returnObjects([...currentObjects]);

      if (!result.success) {
        return { error: result.message };
      }

      setCurrentObjects(result.updatedObjects);
      return { message: result.message };
    } catch (error) {
      return { error: error.message };
    }
  }, [currentObjects]);

  const downloadResult = useCallback(() => {
    if (currentObjects.length === 0) {
      return { error: "Нет данных для скачивания" };
    }

    try {
      const data = serializeData(currentObjects);
      const blob = new Blob([data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = currentFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadInfo(`Файл "${currentFileName}" готов к скачиванию`);
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }, [currentObjects, currentFileName]);

  const handleFileUpload = useCallback(
    (file) => {
      setCurrentFileName(file.name);
      setFileInfo(`Выбран файл: ${file.name}`);

      const reader = new FileReader();
      reader.onload = (e) => {
        processData(e.target.result);
      };
      reader.readAsText(file);
    },
    [processData]
  );

  const getClassificationStats = useCallback(() => {
    const objectsInStall = currentObjects.filter(isInStall);
    const objectsBehindWindow = currentObjects.filter(isBehindWindow);
    const objectsInShopTruck = currentObjects.filter(isInShopTruck);
    const objectsInOwnTruck = currentObjects.filter(isInOwnTruck);
    const objectsInWarehouse = currentObjects.filter(isInWarehouse);
    const objectsInWarehouseCabinets = currentObjects.filter(
      isInWarehouseCabinets
    );

    const otherObjects =
      currentObjects.length -
      objectsInStall.length -
      objectsBehindWindow.length -
      objectsInShopTruck.length -
      objectsInOwnTruck.length -
      objectsInWarehouse.length -
      objectsInWarehouseCabinets.length;

    return {
      objectsInStall: objectsInStall.length,
      objectsBehindWindow: objectsBehindWindow.length,
      objectsInShopTruck: objectsInShopTruck.length,
      objectsInOwnTruck: objectsInOwnTruck.length,
      objectsInWarehouse: objectsInWarehouse.length,
      objectsInWarehouseCabinets: objectsInWarehouseCabinets.length,
      otherObjects,
    };
  }, [currentObjects]);

  const getObjectClassification = useCallback((obj) => {
    if (isInStall(obj)) return { class: "in-stall", text: "В ЛАРЬКЕ" };
    if (isBehindWindow(obj))
      return { class: "behind-window", text: "ЗА ОКНОМ" };
    if (isInShopTruck(obj))
      return { class: "in-shop-truck", text: "В ГРУЗОВИКЕ МАГАЗИНА" };
    if (isInOwnTruck(obj))
      return { class: "in-own-truck", text: "В СВОЕМ ГРУЗОВИКЕ" };
    if (isInWarehouse(obj)) return { class: "in-warehouse", text: "НА СКЛАДЕ" };
    if (isInWarehouseCabinets(obj))
      return { class: "in-warehouse-cabinets", text: "В ШКАФАХ СКЛАДА" };
    return { class: "other", text: "" };
  }, []);

  return {
    currentFileName,
    showResults,
    setShowResults,
    currentObjects,
    fileInfo,
    downloadInfo,
    processData,
    handleReturnObjects,
    downloadResult,
    handleFileUpload,
    getClassificationStats,
    getObjectClassification,
    serializeData: () => serializeData(currentObjects),
  };
}
