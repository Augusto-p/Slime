let ShortCut_Active = true

function SuperShortCut() {
    if (ActualPath == "$TRASH") {
        if (SelectedTrashFiles.length == 0) {
            Trash_Grid_Delete.click()
        }else{
            Trash_Delete.click()
        }
    }else{
        if (SelectedTrashFiles.length == 0) {
            Grid.childNodes.forEach(child => {
                const Name = child.dataset.name;
                const Path = child.dataset.path;
                const Type = child.dataset.type;
                MoveToTrash(Name, Path, Type);
            });
        }else{
            MoveToTrash();
        }
    }
}

async function RenameShortCut() {
    if (await ipcRenderer.invoke('SelectedFiles:Size') == 1) {
        const First = await ipcRenderer.invoke('SelectedFiles:First');
        const Path = First.Path;
        const Name = First.Name;
        OpenPopUpRename(Name, Path);
    }
}

function ToggleHiddenFiles() {
    UpdateConfig("HiddenFiles", !Config["HiddenFiles"]);
    ViewFolder(ActualPath);
}

function SelectAllShortCut() {
    if (ActualPath == "$TRASH") {
        Trash_Grid_SelectAll.click();
    }else{
        Grid_SelectAll.click();
    }
}

function OpenThisTerminalShortCut() {
    Grid_Terminal.click();
}

function QuitShortCut() {
    ipcRenderer.send('Window:Close');
}

function getShortCut(event) {
    let Keys = []
    if (event.ctrlKey || event.metaKey) {Keys.push("Ctrl");}
    if (event.shiftKey) {Keys.push("Shift");}
    if (event.altKey) {Keys.push("Alt");}
    Keys.push(event.key.toUpperCase())
    return Keys.join("+")
}

function NewWindow(){
    ipcRenderer.send('Window:New');
}
window.addEventListener("keyup", (event)=>{
    if (ShortCut_Active) {   
        const ShortCut = getShortCut(event)
        let SC = ShortCuts[ShortCut]
        if (SC) {
            window[SC]()   
        }
    }
    if (event.key == "Escape") {
        ViewFolderPopUP.classList.remove("Active")
        ClosePopUpNewFolder()
    }
    
})

