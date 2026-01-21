export default function openSideBar(){
document.getElementById("sidebar").classList.add("open")
document.getElementById("sidebar-overlay").classList.add("active")
}

export function closeSideBar(){
    document.getElementById("sidebar").classList.remove("open")
document.getElementById("sidebar-overlay").classList.remove("active")
}