async function CopyFile(Name, Path, Type) {
    let FileToCopy = []
    if (!await ipcRenderer.invoke('SelectedFiles:Void')) {
        let FilesSelected = await ipcRenderer.invoke('SelectedFiles:Get');
        FilesSelected.forEach(File => {
            Path = File.Path;
            Name = File.Name;
            Type = File.Type;
            FileToCopy.push({
                "Mode": 0,
                "Path": Path,
                "Name": Name,
                "Type": Type
            })
        });
    } else {
        FileToCopy.push({
            "Mode": 0,
            "Path": Path,
            "Name": Name,
            "Type": Type
        })
    }

    ipcRenderer.invoke('ClipBoard:Add', FileToCopy);
}
async function CutFile(Name, Path, Type) {
    let FileToCut = []
    if (!await ipcRenderer.invoke('SelectedFiles:Void')) {
        let FilesSelected = await ipcRenderer.invoke('SelectedFiles:Get');
        FilesSelected.forEach(File => {
            Path = File.Path;
            Name = File.Name;
            Type = File.Type;
            FileToCut.push({
                "Mode": 1,
                "Path": Path,
                "Name": Name,
                "Type": Type
            })
        });
    } else {
        FileToCut.push({
            "Mode": 1,
            "Path": Path,
            "Name": Name,
            "Type": Type
        })
    }

    ipcRenderer.invoke('ClipBoard:Add', FileToCut);
    ViewFolder(ActualPath)
}