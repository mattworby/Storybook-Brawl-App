const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const {ipcMain} = require('electron')


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {

  const displays = screen.getAllDisplays()
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  });

  let boundsX;
  let height;

  if (externalDisplay) {
    boundsX = externalDisplay.bounds.x;
    height = externalDisplay.bounds.height;
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width:200,
    height:height - (height - Math.floor(height * .80)),
    x: boundsX - 200,
    y: (height - Math.floor(height * .80)),
    transparent:true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false
    },
    resizable: false,
    show:true
  });

  mainWindow.setAlwaysOnTop(true, 'screen');

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('resize-window', (event) => {

  const displays = screen.getAllDisplays()
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  });

    let browserWindow = BrowserWindow.fromWebContents(event.sender);
    let boundsX;
    let width;
    let height;

    if (externalDisplay) {
      boundsX = externalDisplay.bounds.x;
      height = externalDisplay.bounds.height;
    }

    if (browserWindow.getBounds().width < 250){
      width = 1274;
    } else {
      width = 200;
    }

    browserWindow.setBounds({x: (boundsX - width - 25),y:(height - Math.floor(height * .80)), width:width, height:height - (height - Math.floor(height * .80))});

})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
