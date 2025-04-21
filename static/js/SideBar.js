const Side_Bar = document.getElementById("Side-Bar")
let XDG_Folders = []

function New_Side_Element(Name, Icon, Path, Separador= false) {
    if (!Separador) {   
        let button = document.createElement("button")
        button.classList.add("row")
        button.innerHTML = `${getIconSideBar(Icon)}<span>${Name}</span>`
        button.addEventListener("click", ()=>{
            ViewFolder(Path)
        })
        Side_Bar.appendChild(button)
    }else{
        let sep = document.createElement("div")
        sep.classList.add("row")
        sep.classList.add("Separador")
        Side_Bar.append(sep)
    }
    
}
function Load_XDG_Bar() {
    HomeSplit = $HOME.split("/")
    New_Side_Element(HomeSplit[HomeSplit.length -1], "HOME", $HOME, )
    runBashCommand(`cat $HOME/.config/user-dirs.dirs`).then(datos =>{
        datos.split("\n").forEach(line => {
            if (line.startsWith("XDG_")) {
                lineSplit = line.split("=")
                iconName = lineSplit[0].replace("XDG_","").replace("_DIR","")
                let Path = lineSplit[1].replaceAll('"',"")
                PathSplit = Path.split("/")
                Name = PathSplit[PathSplit.length -1]
                XDG_Folders.push([iconName, ClearPath(Path)]);
                New_Side_Element(Name, iconName, Path)

            } 
        });    
        New_Side_Element("Trash", "TRASH", $TRASH)
        New_Side_Element(null,null,null, true)
        Load_Bookmarks()
        ViewFolder();
    });
}
function Load_Bookmarks() {
    Bookmarks.forEach(mark=>{
        if (Object.keys(mark).includes("Separator") && mark.Separator) {
            New_Side_Element(null,null,null, true)
        }else{
            New_Side_Element(mark.Name,mark.Icon,mark.Path)
        }
        
        
    })
    
}
function getIconSideBar(icon){
    let IconData = icons[icon]
    if (IconData == undefined) {
        return icons["null"]
    }
    return IconData
}
