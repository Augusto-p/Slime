const Side_Bar = document.getElementById("Side-Bar")
let XDG_Folders = []

function New_Side_Element(Name, Icon, Path) {
    let button = document.createElement("button")
    button.classList.add("row")
    button.innerHTML = `${getIconSideBar(Icon)}<span>${Name}</span>`
    button.addEventListener("click", () => {
        ViewFolder(Path)
    })
    button.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necesario para permitir soltar
    });
    button.addEventListener("drop", async (e) => {
        e.preventDefault();
        let FilesSelected = await ipcRenderer.invoke('SelectedFiles:Get');
        FilesSelected.forEach(elem => {
            MoveFile(elem.Name, Path, elem.Path)
        });
        ClearSelectedFiles()
    })
    Side_Bar.append(button)
}

function New_Side_Trash() {
    let button = document.createElement("button")
    button.classList.add("row")
    button.innerHTML = `${getIconSideBar("TRASH")}<span>Trash</span>`;
    button.addEventListener("click", () => {
        PathNextElement.classList.remove("active");
        PathPreviusElement.classList.remove("active");
        OpenTrash();
    })
    button.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necesario para permitir soltar
    });
    button.addEventListener("drop", async (e) => {
        e.preventDefault();
        let FilesSelected = await ipcRenderer.invoke('SelectedFiles:Get');
        FilesSelected.forEach(elem => {
            MoveToTrash()
        });
        ClearSelectedFiles()
    })
    Side_Bar.append(button)
}

function New_Side_Separador() {
    let sep = document.createElement("div")
    sep.classList.add("row")
    sep.classList.add("Separador")
    Side_Bar.append(sep)
}


function Load_XDG_Bar() {
    HomeSplit = $HOME.split("/")
    New_Side_Element(HomeSplit[HomeSplit.length - 1], "HOME", $HOME,)
    runBashCommand(`cat $HOME/.config/user-dirs.dirs`).then(datos => {
        datos.split("\n").forEach(line => {
            if (line.startsWith("XDG_")) {
                lineSplit = line.split("=")
                iconName = lineSplit[0].replace("XDG_", "").replace("_DIR", "")
                let Path = lineSplit[1].replaceAll('"', "")
                PathSplit = Path.split("/")
                Name = PathSplit[PathSplit.length - 1]
                XDG_Folders.push([iconName, ClearPath(Path)]);
                New_Side_Element(Name, iconName, ClearPath(Path))

            }
        });
        New_Side_Trash()
        New_Side_Separador()
        Load_Bookmarks()
        ViewFolder(ActualPath);
    });
}
function Load_Bookmarks() {
    Bookmarks.forEach(mark => {
        if (Object.keys(mark).includes("Separator") && mark.Separator) {
            New_Side_Separador()
        } else {
            New_Side_Element(mark.Name, mark.Icon, mark.Path)
        }


    })

}
function getIconSideBar(icon) {
    let IconData = icons[icon]
    if (IconData == undefined) {
        return icons["null"]
    }
    return IconData
}
