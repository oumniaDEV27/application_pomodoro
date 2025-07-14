const { app, BrowserWindow, ipcMain, powerSaveBlocker } = require('electron');
const path = require('path');

let mainWindow;
let powerSaveId;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('auth.html').catch(err => {
    console.error("Erreur lors du chargement de auth.html :", err);
  });

  powerSaveId = powerSaveBlocker.start('prevent-app-suspension');

  mainWindow.on('closed', () => {
    if (powerSaveBlocker.isStarted(powerSaveId)) {
      powerSaveBlocker.stop(powerSaveId);
    }
    mainWindow = null;
  });
}

function createHistoryWindow() {
  const historyWindow = new BrowserWindow({
    width: 500,
    height: 600,
    title: 'Historique Pomodoro',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  historyWindow.loadFile('stats.html').catch(err => {
    console.error("Erreur lors du chargement de stats.html :", err);
  });
}

function createSettingsWindow() {
  const settingsWindow = new BrowserWindow({
    width: 500,
    height: 500,
    title: 'Paramètres',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  settingsWindow.loadFile('settings.html').catch(err => {
    console.error("Erreur lors du chargement de settings.html :", err);
  });
}

app.whenReady().then(() => {
  createMainWindow();

  ipcMain.on('open-history-window', () => {
    createHistoryWindow();
  });

  ipcMain.on('open-settings-window', () => {
    createSettingsWindow();
  });

  ipcMain.on('reload-main-window', () => {
    if (mainWindow) {
      mainWindow.reload();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
