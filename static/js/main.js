let PathNextElement = document.getElementById('paths-next');
let PathPreviusElement = document.getElementById('paths-previus');
let PathBar = document.getElementById('Path-Bar');
let PathQ = document.getElementById('Path-Q');
let NextPath = "";
PathBar.addEventListener('click', () => {PathBar.classList.add("active");});
PathQ.addEventListener('blur', () => {
    PathBar.classList.remove("active");
    ViewFolder(PathBar.value);
});

PathQ.addEventListener('keyup', (e) => {
    if (e.key == "Enter") {
        PathBar.classList.remove("active");
        ViewFolder(PathQ.value);
    }
});

PathPreviusElement.addEventListener('click', (e) => {
    if (PathPreviusElement.classList.contains("active")) {
        ActualPath = ClearPath(ActualPath)
        NewPath = ActualPath.split("/");
        NewPath.pop();
        let path = "";
        NewPath.forEach(part => {path += `/${part}`;});
        path = path.replaceAll("//", "/");
        NextPath = ActualPath;
        PathNextElement.classList.add("active");
        ViewFolder(path);
    }
});
PathNextElement.addEventListener('click', (e) => {
    if (PathNextElement.classList.contains("active") && NextPath != "") {
        PathNextElement.classList.remove("active");
        ViewFolder(NextPath);
        NextPath = "";
    }
});


function ClearPath(Path) {
    return Path.replace("$HOME", $HOME)
    
}

StartIcon.classList.add("Closed")
