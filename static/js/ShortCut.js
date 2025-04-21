let ShortCut_Active = true

function getShortCut(event) {
    let Keys = []
    if (event.ctrlKey || event.metaKey) {Keys.push("Ctrl");}
    if (event.shiftKey) {Keys.push("Shift");}
    if (event.altKey) {Keys.push("Alt");}
    Keys.push(event.key.toUpperCase())
    return Keys.join("+")
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

