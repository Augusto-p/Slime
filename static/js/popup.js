const NewFolderPopUP = document.getElementById("NewFolder");
const SelectionPopUP = document.getElementById("SelectionPopUP");
const NewFolder_Q = document.getElementById("NewFolder-Q");
const ViewFolderPopUP = document.getElementById("ViewFolderPopUP");
const FolderPopUP = document.getElementById("FolderPopUP");
const FilePopUP = document.getElementById("FilePopUP");
const Rename_Q = document.getElementById("Rename-Q");

Grid.addEventListener("auxclick", (e) => {
    if (SelectedFiles.length == 1) {
        SelectedFiles[0].btn.classList.remove("Selected");
        SelectedFiles = [];
    }
    if (e.target.id == "Grid" && SelectedFiles.length == 0) {
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

    } else if (SelectedFiles.length > 1) {
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

document.getElementById("ViewFolderPopUP_NewFolder").addEventListener("click", () => {
    ViewFolderPopUP.classList.remove("Active");
    OpenPopUpNewFolder();
})
document.getElementById("ViewFolderPopUP_Terminal").addEventListener("click", (e) => {
    ViewFolderPopUP.classList.remove("Active");
    OpenTerminalInFolder(ActualPath);
})
document.getElementById("ViewFolderPopUP_SelectAll").addEventListener("click", (e) => {
    ClearSelectedFiles();
    ViewFolderPopUP.classList.remove("Active");
    Grid.childNodes.forEach(child => {
        PushSelectedFile(child.dataset.path, child.dataset.name, child.classList.contains("Directory") ? 1 : 0, child, parseInt(child.id.replace("Grid_Pos_", "")));
        child.classList.add("Selected");
    });
})
document.getElementById("ViewFolderPopUP_Paste").addEventListener("click", (e) => {
    ViewFolderPopUP.classList.remove("Active");
    PasteFile();
})

// Folders
document.getElementById("OpenFolderPopUp").addEventListener("click", (e) => {
    FolderPopUP.classList.remove("Active");
    const Path = FolderPopUP.dataset.Path;
    NextPath = "";
    PathNextElement.classList.remove("active");
    ViewFolder(Path);
})
document.getElementById("TerminalFolderPopUp").addEventListener("click", (e) => {
    FolderPopUP.classList.remove("Active");
    const Path = FolderPopUP.dataset.path;
    OpenTerminalInFolder(Path);
})
document.getElementById("DeleteFolderPopUp").addEventListener("click", (e) => {
    FolderPopUP.classList.remove("Active");
    const Path = FolderPopUP.dataset.path;
    const Name = FolderPopUP.dataset.name;
    const Type = FolderPopUP.dataset.type;
    MoveToTrash(Name, Path, Type);
})
document.getElementById("CopyFolderPopUp").addEventListener("click", (e) => {
    FolderPopUP.classList.remove("Active");
    const Path = FolderPopUP.dataset.path;
    const Name = FolderPopUP.dataset.name;
    CopyFile(Name, Path, 1);
})
document.getElementById("CutFolderPopUp").addEventListener("click", (e) => {
    FolderPopUP.classList.remove("Active");
    const Path = FolderPopUP.dataset.path;
    const Name = FolderPopUP.dataset.name;
    CutFile(Name, Path, 1);
})
document.getElementById("RenameFolderPopUp").addEventListener("click", (e) => {
    FolderPopUP.classList.remove("Active");
    OpenPopUpRename(FolderPopUP.dataset.name, FolderPopUP.dataset.path);
})
document.getElementById("ZipFolderPopUp").addEventListener("click", async () => {
    FolderPopUP.classList.remove("Active");
    await MakeZip(null, [ActualFile.dataset.path]);
    ViewFolder(ActualPath);
})
document.getElementById("LinkFolderPopUp").addEventListener("click", async () => {
    FolderPopUP.classList.remove("Active");
    MakeLink(FolderPopUP.dataset.path, null, "dir");
    ViewFolder(ActualPath);
})

//File
document.getElementById("OpenFilePopUp").addEventListener("click", (e) => {
    FilePopUP.classList.remove("Active");
    const Path = FilePopUP.dataset.path;
    OpenFile(Path);
})
document.getElementById("DeleteFilePopUp").addEventListener("click", (e) => {
    FilePopUP.classList.remove("Active");
    const Path = FilePopUP.dataset.path;
    const Name = FilePopUP.dataset.name;
    const Type = FilePopUP.dataset.type;
    MoveToTrash(Name, Path, Type);
})
document.getElementById("CopyFilePopUp").addEventListener("click", (e) => {
    FilePopUP.classList.remove("Active");
    const Path = FilePopUP.dataset.path;
    const Name = FilePopUP.dataset.name;
    CopyFile(Name, Path, 0);
})
document.getElementById("CutFilePopUp").addEventListener("click", (e) => {
    FilePopUP.classList.remove("Active");
    const Path = FilePopUP.dataset.path;
    const Name = FilePopUP.dataset.name;
    CutFile(Name, Path, 0);
})
document.getElementById("RenameFilePopUp").addEventListener("click", (e) => {
    FilePopUP.classList.remove("Active");
    OpenPopUpRename(FilePopUP.dataset.name, FilePopUP.dataset.path);
})
document.getElementById("ZipFilePopUp").addEventListener("click", async () => {
    FilePopUP.classList.remove("Active");
    if (!FilePopUP.dataset.name.endsWith(".zip")) {await MakeZip(null, [FilePopUP.dataset.path]);} 
    else {await ExtractZip(FilePopUP.dataset.path);}
    ViewFolder(ActualPath);
})
document.getElementById("LinkFilePopUp").addEventListener("click", (e) => {
    FilePopUP.classList.remove("Active");
    MakeLink(FilePopUP.dataset.path, null, "file");
    ViewFolder(ActualPath);
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
    if (e.target.id == "Rename") {ClosePopUpRename();}
})
document.getElementById("Rename-Closed").addEventListener("click", () => {ClosePopUpRename();})
document.getElementById("Rename-Save").addEventListener("click", () => {
    let Old_Path = Rename_Q.dataset.path;
    let New_Name = Rename_Q.value;
    RenameFile(Old_Path, New_Name);
    ClosePopUpRename();
})

Rename_Q.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {document.getElementById("Rename-Save").click();}
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
    if (e.target.id == "NewFolder") {ClosePopUpNewFolder();}
})

document.getElementById("NewFolder-Closed").addEventListener("click", () => {ClosePopUpNewFolder();})
document.getElementById("NewFolder-Save").addEventListener("click", () => {
    if (NewFolder_Q.value != "") {
        MakeFolder(NewFolder_Q.value);
        ViewFolder(ActualPath);
        ClosePopUpNewFolder();
    }
})
NewFolder_Q.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {document.getElementById("NewFolder-Save").click();}
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
    SelectedFiles.forEach(File => {Files.push(File.Path);});
    await MakeZip(null, Files);
    ViewFolder(ActualPath);
})

// TrashGridPopUP
document.getElementById("TrashGridSelectAllPopUp").addEventListener("click", (e) => {
    ClearSelectedTrashFiles();
    TrashGridPopUP.classList.remove("Active");
    Trash.childNodes.forEach(child => {
        PushSelectedTrashFile(child.dataset.id,child.dataset.path, child.dataset.name, child.classList.contains("Directory") ? 1 : 0, child, parseInt(child.id.replace("Grid_Pos_", "")));
        child.classList.add("Selected");
    });
})

document.getElementById("TrashGridDeletePopUp").addEventListener("click", (e) => {
    TrashGridPopUP.classList.remove("Active");
    Trash.childNodes.forEach(child => {
        DeleteFile(child.dataset.path,child.dataset.id);
    });
    OpenTrash();
})

document.getElementById("TrashGridRestorePopUp").addEventListener("click", (e) => {
    TrashGridPopUP.classList.remove("Active");
    Trash.childNodes.forEach(child => {
        RestureFile(child.dataset.path,child.dataset.id);
    });
    OpenTrash();
})
// TrashPopUP
document.getElementById("TrashDeletePopUp").addEventListener("click", (e) => {
    TrashPopUP.classList.remove("Active");
    SelectedTrashFiles.forEach(e => {
        DeleteFile(e.Path, e.Id);
    });
    SelectedTrashFiles = [];
    OpenTrash();
})

document.getElementById("TrashRestorePopUp").addEventListener("click", (e) => {
    TrashPopUP.classList.remove("Active");
    SelectedTrashFiles.forEach(e => {
        RestureFile(e.Path, e.Id);
    });
    SelectedTrashFiles = [];
    OpenTrash();
})


// Window
window.addEventListener("click", (e) => {
    if (!e.target.classList.contains("file") && e.target.parentElement.tagName == "BODY") {
        SelectedFiles.forEach(element => {
            element.btn.classList.remove("Selected");
        });
        SelectedTrashFiles.forEach(element => {
            element.btn.classList.remove("Selected");
        });
        
        SelectedFiles = [];
        SelectedTrashFiles = [];
    }
    if (e.target.id != "FolderPopUP") {FolderPopUP.classList.remove("Active");}
    if (e.target.id != "FilePopUP") {FilePopUP.classList.remove("Active");}
    if (e.target.id != "ViewFolderPopUP") {ViewFolderPopUP.classList.remove("Active");}
    if (e.target.id != "SelectionPopUP") {SelectionPopUP.classList.remove("Active");}
    if (e.target.id != "TrashPopUP") {TrashPopUP.classList.remove("Active");}
    if (e.target.id != "TrashGridPopUP") {TrashGridPopUP.classList.remove("Active");}
});

