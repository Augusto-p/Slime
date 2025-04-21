const Grid = document.getElementById("Grid");
let CopyAndCutFile = [];
let SelectedFiles = [];
let LastetGridPos = 0;
let ActualPath = "";
let ActualFile;

function NewElement(File) {
    let button = document.createElement("button");
    let Pos = LastetGridPos;

    button.classList.add("file");
    button.id = `Grid_Pos_${LastetGridPos}`;
    button.setAttribute("data-Path", File.Path);
    button.setAttribute("data-Name", File.Name);

    if (File.Type.includes("Directory")) {
        let icon;
        let XDG_Folder = XDG_Folders.filter(([_, s]) => s == File.Path)[0]
        if (XDG_Folder) {
            icon = getFolderIconContent(XDG_Folder[0])
        } else {
            icon = getFolderIconContent(File.Name)
        }
        button.innerHTML = `${icon}<span>${File.Name}</span>`;
        button.classList.add("Directory");
        button.setAttribute("data-Type", File.Link ? 2 : 0);
        function GoTo() {
            NextPath = "";
            PathNextElement.classList.remove("active");
            ViewFolder(File.Path);
        }
        button.addEventListener('click', (e) => {
            if (ActualFile == button) {
                if (e.ctrlKey) {
                    console.log("New Window");
                }
                GoTo()
            } else {
                ActualFile = button
                if (e.shiftKey && SelectedFiles != []) {
                    let SelectedFilesLated = SelectedFiles[SelectedFiles.length - 1]
                    let LastetPos = SelectedFilesLated.Pos
                    if (LastetPos < Pos) {
                        for (let i = LastetPos + 1; i < Pos; i++) {
                            const element = document.getElementById(`Grid_Pos_${i}`);
                            SelectedFiles.push({
                                "Path": element.dataset.path,
                                "Name": element.dataset.name,
                                "Type": element.classList.contains("Directory") ? 1 : 0,
                                "btn": element,
                                "Pos": i
                            })
                            element.classList.add("Selected")
                        }
                    } else if (LastetPos > Pos) {
                        for (let i = LastetPos - 1; i > Pos; i--) {
                            const element = document.getElementById(`Grid_Pos_${i}`);
                            SelectedFiles.push({
                                "Path": element.dataset.path,
                                "Name": element.dataset.name,
                                "Type": element.classList.contains("Directory") ? 1 : 0,
                                "btn": element,
                                "Pos": i
                            })
                            element.classList.add("Selected")
                        }
                    }



                } else if (!e.ctrlKey) {
                    SelectedFiles.forEach(element => {
                        element.btn.classList.remove("Selected")
                    });
                    SelectedFiles = []
                }


                SelectedFiles.push({
                    "Path": File.Path,
                    "Name": File.Name,
                    "Type": 1,
                    "btn": button,
                    "Pos": Pos
                })
                button.classList.add("Selected")


            }
        });



        button.addEventListener("auxclick", (e) => {
            ClosedPopUps()
            FolderPopUP.classList.add("Active");
            FolderPopUP.setAttribute("data-Path", File.Path);
            FolderPopUP.setAttribute("data-Name", File.Name);
            FolderPopUP.setAttribute("data-Type", File.Link ? 2 : 0);
            FolderPopUP.focus();
            switch (getCuadrente(e)) {
                case 0:
                    FolderPopUP.style.left = `${e.pageX}px`;
                    FolderPopUP.style.top = `${e.pageY}px`;
                    break;
                case 1:
                    FolderPopUP.style.left = `calc(${e.pageX}px - 2vw - 29vh)`;
                    FolderPopUP.style.top = `${e.pageY}px`;
                    break;
                case 2:
                    FolderPopUP.style.left = `${e.pageX}px`;
                    FolderPopUP.style.top = `calc(${e.pageY}px - 11vh - 2vw)`;
                    break;
                case 3:
                    FolderPopUP.style.left = `calc(${e.pageX}px - 2vw - 29vh)`;
                    FolderPopUP.style.top = `calc(${e.pageY}px - 2vw - 11vh)`;
                    break;
                default:
                    break;
            }


        })
    } else if (File.Type.includes("File")) {
        if (String(File["Mime-type"]).startsWith("image/")) {
            button.innerHTML = `<img src="${File.Path}"><span>${File.Name}</span>`;
        } else {
            button.innerHTML = `${getFileIconContent(File.Name)}<span>${File.Name}</span>`;
        }
        button.setAttribute("data-Type", File.Link ? 3 : 1);
        button.addEventListener("auxclick", (e) => {
            ClosedPopUps()
            FilePopUP.classList.add("Active")
            FilePopUP.setAttribute("data-path", File.Path);
            FilePopUP.setAttribute("data-Name", File.Name);
            FilePopUP.setAttribute("data-Type", File.Link ? 3 : 1);

            FilePopUP.focus()
            switch (getCuadrente(e)) {
                case 0:
                    FilePopUP.style.left = `${e.pageX}px`
                    FilePopUP.style.top = `${e.pageY}px`
                    break;
                case 1:
                    FilePopUP.style.left = `calc(${e.pageX}px - 2vw - 29vh)`;
                    FilePopUP.style.top = `${e.pageY}px`;
                    break;
                case 2:
                    FilePopUP.style.left = `${e.pageX}px`;
                    FilePopUP.style.top = `calc(${e.pageY}px - 11vh - 2vw)`;
                    break;
                case 3:
                    FilePopUP.style.left = `calc(${e.pageX}px - 2vw - 29vh)`;
                    FilePopUP.style.top = `calc(${e.pageY}px - 2vw - 11vh)`;
                    break;
                default:
                    break;
            }

        })

        button.addEventListener("click", (e) => {
            if (ActualFile == button) {
                OpenFile(File.Path)

            }
            ActualFile = button
            if (e.shiftKey && SelectedFiles != []) {
                let SelectedFilesLated = SelectedFiles[SelectedFiles.length - 1]
                let LastetPos = SelectedFilesLated.Pos
                if (LastetPos < Pos) {
                    for (let i = LastetPos + 1; i < Pos; i++) {
                        const element = document.getElementById(`Grid_Pos_${i}`);
                        SelectedFiles.push({
                            "Path": element.dataset.path,
                            "Name": element.dataset.name,
                            "Type": element.classList.contains("Directory") ? 1 : 0,
                            "btn": element,
                            "Pos": i
                        })
                        element.classList.add("Selected")
                    }
                } else if (LastetPos > Pos) {
                    for (let i = LastetPos - 1; i > Pos; i--) {
                        const element = document.getElementById(`Grid_Pos_${i}`);
                        SelectedFiles.push({
                            "Path": element.dataset.path,
                            "Name": element.dataset.name,
                            "Type": element.classList.contains("Directory") ? 1 : 0,
                            "btn": element,
                            "Pos": i
                        })
                        element.classList.add("Selected")
                    }
                }



            } else if (!e.ctrlKey) {
                SelectedFiles.forEach(element => {
                    element.btn.classList.remove("Selected")
                });
                SelectedFiles = []
            }


            SelectedFiles.push({
                "Path": File.Path,
                "Name": File.Name,
                "Type": 0,
                "btn": button,
                "Pos": Pos
            })
            button.classList.add("Selected")

        })
        button.addEventListener("dblclick", () => {
            OpenFile(File.Path)
            ActualFile = button
        })
    }
    if (File.Link) {
        button.innerHTML += '<svg class="Link_Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>';
    }
    CopyAndCutFile.forEach(CACF => {
        if (CACF.Mode == 1) {
            if (File.Path.replace(CACF.Path, "") == "") {
                button.style.opacity = "0.5"
                button.style.backgroundColor = "aliceblue"
            }
        }
    });

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
    if (Path == $TRASH) {
        OpenTrash()   
        return
    }

    if (Trash.parentElement != null) {
        document.body.removeChild(Trash);
    }
    document.body.appendChild(Grid);
    let Folder_Data = ListFolder(Path);
    Grid.innerHTML = ``;
    SelectedFiles = [];
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
    if (Path.includes($TRASH)) {
        return '<li><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>Trash</li>'
    }

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

function RenameShortCut() {
    if (ActualFile !== undefined) {

        let Path = ActualFile.getAttribute("Data-Path")
        let Name = ActualFile.getAttribute("Data-Name")
        OpenPopUpRename(Name, Path)
    }
}

function CopyFile(Name, Path, Type) {
    if (SelectedFiles.length != 0) {
        CopyAndCutFile = []
        SelectedFiles.forEach(File => {
            Path = File.btn.getAttribute("Data-Path")
            Name = File.btn.getAttribute("Data-Name")
            Type = File.btn.classList.contains("Directory") ? 1 : 0

            CopyAndCutFile.push({
                "Mode": 0,
                "Path": Path,
                "Name": Name,
                "Type": Type
            })
        });
    } else {
        if (Path == undefined) {
            Path = ActualFile.getAttribute("Data-Path")
            Name = ActualFile.getAttribute("Data-Name")
            Type = ActualFile.classList.contains("Directory") ? 1 : 0

        }
        CopyAndCutFile = [{
            "Mode": 0,
            "Path": Path,
            "Name": Name,
            "Type": Type
        }]
    }
}

function CutFile(Name, Path, Type) {
    if (SelectedFiles.length != 0) {
        CopyAndCutFile = []
        SelectedFiles.forEach(File => {
            Path = File.btn.getAttribute("Data-Path")
            Name = File.btn.getAttribute("Data-Name")
            Type = File.btn.classList.contains("Directory") ? 1 : 0

            CopyAndCutFile.push({
                "Mode": 1,
                "Path": Path,
                "Name": Name,
                "Type": Type
            })
        });
    } else {
        if (Path == undefined) {
            Path = ActualFile.getAttribute("Data-Path")
            Name = ActualFile.getAttribute("Data-Name")
            Type = ActualFile.classList.contains("Directory") ? 1 : 0
        }
        CopyAndCutFile = [{
            "Mode": 1,
            "Path": Path,
            "Name": Name,
            "Type": Type
        }]
    }
    ViewFolder(ActualPath)
}

function ClearSelectedFiles() {
    SelectedFiles = [];
}

function PushSelectedFile(Path, Name, Type, Btn, Pos) {
    SelectedFiles.push({
        "Path": Path,
        "Name": Name,
        "Type": Type,
        "btn": Btn,
        "Pos": Pos
    })
}


function ToggleHiddenFiles() {
    UpdateConfig("HiddenFiles", !Config["HiddenFiles"]);
    ViewFolder(ActualPath);
}