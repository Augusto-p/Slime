const Dowload_Bar_out = document.getElementById("Dowload_Bar_out")
const Download = document.getElementById("Download")
Download.addEventListener("click", ()=>{
    Download.style.display = "none";
    Dowload_Bar_out.style.display = "grid";
})

function SetValueDonloadBar(value){
    document.getElementById("DownloadBar").style.width = `${value}%`
    document.getElementById("DownloadBar_text").textContent = `${value}%`
    if (value == 101) {
        Dowload_Bar_out.style.display = "none";
        Completad.style.display = "block";
    }
}