const TerminalFolderPopUp   = document.getElementById("TerminalFolderPopUp");
const RenameFolderPopUp     = document.getElementById("RenameFolderPopUp");
const DeleteFolderPopUp     = document.getElementById("DeleteFolderPopUp");
const OpenFolderPopUp       = document.getElementById("OpenFolderPopUp");
const CopyFolderPopUp       = document.getElementById("CopyFolderPopUp");
const LinkFolderPopUp       = document.getElementById("LinkFolderPopUp");
const CutFolderPopUp        = document.getElementById("CutFolderPopUp");
const ZipFolderPopUp        = document.getElementById("ZipFolderPopUp");

OpenFilePopup.addEventListener("click", (e) => {
    PathNextElement.classList.remove("active");
    FolderPopUP.classList.remove("Active");
    const Path = FolderPopUP.dataset.Path;
    NextPath = "";
    ViewFolder(Path);
});
TerminalFolderPopUp.addEventListener("click", (e) => {
    FolderPopUP.classList.remove("Active");
    const Path = FolderPopUP.dataset.path;
    OpenTerminalInFolder(Path);
});
DeleteFolderPopUp.addEventListener("click", (e) => {
    FolderPopUP.classList.remove("Active");
    const Path = FolderPopUP.dataset.path;
    const Name = FolderPopUP.dataset.name;
    const Type = FolderPopUP.dataset.type;
    MoveToTrash(Name, Path, Type);
});
CopyFolderPopUp.addEventListener("click", (e) => {
    FolderPopUP.classList.remove("Active");
    const Path = FolderPopUP.dataset.path;
    const Name = FolderPopUP.dataset.name;
    const Type = FolderPopUP.dataset.type;
    CopyFile(Name, Path, Type);
});
CutFolderPopUp.addEventListener("click", (e) => {
    FolderPopUP.classList.remove("Active");
    const Path = FolderPopUP.dataset.path;
    const Name = FolderPopUP.dataset.name;
    const Type = FolderPopUP.dataset.type;
    CutFile(Name, Path, Type);
});
RenameFolderPopUp.addEventListener("click", (e) => {
    FolderPopUP.classList.remove("Active");
    const Path = FolderPopUP.dataset.path;
    const Name = FolderPopUP.dataset.name;
    OpenPopUpRename(Name, Path);
});
ZipFolderPopUp.addEventListener("click", async () => {
    FolderPopUP.classList.remove("Active");
    const Path = FolderPopUP.dataset.path;
    await MakeZip(null, [Path]);
    ViewFolder(ActualPath);
});
LinkFolderPopUp.addEventListener("click", async () => {
    FolderPopUP.classList.remove("Active");
    const Path = FolderPopUP.dataset.path;
    MakeLink(Path, null, "dir");
    ViewFolder(ActualPath);
});
