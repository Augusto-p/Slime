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
        let Type;
        if (starts.isDirectory()) {
            Type = "Directory";
        } else if (starts.isFile()) {
            Type = "File";
        }
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

async function MoveToTrash(Name, Path, Type) {
    if (SelectedFiles.length != 0) {
        CopyAndCutFile = [];
        SelectedFiles.forEach(async File => {
            Path = File.btn.getAttribute("Data-Path");
            Name = File.btn.getAttribute("Data-Name");
            Type = File.btn.getAttribute("Data-Type");
            const ID = await Trash_ADD(Name, Path, Type);
            let Extencion = `${path.extname(Name)}`
            if (Type % 2 == 0) { Extencion = "" }
            let TrashPath = path.join($TRASH, `${NumberToText(ID)}${Extencion}`);
            fs.renameSync(Path, TrashPath);
            ViewFolder(ActualPath);
        });
    } else {
        if (Path == undefined) {
            Path = ActualFile.getAttribute("Data-Path");
            Name = ActualFile.getAttribute("Data-Name");
            Type = ActualFile.getAttribute("Data-Type");
        }
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

function PasteFile() {
    CopyAndCutFile.forEach(CACF => {
        if (CACF.Mode == 0) {
            if (CACF.Type == 0) {
                fs.copyFileSync(CACF.Path, path.join(ClearPath(ActualPath), CACF.Name));
            } else if (CACF.Type == 1) {
                fs.cpSync(CACF.Path, path.join(ClearPath(ActualPath), CACF.Name), { recursive: true });
            }
            ViewFolder(ActualPath);
        } else if (CACF.Mode == 1) {
            let NewPath = path.join(ClearPath(ActualPath), CACF.Name);
            fs.renameSync(CACF.Path, NewPath);
            ViewFolder(ActualPath);
            CACF.Path = NewPath;
            CACF.Mode = 0;
        }
    });
}

function RenameFile(Path, Name) {
    fs.renameSync(Path, path.join(path.dirname(Path), Name));
    ViewFolder(ActualPath);
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