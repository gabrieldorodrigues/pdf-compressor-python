const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const fs = require("fs");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "assets/icon.png"),
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("select-file", async (event, fileType = "pdf") => {
  let filters = [];

  if (fileType === "pdf") {
    filters = [{ name: "PDF Files", extensions: ["pdf"] }];
  } else if (fileType === "image") {
    filters = [
      { name: "Image Files", extensions: ["jpg", "jpeg", "png"] },
      { name: "JPEG Files", extensions: ["jpg", "jpeg"] },
      { name: "PNG Files", extensions: ["png"] },
    ];
  } else {
    filters = [
      {
        name: "All Supported Files",
        extensions: ["pdf", "jpg", "jpeg", "png"],
      },
      { name: "PDF Files", extensions: ["pdf"] },
      { name: "Image Files", extensions: ["jpg", "jpeg", "png"] },
    ];
  }

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: filters,
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    return {
      success: true,
      fileName,
      fileBuffer: Array.from(fileBuffer),
    };
  }

  return { success: false };
});

ipcMain.handle("save-file", async (event, fileName, fileBuffer) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: `compressed_${fileName}`,
    filters: [{ name: "PDF Files", extensions: ["pdf"] }],
  });

  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, Buffer.from(fileBuffer));
    return { success: true, filePath: result.filePath };
  }

  return { success: false };
});
