const { ipcRenderer } = require('electron');
const { exec } = require('child_process');




require("dotenv").config();
document.getElementById('min-button').addEventListener('click', () => {
  ipcRenderer.send('Window:Minimize');
});

document.getElementById('max-button').addEventListener('click', () => {
  ipcRenderer.send('Window:Maximize');
});

document.getElementById('close-button').addEventListener('click', () => {
  ipcRenderer.send('Window:Close');
});



const IconsPath = path.join(__dirname, 'static/json/icons.json');
const icons = JSON.parse(fs.readFileSync(IconsPath, 'utf-8'));

const BookmarksPath = path.join(__dirname, 'static/json/Bookmarks.json');
const Bookmarks = JSON.parse(fs.readFileSync(BookmarksPath, 'utf-8'))["Bookmarks"];

const FolderNamePath = path.join(__dirname, 'static/json/FolderName.json');
const FolderName = JSON.parse(fs.readFileSync(FolderNamePath, 'utf-8'));
function getFolderIconContent(name) {
  if(name[0] == "."){
    name = name.slice(1);
  }
  filePath = FolderName[name.toLowerCase()]
  if (filePath == undefined) {
    filePath = "folder";
  }
  
  if (fs.existsSync(path.join(__dirname,`static/icons/${filePath}.svg`))) {   
    return fs.readFileSync(path.join(__dirname,`static/icons/${filePath}.svg`), 'utf-8');
  }else{
    return fs.readFileSync(path.join(__dirname,`static/icons/folder.svg`), 'utf-8');
  }
}

const FileNamePath = path.join(__dirname, 'static/json/FileName.json');
const FileName = JSON.parse(fs.readFileSync(FileNamePath, 'utf-8'));

const FileExtensionPath = path.join(__dirname, 'static/json/FileExtension.json');
const FileExtension = JSON.parse(fs.readFileSync(FileExtensionPath, 'utf-8'));

const ShortCutPath = path.join(__dirname, 'static/json/ShortCut.json');
const ShortCuts = JSON.parse(fs.readFileSync(ShortCutPath, 'utf-8'));


function getFileIconContent(name) {
  if(name[0] == "."){
    name = name.slice(1);
  }
  
  let ext = name.split(".")[name.split(".").length -1];
  filePath = FileExtension[ext];
  if (filePath == undefined) {
    filePath = FileName[name];
    if (filePath == undefined) {
      filePath = "file";
    }
  }
  if (fs.existsSync(path.join(__dirname,`static/icons/${filePath}.svg`))) {   
    return fs.readFileSync(path.join(__dirname,`static/icons/${filePath}.svg`), 'utf-8');
  }else{
    return fs.readFileSync(path.join(__dirname,`static/icons/file.svg`), 'utf-8');
  }
}