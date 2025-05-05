const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./TrashDB');
const OpenWith = require('./OpenWith')
const OpenWithed = new OpenWith()
const Update = require("./Update");
const { exec, execFile } = require('child_process');
const Updated = new Update(app.getVersion())

OpenWithed.MakeList()
let Windows = {}
function createWindow(width, height, Path) {

    let win = new BrowserWindow({
      width: width,
      height: height,
      frame: false, // ❌ sin barra superior
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true, // Actívalo solo si usas require en renderer
        contextIsolation: false,
        
      },
    });
  
  win.loadURL(`file://${__dirname}/index.html?winID=${win.id}&Path=${Path??""}`);
  Windows[win.id] = win
}


ipcMain.on('Window:Minimize', (e,id) => {if (id == -1) {Updated.W_minimize();}else{Windows[id].minimize();}});
ipcMain.on('Window:Maximize', (e,id) => {
  if (id == -1) {
    Updated.W_isMaximized() ? Updated.W_restore() : Updated.W_maximize();
  }else{
    Windows[id].isMaximized() ? Windows[id].restore() : Windows[id].maximize();
  }}
);
ipcMain.on('Window:Close', (e,id) => {if (id == -1) {Updated.W_close();}else{Windows[id].close();}});
ipcMain.on('Window:New', (e, Path) => {createWindow(1080, 800, Path);});
ipcMain.handle('Trash:getAll', async () => {return db.getAll();});
ipcMain.handle('Trash:add', async (event, data) => {return db.add(data);});
ipcMain.handle('Trash:delete', async (event, id) => {return db.delete(id);});
ipcMain.handle('Trash:update', async (event, data) => {return db.update(data);});
ipcMain.handle('App:Update', async ()=>{return Updated.Check()})

let ClipBoard = [];
ipcMain.handle('ClipBoard:Add', (e,Data) => {ClipBoard = Data});
ipcMain.handle('ClipBoard:Get', () => {return ClipBoard});
ipcMain.on('ClipBoard:IsCuted', (e, Path) => { e.returnValue= ClipBoard.filter(e=>e.Mode==1).map(e=>e.Path).includes(Path)});
ipcMain.on('ClipBoard:CutToCopy', (e, i, NewPath) => {ClipBoard[i].Mode = 0; ClipBoard[i].Path = NewPath });
ipcMain.on('ClipBoard:Clear', () => {ClipBoard = []});

let SelectedFiles = {};
SelectedFiles["Window"] = undefined;
SelectedFiles["Files"] = [];
SelectedFiles["Size"] = 0;
ipcMain.on('SelectedFiles:Add', (e,winID, Data) => {
  
  if (SelectedFiles["Window"] !== winID) {
    if (SelectedFiles["Window"]!=undefined) {
      Windows[SelectedFiles["Window"]].webContents.send("SelectedFiles:UnSelected")
    }
    SelectedFiles["Files"] = [];
    SelectedFiles["Window"] = winID;
    SelectedFiles["Size"] = 0;
  }
  SelectedFiles["Files"].push(Data);
  SelectedFiles["Size"] += 1;
});
ipcMain.handle('SelectedFiles:Get', () => {return SelectedFiles["Files"]});
ipcMain.handle('SelectedFiles:Size', () => {return SelectedFiles["Size"]});
ipcMain.handle('SelectedFiles:First', () => {return SelectedFiles["Files"][0]});
ipcMain.handle('SelectedFiles:Last', () => {return SelectedFiles["Files"][SelectedFiles["Size"]-1]});
ipcMain.handle('SelectedFiles:Void', () => {return SelectedFiles["Size"] == 0});
ipcMain.on('SelectedFiles:Clear', () => {
  if (SelectedFiles["Window"]!=undefined) {
    Windows[SelectedFiles["Window"]].webContents.send("SelectedFiles:UnSelected")
    SelectedFiles["Files"] = []; 
    SelectedFiles["Window"]=undefined; 
    SelectedFiles["Size"] = 0;
  }
});


ipcMain.handle('OpenWith:Get', (e,Path) =>{const Data =OpenWithed.Get(Path); return JSON.parse(JSON.stringify(Data))})
ipcMain.on('OpenWith:SetDefault', (e,key,Path) =>{OpenWithed.SetDefault(key,Path);})
ipcMain.on('OpenWith:Open', (e,Command,Path) =>{exec(`${Command.replace(/%.{1}/, '')} ${Path} &`);});
ipcMain.handle('OpenWith:OpenDefault', (e,Path) =>{
  return new Promise((resolve) => {
    execFile('xdg-open', [path], (error) => {
      if (error) {resolve(false);} else {resolve(true);}
    });
  });
});


app.whenReady().then(() => {
  db.init(); // crear tabla si no existe
  Updated.Check()
  createWindow(1080, 800);
});