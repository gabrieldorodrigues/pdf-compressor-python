import React, { useState } from "react";
import PDFCompressor from "./components/PDFCompressor";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>PDF Compressor</h1>
        <p>Comprima seus arquivos PDF sem dependências externas</p>
      </header>
      <main>
        <PDFCompressor />
      </main>
    </div>
  );
}

export default App;
