document.addEventListener("DOMContentLoaded", () => {
    console.log("connected")
})

function getAllRapsongs() {
    //fetch request to rails api. later on will parse rap songs to display from this fetch request
    fetch("https://whispering-shore-86049.herokuapp.com/rapsongs")
    .then(r => r.json()).then(console.log)
}

