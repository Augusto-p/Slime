const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
class OpenWith {
    Paths = ["/usr/share/applications", `${process.env.HOME}/.local/share/applications`]
    constructor() { }

    MakeList() {
        let MimeTypes = JSON.parse(fs.readFileSync(path.join(__dirname, 'static/json/OpenWith/MimeTypes.json'), 'utf-8'));
        let Desktops = JSON.parse(fs.readFileSync(path.join(__dirname, 'static/json/OpenWith/Desktops.json'), 'utf-8'));
        this.Paths.forEach(Path => {
            const ListDir = fs.readdirSync(Path)
            ListDir.forEach(desktop => {
                if (!Object.keys(Desktops).includes(desktop)) {
                    const dato = fs.readFileSync(path.join(Path, desktop)).toString()
                    const data = dato.split("\n")
                    const Command = data.find(line => line.startsWith("Exec=")) ?? "";
                    const Name = data.find(line => line.startsWith("Name=")) ?? "";
                    const Icon = data.find(line => line.startsWith("Icon=")) ?? ""
                    const MimeType = data.find(line => line.startsWith("MimeType=")) ?? "";

                    Desktops[desktop] = {
                        "Name": Name.replace("Name=", ""),
                        "Icon": this.resolveIconPath(Icon.replace("Icon=", "")),
                        "Command": Command.replace("Exec=", "")
                    }
                    MimeType.replace("MimeType=", "").split(";").filter(e => e != "").forEach(Type => {
                        if (!Object.keys(MimeTypes).includes(Type)) {
                            MimeTypes[Type] = [];
                        }
                        if (!Object.keys(MimeTypes[Type]).includes(desktop)) {
                            MimeTypes[Type].push(desktop);
                        }

                    });

                }
            });
        });

        fs.writeFileSync(path.join(__dirname, 'static/json/OpenWith/MimeTypes.json'), JSON.stringify(MimeTypes));
        fs.writeFileSync(path.join(__dirname, 'static/json/OpenWith/Desktops.json'), JSON.stringify(Desktops));

    }

    resolveIconPath(iconName) {
        const home = process.env.HOME || process.env.USERPROFILE;
        const iconDirs = [
            path.join(home, '.local', 'share', 'icons'),
            path.join(home, '.icons'),
            '/usr/share/icons/hicolor',
            '/usr/share/icons',
            '/usr/share/pixmaps'
        ];
        const extensions = ['png', 'svg', 'jpg', 'jpeg', 'gif', 'xpm'];

        // Si ya es una ruta absoluta y existe
        if (path.isAbsolute(iconName) && fs.existsSync(iconName)) {
            return iconName;
        }

        // Buscar directamente en los directorios
        for (const dir of iconDirs) {
            for (const ext of extensions) {
                const candidate = path.join(dir, `${iconName}.${ext}`);
                if (fs.existsSync(candidate)) {
                    return candidate;
                }
            }

            // Búsqueda más profunda en subdirectorios
            const result = this.searchRecursively(dir, iconName, extensions);
            if (result) {
                return result;
            }
        }

        // No encontrado
        return null;
    }

    searchRecursively(baseDir, iconName, extensions) {
        if (!fs.existsSync(baseDir)) return null;

        const entries = fs.readdirSync(baseDir, { withFileTypes: true }).reverse();

        for (const entry of entries) {
            const fullPath = path.join(baseDir, entry.name);

            if (entry.isDirectory()) {
                const found = this.searchRecursively(fullPath, iconName, extensions);
                if (found) return found;
            } else if (entry.isFile()) {
                for (const ext of extensions) {
                    if (entry.name === `${iconName}.${ext}`) {
                        return fullPath;
                    }
                }
            }
        }

        return null;
    }

    Get(Path) {
        let Responce = {}
        let Type = execSync(`xdg-mime query filetype "${Path}"`).toString().replace("\n", "")
        let Default = execSync(`xdg-mime query default ${Type}`).toString().replace("\n", "")
        let MimeTypes = JSON.parse(fs.readFileSync(path.join(__dirname, 'static/json/OpenWith/MimeTypes.json'), 'utf-8'));
        let DesktopsJson = [...new Set(Object.entries(JSON.parse(fs.readFileSync(path.join(__dirname, 'static/json/OpenWith/Desktops.json'), 'utf-8'))))]
        let Desktops = this.sortDestops(DesktopsJson);
        Responce.Default = Desktops.get(Default)
        if (Responce.Default) {
            Responce.Default["key"] = Default;
            Desktops.delete(Default);
        }
        if (MimeTypes[Type]) {
            Responce.MimeType = []
            MimeTypes[Type].forEach(Mime => {
                if (Desktops.get(Mime) != undefined) {
                    let DMime = Desktops.get(Mime);
                    DMime.key = Mime;
                    Responce.MimeType.push(DMime);
                    Desktops.delete(Mime)
                }
            });
        }
        Responce.Apps = Object.fromEntries(Desktops)
        return Responce
    }

    sortDestops(desktopEntries) {
        const seen = new Set();
        const resultado = [];
        for (const par of desktopEntries) {
            const segundo = par[1];
            if (!seen.has(segundo.Name)) {
                seen.add(segundo.Name)
                resultado.push(par)
            }
        }
        return new Map(resultado.sort(([, v1], [, v2]) => String(v1.Name).localeCompare(v2.Name)));
    }

    SetDefault(Key, Path) {
        let Type = execSync(`xdg-mime query filetype "${Path}"`).toString().replace("\n", "")
        execSync(`xdg-mime default ${Key} ${Type}`)
    }
}

module.exports = OpenWith;