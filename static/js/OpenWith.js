

const OpenWithOpen = document.getElementById("OpenWith-Open");
const OpenWithApps = document.getElementById("OpenWithApps");
const NewDefault = document.getElementById("NewDefault");
function NewOpenWithApp(Key, Name, Icon, Exec, Default = false) {
    if (Name.replace(/\(.*?\)/g, '').trim().replaceAll("  ", " ") != "" && Icon != "" && Icon) {
        let app = document.createElement("button")
        app.classList.add("Item");
        app.setAttribute("Data-Key", Key);
        if (Default) { app.classList.add("Selected"); }
        app.innerHTML = `<img src="${Icon ?? ""}"><span>${Name.replace(/\(.*?\)/g, '').trim().replaceAll("  ", " ")}</span>`
        app.addEventListener("click", () => {
            let Selected = document.getElementsByClassName("Selected")
            if (Selected.length != 0) { Selected[0].classList.remove("Selected") }
            app.classList.add("Selected")
            OpenWithOpen.setAttribute("data-Command", Exec)
            OpenWithOpen.setAttribute("data-Key", Key)
            if (NewDefault.dataset.key == Key) {
                NewDefault.checked = true;
                OpenWithOpen.setAttribute("data-NewDefault", true)
            } else {
                NewDefault.checked = false;
                OpenWithOpen.setAttribute("data-NewDefault", false)
            }
        })
        OpenWithApps.appendChild(app)
    }
}
function NewOpenWithSpan(text) {
    let span = document.createElement("span");
    span.textContent = text;
    OpenWithApps.appendChild(span);
}
NewDefault.addEventListener("change", () => {
    if (NewDefault.checked) {
        let Selected = document.getElementsByClassName("Selected")
        NewDefault.setAttribute("data-Key", Selected[0].dataset.key)
        OpenWithOpen.setAttribute("data-NewDefault", true)
    }
})

async function MakeOpenWith(Path, Name) {
    OpenWith.classList.add("Active");
    ShortCut_Active = false;
    OpenWithApps.innerHTML = ""
    document.getElementById("OpenWith-FileName").textContent = `Open With the File: ${Name}`
    let Apps = await ipcRenderer.invoke('OpenWith:Get', Path)
    let DefaultAPP = Apps.Default;
    let xorgMime = Apps.MimeType;
    OpenWithOpen.setAttribute("data-Path", Path)
    if (DefaultAPP != undefined) {
        NewOpenWithSpan("Default app:");
        document.getElementById("NewDefault").checked = true;
        NewDefault.setAttribute("Data-Key", DefaultAPP.key);
        OpenWithOpen.setAttribute("data-Key", DefaultAPP.key);
        OpenWithOpen.setAttribute("data-Command", DefaultAPP.Command);
        OpenWithOpen.setAttribute("data-NewDefault", true);
        NewOpenWithApp(DefaultAPP.key, DefaultAPP.Name, DefaultAPP.Icon, DefaultAPP.Command, true);
    }
    console.log(xorgMime);
    
    if (xorgMime) {
        NewOpenWithSpan("Recommended apps:");
        xorgMime.forEach(app => {
            NewOpenWithApp(app.key, app.Name, app.Icon, app.Command);
        });
    }

    if (Apps.Apps != []) {
        NewOpenWithSpan("All apps:");
        Object.keys(Apps.Apps).forEach(key => {
            NewOpenWithApp(key, Apps.Apps[key].Name, Apps.Apps[key].Icon, Apps.Apps[key].Command);
        });
    }


}

OpenWithOpen.addEventListener("click", () => {
    if (OpenWithOpen.getAttribute("data-NewDefault") == true) {
        ipcRenderer.send('OpenWith:SetDefault',OpenWithOpen.getAttribute("data-Key"), OpenWithOpen.getAttribute("data-Path") )
    }
    ipcRenderer.send("OpenWith:Open", OpenWithOpen.getAttribute("data-Command"), OpenWithOpen.getAttribute("data-Path"))
    ClosePopUpOpenWith()
})


document.getElementById("OpenWith-Closed").addEventListener("click", () => { ClosePopUpOpenWith(); })
document.getElementById("OpenWith").addEventListener("click", (e) => { if (e.target.id == "OpenWith") { ClosePopUpOpenWith(); } });

function ClosePopUpOpenWith() {
    OpenWith.classList.remove("Active");
    ShortCut_Active = true;
}

