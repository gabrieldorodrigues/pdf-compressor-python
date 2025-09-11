import React, { useState } from "react";
import { FileCompressorService } from "../services/FileCompressorService";
import FileTypeSelector from "./FileTypeSelector";
import "./FileCompressor.css";

const FileCompressor = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("pdf");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState(2); // 1=baixa, 2=média, 3=alta
  const [progress, setProgress] = useState(0);
  const [compressionResult, setCompressionResult] = useState(null);

  const getCompressionSettings = (level) => {
    const settings = {
      1: {
        quality: 0.3,
        description: "Baixa qualidade (menor arquivo)",
        name: "Baixa",
      },
      2: {
        quality: 0.6,
        description: "Qualidade média (balanceado)",
        name: "Média",
      },
      3: {
        quality: 0.8,
        description: "Alta qualidade (arquivo maior)",
        name: "Alta",
      },
    };
    return settings[level];
  };

  const getCurrentCompressionKey = () => {
    const keyMap = { 1: "low", 2: "medium", 3: "high" };
    return keyMap[compressionLevel];
  };

  const handleFileSelect = async () => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.selectFile(selectedFileType);
        if (result.success) {
          const fileType = FileCompressorService.getFileType(result.fileName);
          if (fileType && fileType === selectedFileType) {
            setFile(new Uint8Array(result.fileBuffer));
            setFileName(result.fileName);
            setCompressionResult(null);
          } else {
            alert("O arquivo selecionado não corresponde ao tipo escolhido.");
          }
        }
      } else {
        const input = document.createElement("input");
        input.type = "file";
        if (selectedFileType === "pdf") {
          input.accept = ".pdf";
        } else if (selectedFileType === "image") {
          input.accept = ".jpg,.jpeg,.png";
        }
        input.onchange = (e) => {
          const selectedFile = e.target.files[0];
          if (selectedFile) {
            setFileName(selectedFile.name);
            const reader = new FileReader();
            reader.onload = (e) => {
              setFile(new Uint8Array(e.target.result));
              setCompressionResult(null);
            };
            reader.readAsArrayBuffer(selectedFile);
          }
        };
        input.click();
      }
    } catch (error) {
      console.error("Erro ao selecionar arquivo:", error);
      alert("Erro ao selecionar arquivo: " + error.message);
    }
  };

  const compressFile = async () => {
    if (!file) return;

    setIsCompressing(true);
    setProgress(10);
    setCompressionResult(null);

    try {
      setProgress(30);

      const result = await FileCompressorService.compressFile(
        file,
        fileName,
        getCurrentCompressionKey()
      );

      setProgress(70);

      if (!result.success) {
        throw new Error(result.error);
      }

      setProgress(90);

      if (window.electronAPI) {
        const saveResult = await window.electronAPI.saveFile(
          fileName,
          Array.from(result.data)
        );
        if (saveResult.success) {
          setCompressionResult({
            ...result,
            savedPath: saveResult.filePath,
          });
        }
      } else {
        const blob = new Blob([result.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `compressed_${fileName}`;
        a.click();
        URL.revokeObjectURL(url);

        setCompressionResult(result);
      }

      setProgress(100);
    } catch (error) {
      console.error("Erro ao comprimir PDF:", error);
      alert("Erro ao comprimir PDF: " + error.message);
    } finally {
      setIsCompressing(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileName("");
    setProgress(0);
    setCompressionResult(null);
  };

  return (
    <div className="file-compressor">
      {compressionResult && (
        <div className="result-modal">
          <div className="compression-result card-center">
            <h3>✅ Compressão Concluída!</h3>
            <div className="result-stats">
              <div className="stat">
                <span className="stat-label">Tamanho Original:</span>
                <span className="stat-value">
                  {FileCompressorService.formatFileSize(
                    compressionResult.originalSize
                  )}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Tamanho Comprimido:</span>
                <span className="stat-value">
                  {FileCompressorService.formatFileSize(
                    compressionResult.compressedSize
                  )}
                </span>
              </div>
              <div className="stat highlight">
                <span className="stat-label">Redução:</span>
                <span className="stat-value">
                  {compressionResult.compressionRatio}%
                </span>
              </div>
              {compressionResult.newDimensions && (
                <div className="stat">
                  <span className="stat-label">Dimensões:</span>
                  <span className="stat-value">
                    {compressionResult.originalDimensions} → {compressionResult.newDimensions}
                  </span>
                </div>
              )}
            </div>
            {compressionResult.savedPath && (
              <p className="save-location">
                📁 Salvo em: <code>{compressionResult.savedPath}</code>
              </p>
            )}
            <button className="btn btn-secondary" onClick={resetForm} style={{marginTop: '1rem'}}>Fechar</button>
          </div>
          <div className="modal-blur" onClick={resetForm}></div>
        </div>
      )}
      {!compressionResult && (
        <div className="compressor-card">
          <FileTypeSelector
            selectedType={selectedFileType}
            onTypeChange={setSelectedFileType}
          />
          <div className="file-section">
            <div className="file-input-area" onClick={handleFileSelect}>
              {fileName ? (
                <div className="file-selected">
                  <div className="file-icon">
                    {selectedFileType === "pdf" ? "📄" : "🖼️"}
                  </div>
                  <div className="file-info">
                    <h3>{fileName}</h3>
                    <p>Clique para selecionar outro arquivo</p>
                  </div>
                </div>
              ) : (
                <div className="file-placeholder">
                  <div className="upload-icon">📁</div>
                  <h3>
                    Selecionar arquivo {selectedFileType === "pdf" ? "PDF" : "de imagem"}
                  </h3>
                  <p>
                    Clique aqui para escolher um arquivo {selectedFileType === "pdf" ? "PDF" : "de imagem"} para comprimir
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="options-section">
            <h3>Nível de Compressão</h3>
            <div className="compression-slider-container">
              <div className="slider-labels">
                <span className="label-min">Baixa</span>
                <span className="label-current">
                  {getCompressionSettings(compressionLevel).name}
                </span>
                <span className="label-max">Alta</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                value={compressionLevel}
                onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
                className="compression-slider"
              />
              <div className="compression-description">
                {getCompressionSettings(compressionLevel).description}
              </div>
            </div>
          </div>
          <div className="actions-section">
            {isCompressing && (
              <div className="progress-section">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p>Comprimindo... {progress}%</p>
              </div>
            )}
            <div className="button-group">
              <button
                className="btn btn-primary"
                onClick={compressFile}
                disabled={!file || isCompressing}
              >
                {isCompressing
                  ? "Comprimindo..."
                  : `Comprimir ${selectedFileType === "pdf" ? "PDF" : "Imagem"}`}
              </button>
              {file && (
                <button
                  className="btn btn-secondary"
                  onClick={resetForm}
                  disabled={isCompressing}
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileCompressor;
