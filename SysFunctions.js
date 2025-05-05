const path = require('path');
const fs = require('fs-extra');
const mime = require("mime-types");
const archiver = require('archiver');
const AdmZip = require('adm-zip');

function MakeFolder(Name) {
    let Path = path.join(ClearPath(ActualPath), Name);
    return fs.mkdirSync(Path);
}

async function OpenTerminalInFolder(Folder = "") {
    let Terminal;
    if (Config["Terminal"] == null || !await ExistTerminalApp(Config["Terminal"])) {
        let terminals = [
            "gnome-terminal", "konsole", "xterm", "terminator", "alacritty", "tilix", "uxterm", "lilyterm", "kitty", "urxvt", "sakura", "tilda", "xfce4-terminal", "qterminal", "deepin-terminal", "mate-terminal", "termux", "eterm", "lxterminal", "st", "wezterm", "zoc", "mosh", "hyper", "guake", "yakuake", "xfce4-terminal", "bash-it", "cockpit", "cool-retro-term", "roxterm", "screen", "tmux", "sway", "wf-term", "ii", "mrxvt", "i3bar", "xmonad", "i3-lemonbar", "./script.sh", "vte", "nvim", "wayland-terminal", "dvtm", "conky", "dwm", "alpine", "zenity", "aterm", "stumpwm", "proton", "wterm", "cool-retro-term", "x11term", "pterm", "zterm", "i3", "tiling-terminal", "cmder",
            "grit", "wmii", "bash-it", "mutt", "stuntwm", "i3bar", "surf", "xmonad", "termcolor", "qemu", "xterm", "hyper", "lxterminal", "zoc", "saki", "wf-term",
            "terminus", "xwint", "wezterm", "termux", "conky", "openbox", "cockpit", "pterm", "wterm", "vte", "ranger", "wmaker", "sway", "zsh", "xfce4-terminal", "mosh", "emacs -nw", "jwm", "aterm", "urxvt", "guake"];
        let cont = 0;
        do {
            Terminal = terminals[cont];
            cont++;
        } while (! await ExistTerminalApp(Terminal));
    } else {
        Terminal = Config["Terminal"];
    }
    await runBashCommand(`cd "${Folder}" || exit 1;"${Terminal}" &`);
}

async function ExistTerminalApp(TerminalApp) {
    let command = `
        if command -v "${TerminalApp}" >/dev/null 2>&1; then
            echo 1
        else
            echo 0
        fi `;
    let respuesta = await runBashCommand(command);
    return respuesta == 1;
}

function OpenFile(Path) {
    runBashCommand(`xdg-open "${Path}"`);
}

function ListFolder(Path) {
    let Resultado = [];
    Path = ClearPath(Path);
    let List = fs.readdirSync(Path,);
    for (const Name of List) {
        if (!Config["HiddenFiles"] && Name[0] === ".") {
            continue;
        }
        const fullPath = path.join(Path, Name);
        const starts = fs.statSync(fullPath);
        const mimeType = mime.lookup(fullPath);
        let Type = starts.isDirectory() ? 0 : 1;
        const Perm = (starts.mode & 0o777).toString(8);
        Resultado.push({
            "Path": fullPath,
            "Name": Name,
            "Type": Type,
            "Mime-type": mimeType,
            "Permissions": Perm,
            "Link": fs.lstatSync(fullPath).isSymbolicLink()
        })
    }
    return Resultado.sort(FilesSort);
}

function MoveFile(Name, Folder, Path) {
    fs.renameSync(Path, path.join(Folder, Name))
    ViewFolder(ActualPath)
}


async function MoveToTrash(Name, Path, Type) {
    if (!await ipcRenderer.invoke('SelectedFiles:Void')) {
        let FilesSelected = await ipcRenderer.invoke('SelectedFiles:Get');
        FilesSelected.forEach(async File => {
            Path = File.Path;
            Name = File.Name;
            Type = File.Type;
            const ID = await Trash_ADD(Name, Path, Type);
            let Extencion = `${path.extname(Name)}`
            if (Type == 0) { Extencion = "" }
            let TrashPath = path.join($TRASH, `${NumberToText(ID)}${Extencion}`);
            fs.renameSync(Path, TrashPath);
            ViewFolder(ActualPath);
        });
    } else {
        const ID = await Trash_ADD(Name, Path, Type);
        let Extencion = `${path.extname(Name)}`
        if (Type % 2 == 0) { Extencion = "" }
        let TrashPath = path.join($TRASH, `${NumberToText(ID)}${Extencion}`);
        fs.moveSync(Path, TrashPath, { overwrite: false });
        ViewFolder(ActualPath);
    }

}

async function DeleteFile(Path, ID) {
    const FileName = `${NumberToText(ID)}${path.extname(Path)}`
    const TrashPath = path.join($TRASH, FileName)
    fs.removeSync(TrashPath)
    await ipcRenderer.invoke('Trash:delete', ID);
}

async function RestureFile(Path, ID) {
    const FileName = `${NumberToText(ID)}${path.extname(Path)}`
    const TrashPath = path.join($TRASH, FileName)
    fs.moveSync(TrashPath, Path);
    await ipcRenderer.invoke('Trash:delete', ID);
}

async function PasteFile() {
    let ClipBoard = await ipcRenderer.invoke('ClipBoard:Get');
    ClipBoard.forEach((CACF, i) => {
        if (CACF.Mode == 0) {
            if (CACF.Type == 0) {
                fs.copyFileSync(CACF.Path, path.join(ClearPath(ActualPath), CACF.Name));
            } else if (CACF.Type == 1) {
                fs.cpSync(CACF.Path, path.join(ClearPath(ActualPath), CACF.Name), { recursive: true });
            }
        } else if (CACF.Mode == 1) {
            let NewPath = path.join(ClearPath(ActualPath), CACF.Name);
            fs.renameSync(CACF.Path, NewPath);
            ipcRenderer.send('ClipBoard:CutToCopy', i, NewPath);
        }
        ViewFolder(ActualPath);
    });
}

function RenameFile(Path, Name) {
    fs.renameSync(Path, path.join(path.dirname(Path), Name));
    ViewFolder(ActualPath);
}

async function ListDevice() {
    let Data = await runBashCommand(`
        #!/bin/bash
    first=true;echo -n "["
    lsblk -np -o NAME,TYPE,SIZE,MOUNTPOINT,MODEL -P | grep -E 'TYPE="part"|TYPE="rom"' | while read -r line; do
        dev_path=$(echo "$line" | grep -oP 'NAME="\\K[^"]+')
        dev_type=$(echo "$line" | grep -oP 'TYPE="\\K[^"]+')
        dev_size=$(echo "$line" | grep -oP 'SIZE="\\K[^"]+')
        MOUNTPOINT=$(echo "$line" | grep -oP 'MOUNTPOINT="\\K[^"]*');dev_mount="`+ '${MOUNTPOINT:-Not mounted}' + `"
        MODEL=$(echo "$line" | grep -oP 'MODEL="\\K[^"]*');dev_model="`+ '${MODEL:-Unknown}' + `"
        if echo "$dev_mount" | grep -qE '(^|/)(boot|boot/efi)'; then continue;fi
        if echo "$dev_mount" | grep -iq 'swap'; then continue;fi
        if echo "$dev_model" | grep -iq 'swap'; then continue;fi
        #dev_model=$(echo  "$dev_model");dev_mount=$(echo "$dev_mount")
        info=$(udevadm info --query=all --name="$dev_path" 2>/dev/null)
        if echo "$info" | grep -q "ID_CDROM=1"; then device_type="CD/DVD"
        elif echo "$info" | grep -q "ID_USB_DRIVER=usb-storage"; then device_type="USB"
        elif echo "$info" | grep -q "ID_DRIVE_FLASH_SD=1"; then device_type="SD Card"
        elif echo "$info" | grep -q "ID_DRIVE_FLASH=1"; then device_type="Flash Drive"
        elif echo "$info" | grep -qE 'ID_MODEL=.*(Phone|Android)'; then device_type="Phone"
        else device_type="Internal Hard Drive";fi
        if [ "$first" = true ]; then first=false; else echo -n ","; fi
        echo -n "`+ '{\\"device\\": \\"${dev_path:-Unknown}\\",\\"type\\": \\"${device_type}\\",\\"size\\": \\"${dev_size}\\",\\"mount_point\\": \\"${dev_mount}\\",\\"model\\": \\"${dev_model}\\"}"' + `
    done
    mount | grep -E 'type (vboxsf|vmhgfs|9p|virtiofs|prl_fs)' | while read -r line; do
        dev_path="shared"
        device_type="Shared Folder"
        dev_size="N/A"
        dev_mount=$(echo "$line" | awk '{print $3}')
        dev_model=$(echo "$line" | awk '{print $1}')
        echo -n ","
        `+ 'echo -n "{\\"device\\": \\"${dev_path}\\","\\"type\\": \\"${device_type}\\","\\"size\\": \\"${dev_size}\\","\\"mount_point\\": \\"${dev_mount}\\","\\"model\\": \\"${dev_model}\\"}"' + `
    done
    echo "]"`)
    if (Data[1] === ',') {
        Data = Data[0] + Data.slice(2)
    }
    Data = Data.replaceAll('"Unknown"', null)
    return JSON.parse(Data);

}

function runBashCommand(command) {


    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                // Puedes elegir rechazar o resolver también con stderr
                console.warn(`Stderr: ${stderr}`);
            }
            resolve(stdout.trim());
        });
    });
}
async function MakeZip(Name, Files) {
    if (Name == null && Files.length == 1) {
        Name = path.basename(path.basename(Files[0]));
    } else if (Name == null) {
        Name = path.basename(ClearPath(ActualPath));
    }
    return new Promise((resolve, reject) => {
        let ZipPath = path.join(ClearPath(ActualPath), `${Name}.zip`);
        let Version = 1;
        while (fs.existsSync(ZipPath)) {
            ZipPath = path.join(ClearPath(ActualPath), `${Name}_V${Version}.zip`);
            Version++
        }
        const ouput = fs.createWriteStream(ZipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        ouput.on('close', () => {
            resolve(ZipPath);
        })
        archive.on("error", (err) => {
            reject(err);
        })

        archive.pipe(ouput);
        Files.forEach(File => {
            if (fs.existsSync(File)) {
                archive.file(File, { name: path.basename(File) });
            }
        });
        archive.finalize();
    })

}

async function ExtractZip(File) {
    const Path = File.replace(".zip", "");
    return new Promise((resolve, reject) => {
        if (fs.existsSync(File)) {
            if (fs.existsSync(Path)) {
                Path = path.join(Path, path.basename(Path));
                fs.mkdirSync(Path, { recursive: true });
            }
            const zip = new AdmZip(File);
            zip.extractAllTo(Path, true);
            resolve();
        }
        reject();
    });

}

function MakeLink(Path, Name, Type) {
    if (Name == null) {
        Name = `Access_${path.basename(Path)}`;
    }
    const LinkPath = path.join(path.dirname(Path), Name);
    fs.symlinkSync(Path, LinkPath, Type);
}