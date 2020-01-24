// Constantes
const { app, BrowserWindow, ipcMain, remote } = require('electron');
const path = require('path');
const express = require('express');

// Variável
let mainWindow;


/**
 * Função para criar a janela
 */
function createWindow() {

  var ex = express();

  // Instância da janela e parâmetros principais
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      partition: "persist:main",
      webSecurity: false
    }
  });

  // fechar janela
  ipcMain.on("para", (event, arg) => {
    if (arg.status)
      mainWindow.hide();
  });

  // rota para envio
  ex.get('/whats/:tel/:msg', (req, res) => {
    var telefone = req.params.tel;
    var mensagem = req.params.msg;
    enviarMensagem(telefone, mensagem);
    res.send("ENVIANDO MENSAGEM PELO WHATSAPP...")
  });

  // define porta do express
  ex.listen(3400);

  mainWindow.on('closed', () => {
    mainWindow = null
  });

}

/**
 * Função para envio de mensagens
 * @param {*} telefone 
 * @param {*} mensagem 
 */
function enviarMensagem(telefone, mensagem) {
  var url = `https://web.whatsapp.com/send?phone=${telefone}&text=${mensagem}`;
  mainWindow.loadURL(url, { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36' });
  mainWindow.webContents.executeJavaScript('const { ipcRenderer, remote } = require("electron"); var enviado = false; function tempo() { var btnSend = document.getElementsByClassName("_3M-N-")[0]; var inputSend = document.getElementsByClassName("_3u328")[0]; if (typeof inputSend !== "undefined" && inputSend.textContent && !enviado) { btnSend.click(); enviado = true; } else if (enviado) { ipcRenderer.send("para", { status: true }); enviado = false; } } setInterval(tempo, 3000);');
  mainWindow.show();
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', () => {
  if (mainWindow === null) createWindow()
});
