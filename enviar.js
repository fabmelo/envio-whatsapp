const { ipcRenderer, remote } = require("electron");
var enviado = false;

function tempo() {
    var btnSend = document.getElementsByClassName("_3M-N-")[0];
    var inputSend = document.getElementsByClassName("_3u328")[0];
    if (typeof inputSend !== "undefined" && inputSend.textContent && !enviado) {
        btnSend.click();
        enviado = true;
    } else if (enviado) {
        ipcRenderer.send("para", { status: true });
        enviado = false;
    }
}

setInterval(tempo, 3000);
