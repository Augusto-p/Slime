const Trash_Grid_SelectAll  = document.getElementById("TrashGridSelectAllPopUp");
const Trash_Grid_Restore    = document.getElementById("TrashGridRestorePopUp");
const Trash_Grid_Delete     = document.getElementById("TrashGridDeletePopUp");
const Trash_Restore         = document.getElementById("TrashRestorePopUp");
const Trash_Delete          = document.getElementById("TrashDeletePopUp");


Trash_Grid_Delete.addEventListener("click", (e) => {
    TrashGridPopUP.classList.remove("Active");
    Trash.childNodes.forEach(child => {DeleteFile(child.dataset.path,child.dataset.id);});
    OpenTrash();
});

Trash_Delete.addEventListener("click", (e) => {
    TrashPopUP.classList.remove("Active");
    SelectedTrashFiles.forEach(e => {DeleteFile(e.Path, e.Id);});
    SelectedTrashFiles = [];
    OpenTrash();
});

Trash_Restore.addEventListener("click", (e) => {
    TrashPopUP.classList.remove("Active");
    SelectedTrashFiles.forEach(e => {RestureFile(e.Path, e.Id);});
    SelectedTrashFiles = [];
    OpenTrash();
});

Trash_Grid_Restore.addEventListener("click", (e) => {
    TrashGridPopUP.classList.remove("Active");
    Trash.childNodes.forEach(child => {RestureFile(child.dataset.path,child.dataset.id);});
    OpenTrash();
});

Trash_Grid_SelectAll.addEventListener("click", (e) => {
    ClearSelectedTrashFiles();
    TrashGridPopUP.classList.remove("Active");
    Trash.childNodes.forEach(child => {
        PushSelectedTrashFile(child.dataset.id,child.dataset.path, child.dataset.name, child.dataset.type, child, parseInt(child.id.replace("Grid_Pos_", "")));
        child.classList.add("Selected");
    });
});
