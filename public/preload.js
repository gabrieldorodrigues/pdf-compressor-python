const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFile: () => ipcRenderer.invoke("select-file"),
  saveFile: (fileName, fileBuffer) =>
    ipcRenderer.invoke("save-file", fileName, fileBuffer),
});
