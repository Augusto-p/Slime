const { Notification,BrowserWindow, ipcMain } = require("electron")
const path = require('path');
const Logger = require('./Logger'); // Importar la clase Logger

const OWNER = "Augusto-p"
const REPO = "Smile"

class Update {
    constructor(Version) {
        this.logger = new Logger();
        this.Version = Version
    }

    W_minimize(){this.win.minimize();}
    W_close(){this.win.close();}
    W_isMaximized(){this.win.isMaximized();}
    W_restore(){this.win.restore();}
    W_maximize(){this.win.maximize();}

    async Check() {
        if (new Date().toISOString().split("T")[0] != this.logger.getLastLogDate("Update")) {
            let response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`)
            if (response.status == 200) {
                let data = await response.json()
                // this.logger.log("Update", "Check Update")
                if (data["tag_name"].replace("V", "") != this.Version) {
                    let notify = new Notification({
                        title: "New version of Smile available!",
                        body: `The ${data["tag_name"]}, versoion is now available, download now`
                    })
                    notify.on("click", () => {
                        this.win = new BrowserWindow({
                            width: 600,
                            height: 400,
                            frame: false, // ❌ sin barra superior
                            webPreferences: {
                                preload: path.join(__dirname, 'preload.js'),
                                nodeIntegration: true, // Actívalo solo si usas require en renderer
                                contextIsolation: false,

                            },
                        });
                        this.win.loadURL(`file://${__dirname}/Update.html?Version=${data["tag_name"]}`);
                    





                    })
                    notify.show()
                }
                return data["tag_name"].replace("V", "") != this.Version
            }
        }
        return false
    }

    async Download() {
        return ""
    }
}
module.exports = Update;