const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const DATA_PATH = path.join(__dirname, 'data.json'); // file to store products


function ensureDataFile() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, '[]', 'utf-8');
  }
}


function readProducts() {
  ensureDataFile();
  const data = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(data);
}


function saveProducts(products) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2), 'utf-8');
}

// 🧩 Create Electron window
function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  win.loadFile('index.html');
}


ipcMain.handle('load-products', () => {
  return readProducts();
});

ipcMain.on('save-products', (event, products) => {
  saveProducts(products);
});

app.whenReady().then(() => {
  ensureDataFile();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
