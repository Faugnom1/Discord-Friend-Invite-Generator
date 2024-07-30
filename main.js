const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  clipboard,
  Notification,
  shell,
} = require("electron");
const { spawn } = require("child_process");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");

  // Remove the default menu
  Menu.setApplicationMenu(null);
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

ipcMain.on("open-external-link", (event, url) => {
  shell.openExternal(url);
});

ipcMain.on("generate-link", (event, token) => {
  const pythonProcess = spawn("python", ["python/app.py", token]);

  let output = "";
  let error = "";

  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    error += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code === 0 && output.startsWith("https://")) {
      clipboard.writeText(output.trim());
      new Notification({
        title: "Link Copied",
        body: "The invite link has been copied to your clipboard.",
      }).show();
      event.reply("link-generated", { success: true, link: output.trim() });
    } else {
      event.reply("link-generated", { success: false, error: error || output });
    }
  });
});
