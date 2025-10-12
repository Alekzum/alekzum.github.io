import React, { useState } from "react";
import { useBakeryMagnateHelper } from "./hooks/useBakeryMagnateHelper";
import {
  Container,
  Section,
  DownloadSection,
  TextArea,
  Button,
  ToggleButton,
  ReturnButton,
  Result,
  ResultsContainer,
  Stats,
  FileInfo,
  Classification,
  ClassBadge,
  ResultOutput,
} from "./styles";

function App() {
  const [inputData, setInputData] = useState("");
  const {
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
    serializeData,
  } = useBakeryMagnateHelper();

  const stats = getClassificationStats();

  const handleProcessData = () => {
    const result = processData(inputData);
    if (result.error) {
      alert(result.error);
    }
  };

  const handleReturn = () => {
    const result = handleReturnObjects();
    if (result.error) {
      alert(result.error);
    } else if (result.message) {
      alert(result.message);
    }
  };

  const handleDownload = () => {
    const result = downloadResult();
    if (result.error) {
      alert(result.error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Container>
      <h1>Bakery Magnate Helper</h1>

      <Section>
        <h3>1. Загрузка данных</h3>
        <div>
          <input type="file" onChange={handleFileChange} accept=".bm,.txt" />
          <FileInfo>{fileInfo}</FileInfo>
        </div>

        <div>
          <h4>Или вставьте данные вручную:</h4>
          <TextArea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Вставьте сырые данные здесь..."
          />
        </div>

        <Button onClick={handleProcessData}>Обработать данные</Button>
      </Section>

      <Section>
        <h3>2. Результаты обработки</h3>
        <Stats>
          Всего объектов: <strong>{currentObjects.length}</strong>
        </Stats>

        <Classification>
          <ClassBadge className="stall-badge">
            В ларьке: <span>{stats.objectsInStall}</span>
          </ClassBadge>
          <ClassBadge className="window-badge">
            За окном: <span>{stats.objectsBehindWindow}</span>
          </ClassBadge>
          <ClassBadge className="shop-truck-badge">
            В грузовике магазина: <span>{stats.objectsInShopTruck}</span>
          </ClassBadge>
          <ClassBadge className="own-truck-badge">
            В своем грузовике: <span>{stats.objectsInOwnTruck}</span>
          </ClassBadge>
          <ClassBadge className="warehouse-badge">
            На складе: <span>{stats.objectsInWarehouse}</span>
          </ClassBadge>
          <ClassBadge className="warehouse-cabinets-badge">
            В шкафах склада: <span>{stats.objectsInWarehouseCabinets}</span>
          </ClassBadge>
          <ClassBadge className="other-badge">
            Другие: <span>{stats.otherObjects}</span>
          </ClassBadge>
        </Classification>

        <ToggleButton onClick={() => setShowResults(!showResults)}>
          {showResults ? "Скрыть" : "Показать"} список объектов
        </ToggleButton>

        {showResults && (
          <ResultsContainer>
            {currentObjects.map((obj, index) => {
              const classification = getObjectClassification(obj);
              return (
                <Result key={index} className={classification.class}>
                  <strong>{obj.name}</strong> | Позиция: x={obj.position.x}, y=
                  {obj.position.y}, z={obj.position.z} |
                  {classification.text && ` ✓ ${classification.text}`}
                </Result>
              );
            })}
          </ResultsContainer>
        )}

        <ReturnButton onClick={handleReturn}>
          Вернуть вещи (только за окном)
        </ReturnButton>
      </Section>

      <DownloadSection>
        <h3>3. Скачать результат</h3>
        <div>
          <h4>Результат обработки:</h4>
          <ResultOutput
            value={serializeData()}
            readOnly
            placeholder="Здесь будут отображены данные для сохранения..."
          />
        </div>
        <Button onClick={handleDownload}>Скачать файл сохранения</Button>
        <FileInfo>{downloadInfo}</FileInfo>
      </DownloadSection>
    </Container>
  );
}

export default App;
