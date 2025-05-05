const ViewFolderPopUP = document.getElementById("ViewFolderPopUP");
const SelectionPopUP = document.getElementById("SelectionPopUP");
const FolderPopUP = document.getElementById("FolderPopUP");
const NewFolder_Q = document.getElementById("NewFolder-Q");
const NewFolderPopUP = document.getElementById("NewFolder");
const FilePopUP = document.getElementById("FilePopUP");
const Rename_Q = document.getElementById("Rename-Q");

Grid.addEventListener("auxclick", async (e) => {
    if (await ipcRenderer.invoke('SelectedFiles:Size') == 1) {
        ClearSelectedFiles()
    }
    if (e.target.id == "Grid" && await ipcRenderer.invoke('SelectedFiles:Void')) {
        ClosedPopUps();
        ViewFolderPopUP.classList.add("Active");
        ViewFolderPopUP.focus();
        switch (getCuadrente(e)) {
            case 0:
                ViewFolderPopUP.style.left = `${e.pageX}px`;
                ViewFolderPopUP.style.top = `${e.pageY}px`;
                break;
            case 1:
                ViewFolderPopUP.style.left = `calc(${e.pageX}px - 2vw - 23vh)`;
                ViewFolderPopUP.style.top = `${e.pageY}px`;
                break;
            case 2:
                ViewFolderPopUP.style.left = `${e.pageX}px`;
                ViewFolderPopUP.style.top = `calc(${e.pageY}px - 5vh - 2vw)`;
                break;
            case 3:
                ViewFolderPopUP.style.left = `calc(${e.pageX}px - 2vw - 23vh)`;
                ViewFolderPopUP.style.top = `calc(${e.pageY}px - 2vw - 5vh)`;
                break;
            default:
                break;
        }

    } else if (await ipcRenderer.invoke('SelectedFiles:Size') > 1) {
        ClosedPopUps();
        SelectionPopUP.classList.add("Active");
        SelectionPopUP.focus();
        switch (getCuadrente(e)) {
            case 0:
                SelectionPopUP.style.left = `${e.pageX}px`;
                SelectionPopUP.style.top = `${e.pageY}px`;
                break;
            case 1:
                SelectionPopUP.style.left = `calc(${e.pageX}px - 2vw - 29vh)`;
                SelectionPopUP.style.top = `${e.pageY}px`;
                break;
            case 2:
                SelectionPopUP.style.left = `${e.pageX}px`;
                SelectionPopUP.style.top = `calc(${e.pageY}px - 5vh - 2vw)`;
                break;
            case 3:
                SelectionPopUP.style.left = `calc(${e.pageX}px - 2vw - 29vh)`;
                SelectionPopUP.style.top = `calc(${e.pageY}px - 2vw - 5vh)`;
                break;
            default:
                break;
        }

    }
})

const Grid_SelectAll = document.getElementById("ViewFolderPopUP_SelectAll");
const Grid_Terminal = document.getElementById("ViewFolderPopUP_Terminal");

document.getElementById("ViewFolderPopUP_NewFolder").addEventListener("click", () => {
    ViewFolderPopUP.classList.remove("Active");
    OpenPopUpNewFolder();
})
Grid_Terminal.addEventListener("click", (e) => {
    ViewFolderPopUP.classList.remove("Active");
    OpenTerminalInFolder(ActualPath);
})
Grid_SelectAll.addEventListener("click", (e) => {
    ClearSelectedFiles();
    ViewFolderPopUP.classList.remove("Active");
    Grid.childNodes.forEach(child => {
        PushSelectedFile(
            child.dataset.path,
            child.dataset.name,
            parseInt(child.id.replace("Grid_Pos_", "")),
            child.dataset.link,
            child.dataset.type,
            child
        );
        child.classList.add("Selected");
    });
})
document.getElementById("ViewFolderPopUP_Paste").addEventListener("click", (e) => {
    ViewFolderPopUP.classList.remove("Active");
    PasteFile();
})



function ClosedPopUps() {
    FilePopUP.classList.remove("Active");
    FolderPopUP.classList.remove("Active");
    ViewFolderPopUP.classList.remove("Active");
    SelectionPopUP.classList.remove("Active");
}

// Rename
function OpenPopUpRename(Name, Path) {
    Rename.classList.add("Active");
    Rename_Q.value = Name;
    Rename_Q.setAttribute("data-Path", Path);
    Rename_Q.focus();
    Rename_Q.select();
    ShortCut_Active = false;
}

function ClosePopUpRename() {
    Rename_Q.value = null;
    Rename.classList.remove("Active");
    ShortCut_Active = true;
}

Rename.addEventListener("click", (e) => {
    if (e.target.id == "Rename") { ClosePopUpRename(); }
})
document.getElementById("Rename-Closed").addEventListener("click", () => { ClosePopUpRename(); })
document.getElementById("Rename-Save").addEventListener("click", () => {
    let Old_Path = Rename_Q.dataset.path;
    let New_Name = Rename_Q.value;
    RenameFile(Old_Path, New_Name);
    ClosePopUpRename();
})

Rename_Q.addEventListener("keyup", (e) => {
    if (e.key == "Enter") { document.getElementById("Rename-Save").click(); }
})

// New Folder
function OpenPopUpNewFolder() {
    NewFolderPopUP.classList.add("Active");
    NewFolder_Q.focus();
    ShortCut_Active = false;
}

function ClosePopUpNewFolder() {
    NewFolder_Q.value = null;
    NewFolderPopUP.classList.remove("Active");
    ShortCut_Active = true;
}

NewFolderPopUP.addEventListener("click", (e) => {
    if (e.target.id == "NewFolder") { ClosePopUpNewFolder(); }
})

document.getElementById("NewFolder-Closed").addEventListener("click", () => { ClosePopUpNewFolder(); })
document.getElementById("NewFolder-Save").addEventListener("click", () => {
    if (NewFolder_Q.value != "") {
        MakeFolder(NewFolder_Q.value);
        ViewFolder(ActualPath);
        ClosePopUpNewFolder();
    }
})
NewFolder_Q.addEventListener("keyup", (e) => {
    if (e.key == "Enter") { document.getElementById("NewFolder-Save").click(); }
})

// Selection
document.getElementById("CutSelectionPopUp").addEventListener("click", () => {
    SelectionPopUP.classList.remove("Active");
    CutFile();
})
document.getElementById("CopySelectionPopUp").addEventListener("click", () => {
    SelectionPopUP.classList.remove("Active");
    CopyFile();
})
document.getElementById("DeleteSelectionPopUp").addEventListener("click", () => {
    SelectionPopUP.classList.remove("Active");
    MoveToTrash();
})
document.getElementById("ZipSelectionPopUp").addEventListener("click", async () => {
    SelectionPopUP.classList.remove("Active");
    let Files = [];
    let FilesSelected = await ipcRenderer.invoke('SelectedFiles:Get');
    FilesSelected.forEach(File => { Files.push(File.Path); });
    await MakeZip(null, Files);
    ViewFolder(ActualPath);
})


// Window
window.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("file") && e.target.parentElement.tagName == "BODY") {
        ClearSelectedFiles()
        SelectedTrashFiles = [];
    }
    if (e.target.id != "FolderPopUP") { FolderPopUP.classList.remove("Active"); }
    if (e.target.id != "FilePopUP") { FilePopUP.classList.remove("Active"); }
    if (e.target.id != "ViewFolderPopUP") { ViewFolderPopUP.classList.remove("Active"); }
    if (e.target.id != "SelectionPopUP") { SelectionPopUP.classList.remove("Active"); }
    if (e.target.id != "TrashPopUP") { TrashPopUP.classList.remove("Active"); }
    if (e.target.id != "TrashGridPopUP") { TrashGridPopUP.classList.remove("Active"); }
});

