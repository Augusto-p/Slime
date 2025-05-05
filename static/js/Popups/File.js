const OpenWithFilePopUp = document.getElementById("OpenWithFilePopUp");
const RenameFilePopUp   = document.getElementById("RenameFilePopUp");
const DeleteFilePopUp   = document.getElementById("DeleteFilePopUp");
const CopyFilePopUp     = document.getElementById("CopyFilePopUp");
const LinkFilePopUp     = document.getElementById("LinkFilePopUp");
const OpenFilePopup     = document.getElementById("OpenFilePopUp");
const CutFilePopUp      = document.getElementById("CutFilePopUp");
const ZipFilePopUp      = document.getElementById("ZipFilePopUp");



OpenFilePopup.addEventListener("click", (e) => {
    FilePopUP.classList.remove("Active");
    const Path = FilePopUP.dataset.path;
    OpenFile(Path);
});

DeleteFilePopUp.addEventListener("click", (e) => {
    FilePopUP.classList.remove("Active");
    const Path = FilePopUP.dataset.path;
    const Name = FilePopUP.dataset.name;
    const Type = FilePopUP.dataset.type;
    MoveToTrash(Name, Path, Type);
});

CopyFilePopUp.addEventListener("click", (e) => {
    FilePopUP.classList.remove("Active");
    const Path = FilePopUP.dataset.path;
    const Name = FilePopUP.dataset.name;
    const Type = FilePopUP.dataset.type;
    CopyFile(Name, Path, Type);
});

CutFilePopUp.addEventListener("click", (e) => {
    FilePopUP.classList.remove("Active");
    const Path = FilePopUP.dataset.path;
    const Name = FilePopUP.dataset.name;
    const Type = FilePopUP.dataset.type;
    CutFile(Name, Path, Type);
});

OpenWithFilePopUp.addEventListener("click", (e) => {
    FilePopUP.classList.remove("Active");
    const Path = FilePopUP.dataset.path;
    const Name = FilePopUP.dataset.name;
    MakeOpenWith(Path, Name);
});

RenameFilePopUp.addEventListener("click", (e) => {
    FilePopUP.classList.remove("Active");
    const Name = FilePopUP.dataset.name;
    const Path =  FilePopUP.dataset.path;
    OpenPopUpRename(Name,Path);
});

ZipFilePopUp.addEventListener("click", async () => {
    FilePopUP.classList.remove("Active");
    const Path = FilePopUP.dataset.path;
    if (!FilePopUP.dataset.name.endsWith(".zip")) {
        await MakeZip(null, [Path]);
    } 
    else {
        await ExtractZip(Path);
    }
    ViewFolder(ActualPath);
});

LinkFilePopUp.addEventListener("click", (e) => {
    FilePopUP.classList.remove("Active");
    const Path = FilePopUP.dataset.path;
    MakeLink(Path, null, "file");
    ViewFolder(ActualPath);
});
