import React, { useState } from "react";
import { PDFCompressorService } from "../services/PDFCompressorService";
import "./PDFCompressor.css";

const PDFCompressor = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [progress, setProgress] = useState(0);
  const [compressionResult, setCompressionResult] = useState(null);

  const compressionOptions = {
    low: { quality: 0.3, description: "Baixa qualidade (menor arquivo)" },
    medium: { quality: 0.6, description: "Qualidade média (balanceado)" },
    high: { quality: 0.8, description: "Alta qualidade (arquivo maior)" },
  };

  const handleFileSelect = async () => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.selectFile();
        if (result.success) {
          setFile(new Uint8Array(result.fileBuffer));
          setFileName(result.fileName);
          setCompressionResult(null);
        }
      } else {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf";
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

  const compressPDF = async () => {
    if (!file) return;

    setIsCompressing(true);
    setProgress(10);
    setCompressionResult(null);

    try {
      setProgress(30);

      const result = await PDFCompressorService.compressPDF(
        file,
        compressionLevel
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
    <div className="pdf-compressor">
      <div className="compressor-card">
        <div className="file-section">
          <div className="file-input-area" onClick={handleFileSelect}>
            {fileName ? (
              <div className="file-selected">
                <div className="file-icon">📄</div>
                <div className="file-info">
                  <h3>{fileName}</h3>
                  <p>Clique para selecionar outro arquivo</p>
                </div>
              </div>
            ) : (
              <div className="file-placeholder">
                <div className="upload-icon">📁</div>
                <h3>Selecionar arquivo PDF</h3>
                <p>Clique aqui para escolher um arquivo PDF para comprimir</p>
              </div>
            )}
          </div>
        </div>

        <div className="options-section">
          <h3>Nível de Compressão</h3>
          <div className="compression-options">
            {Object.entries(compressionOptions).map(([key, option]) => (
              <label key={key} className="compression-option">
                <input
                  type="radio"
                  name="compression"
                  value={key}
                  checked={compressionLevel === key}
                  onChange={(e) => setCompressionLevel(e.target.value)}
                />
                <div className="option-content">
                  <span className="option-title">
                    {key === "low"
                      ? "Baixa"
                      : key === "medium"
                      ? "Média"
                      : "Alta"}
                  </span>
                  <span className="option-description">
                    {option.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="actions-section">
          {compressionResult && (
            <div className="compression-result">
              <h3>✅ Compressão Concluída!</h3>
              <div className="result-stats">
                <div className="stat">
                  <span className="stat-label">Tamanho Original:</span>
                  <span className="stat-value">
                    {PDFCompressorService.formatFileSize(
                      compressionResult.originalSize
                    )}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Tamanho Comprimido:</span>
                  <span className="stat-value">
                    {PDFCompressorService.formatFileSize(
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
              </div>
              {compressionResult.savedPath && (
                <p className="save-location">
                  📁 Salvo em: <code>{compressionResult.savedPath}</code>
                </p>
              )}
            </div>
          )}

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
              onClick={compressPDF}
              disabled={!file || isCompressing}
            >
              {isCompressing ? "Comprimindo..." : "Comprimir PDF"}
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
    </div>
  );
};

export default PDFCompressor;
