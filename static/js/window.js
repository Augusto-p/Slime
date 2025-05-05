const { ipcRenderer } = require('electron');
document.getElementById('min-button').addEventListener('click', () => {
    ipcRenderer.send('Window:Minimize', winID);
  });
  
  
  
  document.getElementById('close-button').addEventListener('click', () => {
    ipcRenderer.send('Window:Close', winID);
  });