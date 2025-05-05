let SelectedTrashFiles = [];
let LastetTrashPos = 0;
let Trash = document.createElement("section");
Trash.classList.add("grid");
Trash.id = "Trash";
const TrashPopUP = document.getElementById("TrashPopUP")


async function Trash_ADD(Name, Path, Type) {
    let Id = await ipcRenderer.invoke('Trash:add', { "Path": Path, "Name": Name, "Type": Type });
    return Id.id
}
async function Trash_GetAll() {
    return await ipcRenderer.invoke('Trash:getAll')
}
function NumberToText(Number) {
    let Num = []
    while (Number > 52) {
        let mod = Number % 53
        if (mod >= 27) {
            mod += 6
        }
        Num.push(String.fromCharCode(mod + 64))
        Number = Math.floor(Number / 53)
    }
    if (Number >= 27) {
        Number += 6
    }

    Num.push(String.fromCharCode(Number + 64))
    return Num.reverse().join("")

}

function NewTrashElement(File) {
    let button = document.createElement("button");
    let Pos = LastetTrashPos;
    button.classList.add("file");
    button.id = `Grid_Pos_${LastetTrashPos}`;
    button.setAttribute("data-Path", File.Path);
    button.setAttribute("data-Name", File.Name);
    button.setAttribute("data-Type", File.Type);
    button.setAttribute("data-Link", File.Link);
    button.setAttribute("data-Id", File.ID);
    button.addEventListener('click', (e) => {
        if (e.shiftKey && SelectedTrashFiles != []) {
            let SelectedTrashFilesLated = SelectedTrashFiles[SelectedTrashFiles.length - 1]
            let LastetPos = SelectedTrashFilesLated.Pos
            if (LastetPos < Pos) {
                for (let i = LastetPos + 1; i < Pos; i++) {
                    const element = document.getElementById(`Grid_Pos_${i}`);
                    SelectedTrashFiles.push({
                        "Path": element.dataset.path,
                        "Name": element.dataset.name,
                        "Link": element.dataset.link,
                        "Id": element.dataset.id,
                        "Type": element.type,
                        "btn": element,
                        "Pos": i
                    })
                    element.classList.add("Selected")
                }
            } else if (LastetPos > Pos) {
                for (let i = LastetPos - 1; i > Pos; i--) {
                    const element = document.getElementById(`Grid_Pos_${i}`);
                    SelectedTrashFiles.push({
                        "Path": element.dataset.path,
                        "Name": element.dataset.name,
                        "Link": element.dataset.link,
                        "Id": element.dataset.id,
                        "Type": element.type,
                        "btn": element,
                        "Pos": i
                    })
                    element.classList.add("Selected")
                }
            }
        } else if (!e.ctrlKey) {
            SelectedTrashFiles.forEach(element => {
                element.btn.classList.remove("Selected")
            });
            SelectedTrashFiles = []
        }
        SelectedTrashFiles.push({
            "Path": File.Path,
            "Name": File.Name,
            "Id": File.ID,
            "Type": File.Type,
            "Link": File.Link,
            "btn": button,
            "Pos": Pos
        })
        button.classList.add("Selected")

    });
    if (File.Type == 0) {
        button.classList.add("Directory");
        let XDG_Folder = XDG_Folders.filter(([_, s]) => s == File.Path)[0]
        if (XDG_Folder) {
            button.innerHTML = getFolderIconContent(XDG_Folder[0])
        } else {
            button.innerHTML = getFolderIconContent(File.Name)
        }
    } else if (File.Type == 1) {
        if (String(File["Mime-type"]).startsWith("image/")) {
            button.innerHTML = `<img src="${File.Path}">`;
        } else {
            button.innerHTML = `${getFileIconContent(File.Name)}`;
        }
    }

    button.innerHTML += `<span>${File.Name}</span>`;
    if (File.Link) {
        button.innerHTML += '<svg class="Link_Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/></svg>';
    }


    button.addEventListener("auxclick", (e) => {
        ClosedPopUps()
        TrashPopUP.classList.add("Active");
        TrashPopUP.setAttribute("data-Path", File.Path);
        TrashPopUP.setAttribute("data-Name", File.Name);
        TrashPopUP.setAttribute("data-Type", File.Link ? File.Type + 2 : File.Type);
        TrashPopUP.setAttribute("data-Id", File.ID);
        TrashPopUP.focus();
        switch (getCuadrente(e)) {
            case 0:
                TrashPopUP.style.left = `${e.pageX}px`;
                TrashPopUP.style.top = `${e.pageY}px`;
                break;
            case 1:
                TrashPopUP.style.left = `calc(${e.pageX}px - 2vw - 11vh)`;
                TrashPopUP.style.top = `${e.pageY}px`;
                break;
            case 2:
                TrashPopUP.style.left = `${e.pageX}px`;
                TrashPopUP.style.top = `calc(${e.pageY}px - 5vh - 2vw)`;
                break;
            case 3:
                TrashPopUP.style.left = `calc(${e.pageX}px - 2vw - 11vh)`;
                TrashPopUP.style.top = `calc(${e.pageY}px - 2vw - 5vh)`;
                break;
            default:
                break;
        }
    })
    
    LastetTrashPos++;
    Trash.appendChild(button);

}

async function OpenTrash() {
    ActualPath = "$TRASH"
    document.getElementById("Path-Q").value = ActualPath;
    document.getElementById("Path-Bar-Tree").innerHTML = '<li><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>Trash</li>';
    if (Grid.parentElement != null) {
        document.body.removeChild(Grid);
    }
    document.body.appendChild(Trash);
    Trash.innerHTML = "";
    LastetTrashPos = 0;
    Datos = await Trash_GetAll();
    Datos.forEach(File => {
        File.Link = File.Type > 1;
        File.Type = File.Type % 2;
        NewTrashElement(File);
    });
}

function ClearSelectedTrashFiles() {
    SelectedTrashFiles = [];
}

function PushSelectedTrashFile(id, Path, Name, Type, Btn, Pos) {
    SelectedTrashFiles.push({
        "Path": Path,
        "Name": Name,
        "Type": Type,
        "Id": id,
        "btn": Btn,
        "Pos": Pos
    })
}



Trash.addEventListener("auxclick", (e) => {
    if (SelectedTrashFiles.length == 0) {
        TrashGridPopUP.classList.add("Active");
        TrashGridPopUP.focus();
        switch (getCuadrente(e)) {
            case 0:
                TrashGridPopUP.style.left = `${e.pageX}px`;
                TrashGridPopUP.style.top = `${e.pageY}px`;
                break;
            case 1:
                TrashGridPopUP.style.left = `calc(${e.pageX}px - 2vw - 11vh)`;
                TrashGridPopUP.style.top = `${e.pageY}px`;
                break;
            case 2:
                TrashGridPopUP.style.left = `${e.pageX}px`;
                TrashGridPopUP.style.top = `calc(${e.pageY}px - 5vh - 2vw)`;
                break;
            case 3:
                TrashGridPopUP.style.left = `calc(${e.pageX}px - 2vw - 11vh)`;
                TrashGridPopUP.style.top = `calc(${e.pageY}px - 2vw - 5vh)`;
                break;
            default:
                break;
        }
    }
})