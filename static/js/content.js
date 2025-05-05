
const Grid = document.getElementById("Grid");
let LastetGridPos = 0;
let ActualFile;



function NewElement(File) {
    let button = document.createElement("button");
    let ID = LastetGridPos;  
    let PopUP;
    button.classList.add("file");
    button.id = `Grid_Pos_${ID}`;
    button.setAttribute("data-Path", File.Path);
    button.setAttribute("data-Name", File.Name);
    button.setAttribute("data-Link", File.Link);
    button.setAttribute("data-Type", File.Type);
    button.setAttribute("data-Id", ID);
    async function GoTo(e) {
        if (File.Type == 0) {
            if (e.ctrlKey) {
                ipcRenderer.send('Window:New', File.Path);
            } else {
                NextPath = "";
                PathNextElement.classList.remove("active");
                ViewFolder(File.Path);
            }
        } else {
            if (e.ctrlKey) {
                MakeOpenWith(File.Path, File.Name);
            } else {
                const flag = await ipcRenderer.invoke("OpenWith:OpenDefault", File.Path)
                if (!flag) {
                    MakeOpenWith(File.Path, File.Name);
                }
            }
        }
    }
    button.addEventListener('click', async (e) => {
        if (!e.shiftKey && await ipcRenderer.invoke('SelectedFiles:Size') == 0 && e.ctrlKey) {
            MakeOpenWith(File.Path, File.Name);
        }
        if (!e.shiftKey && await ipcRenderer.invoke('SelectedFiles:Size') == 1) {
            const element = await ipcRenderer.invoke('SelectedFiles:First')
            if (element.Pos == ID) {
                GoTo(e);
            }
        }
        if (e.shiftKey && !await ipcRenderer.invoke('SelectedFiles:Void')) {
            let SelectedFilesLated = await ipcRenderer.invoke('SelectedFiles:Last');
            let LastetPos = SelectedFilesLated.Pos;
            
            if (LastetPos < ID) {
                for (let i = LastetPos + 1; i < ID; i++) {
                    
                    const element = document.getElementById(`Grid_Pos_${i}`);
                    PushSelectedFile(
                        element.dataset.path,
                        element.dataset.name,
                        element.dataset.id,
                        element.dataset.link,
                        element.type,
                        element);

                    element.classList.add("Selected");
                }
            } else if (LastetPos > ID) {
                for (let i = LastetPos - 1; i > ID; i--) {
                    const element = document.getElementById(`Grid_Pos_${i}`);
                    PushSelectedFile(
                        element.dataset.path,
                        element.dataset.name,
                        element.dataset.id,
                        element.dataset.link,
                        element.type,
                        element);
                    element.classList.add("Selected");
                }
            }
        } else if (!e.ctrlKey) {
            ClearSelectedFiles();
        }

        PushSelectedFile(File.Path, File.Name, ID, File.Link, File.Type, button);
        button.classList.add("Selected");
    });

    if (File.Type == 0) {
        PopUP = FolderPopUP;
        button.classList.add("Directory");
        let XDG_Folder = XDG_Folders.filter(([_, s]) => s == File.Path)[0]
        if (XDG_Folder) {
            button.innerHTML = getFolderIconContent(XDG_Folder[0])
        } else {
            button.innerHTML = getFolderIconContent(File.Name)
        }
        button.addEventListener('dragover', (e) => {
            e.preventDefault(); // Necesario para permitir soltar
        });
        button.addEventListener("drop", async (e) => {
            e.preventDefault();
            let FilesSelected = await ipcRenderer.invoke('SelectedFiles:Get');
            FilesSelected.forEach(elem => {
                MoveFile(elem.Name, File.Path, elem.Path)
            });
            ClearSelectedFiles()
        })
    } else if (File.Type == 1) {
        PopUP = FilePopUP;
        if (String(File["Mime-type"]).startsWith("image/")) {
            button.innerHTML = `<img src="${File.Path}">`;
        } else {
            button.innerHTML = getFileIconContent(File.Name);
        }
    }
    button.addEventListener("auxclick", (e) => {
        ClosedPopUps();
        PopUP.classList.add("Active");
        PopUP.setAttribute("data-Path", File.Path);
        PopUP.setAttribute("data-Name", File.Name);
        PopUP.setAttribute("data-Link", File.Link);
        PopUP.setAttribute("data-Type", File.Type);
        PopUP.setAttribute("data-Id", ID);
        PopUP.focus();
        switch (getCuadrente(e)) {
            case 0:
                PopUP.style.left = `${e.pageX}px`;
                PopUP.style.top = `${e.pageY}px`;
                break;
            case 1:
                PopUP.style.left = `calc(${e.pageX}px - 2vw - 29vh)`;
                PopUP.style.top = `${e.pageY}px`;
                break;
            case 2:
                PopUP.style.left = `${e.pageX}px`;
                PopUP.style.top = `calc(${e.pageY}px - 11vh - 2vw)`;
                break;
            case 3:
                PopUP.style.left = `calc(${e.pageX}px - 2vw - 29vh)`;
                PopUP.style.top = `calc(${e.pageY}px - 2vw - 11vh)`;
                break;
            default:
                break;
        }


    })
    if (File.Link) {
        button.innerHTML += '<svg class="Link_Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>';
    }
    if ( ipcRenderer.sendSync('ClipBoard:IsCuted', File.Path)) {
        button.style.opacity = "0.5";
        button.style.backgroundColor = "aliceblue";
    }
    button.innerHTML += `<span>${File.Name}</span>`;
    LastetGridPos++;
    Grid.appendChild(button);
}

function ViewFolder(Path) {
    if (Path == undefined || Path == null || Path == "") {
        Path = $HOME;
    }
    Path = ClearPath(Path)
    if (Path.replace("/", "") == "" || Path.replace($HOME, "") == "" || Path.replace($TRASH, "") == "") {
        PathPreviusElement.classList.remove("active");
    } else {
        PathPreviusElement.classList.add("active");
    }

    if (Trash.parentElement != null) {
        document.body.removeChild(Trash);
    }
    document.body.appendChild(Grid);
    let Folder_Data = ListFolder(Path);
    Grid.innerHTML = ``;
    ClearSelectedFiles()
    LastetGridPos = 0;
    ActualPath = Path;
    document.getElementById("Path-Q").value = ClearPath(ActualPath) + (ActualPath[ActualPath.length - 1] == "/" ? "" : "/");
    document.getElementById("Path-Bar-Tree").innerHTML = MakeTree(ActualPath);
    Folder_Data.forEach(element => {
        NewElement(element)
    });

}

function MakeTree(Path) {
    Tree = ""
    if (Path.includes($HOME) || Path.includes("$HOME")) {
        Path = ClearPath(Path).replace($HOME, "")
        Tree += '<li><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>Home</li>'
    }

    if (Path.replace("/", "") != "") {
        Path.split("/").filter(elem => elem !== "").forEach(t => {
            Tree += '<li class="Separador">/</li>'
            Tree += `<li>${t}</li>`
        })
    }
    return Tree
}

function getCuadrente(e) {
    const rect = Grid.getBoundingClientRect()
    const X = e.clientX - rect.left
    const Y = e.clientY - rect.top
    const MidX = rect.width / 2
    const MidY = rect.height / 2
    if (X < MidX && Y < MidY) {
        return 0
    } else if (X >= MidX && Y < MidY) {
        return 1
    } else if (X < MidX && Y >= MidY) {
        return 2
    } else if (X >= MidX && Y >= MidY) {
        return 3
    }

}

function ClearSelectedFiles() {ipcRenderer.send('SelectedFiles:Clear');}

function PushSelectedFile(Path, Name, Pos, Link, Type) {
    ipcRenderer.send('SelectedFiles:Add', winID, {"Path": Path,"Name": Name,"Type": Type,"Link": Link,"Pos": Pos})
}


