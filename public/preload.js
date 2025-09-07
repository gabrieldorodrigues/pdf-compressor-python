const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFile: (fileType) => ipcRenderer.invoke("select-file", fileType),
  saveFile: (fileName, fileBuffer) =>
    ipcRenderer.invoke("save-file", fileName, fileBuffer),
});
