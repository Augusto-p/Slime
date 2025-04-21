const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./TrashDB');
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1080,
    height: 800,
    frame: false, // ❌ sin barra superior
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Actívalo solo si usas require en renderer
      contextIsolation: false,
    }
  });

win.loadFile('index.html');
}
ipcMain.on('Window:Minimize', () => {win.minimize();});
ipcMain.on('Window:Maximize', () => {win.isMaximized() ? win.restore() : win.maximize();});
ipcMain.on('Window:Close', () => {win.close();});
ipcMain.handle('Trash:getAll', async () => {return db.getAll();});
ipcMain.handle('Trash:add', async (event, data) => {return db.add(data);});
ipcMain.handle('Trash:delete', async (event, id) => {return db.delete(id);});
ipcMain.handle('Trash:update', async (event, data) => {return db.update(data);});



app.whenReady().then(() => {
  db.init(); // crear tabla si no existe
  createWindow();
});