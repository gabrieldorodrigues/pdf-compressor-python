import React from "react";
import { FileCompressorService } from "../services/FileCompressorService";
import "./FileTypeSelector.css";

const FileTypeSelector = ({ selectedType, onTypeChange }) => {
  const supportedTypes = FileCompressorService.getSupportedTypes();

  return (
    <div className="file-type-selector">
      <h3>Tipo de Arquivo</h3>
      <div className="type-options">
        {Object.entries(supportedTypes).map(([key, type]) => (
          <label key={key} className="type-option">
            <input
              type="radio"
              name="fileType"
              value={key}
              checked={selectedType === key}
              onChange={(e) => onTypeChange(e.target.value)}
            />
            <div className="type-content">
              <div className="type-icon">{type.icon}</div>
              <div className="type-info">
                <span className="type-name">{type.name}</span>
                <span className="type-description">{type.description}</span>
                <span className="type-extensions">
                  {type.extensions.map((ext) => `.${ext}`).join(", ")}
                </span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FileTypeSelector;
