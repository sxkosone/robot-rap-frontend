let recording = false;
let drumRecording = ""
let start;

document.addEventListener("DOMContentLoaded", () => {
    console.log("connected")
    document.getElementById("record-form").addEventListener("submit", (e) => {
        e.preventDefault();
        startRecording();
    })
    document.getElementById("stop-btn").addEventListener("click", (e) => {
        stopRecording();
    })
    document.getElementById("save-btn").addEventListener("click", (e) => {
        createRapSong();
    })
})

function getAllRapsongs() {
    //fetch request to rails api. later on will parse rap songs to display from this fetch request
    fetch("http://localhost:3000/rapsongs")
    .then(r => r.json()).then(console.log)
}

function startRecording() {
    drumRecording = ""
    start = Date.now();
    console.log("you started recording at:", start)
    recording = !recording
}

function stopRecording() {
    recording = !recording;
    console.log("you recorded this:", drumRecording)
}

function createRapSong() {
    let name = document.querySelector("input[name='name']").value
    let username = document.querySelector("input[name='username']").value
    let drums = drumRecording
    let lyrics = document.querySelector('textarea').value;
    let voice = voiceSelect.selectedOptions[0].getAttribute('data-name');
    let url = "/"

    let newRapsong = new Rapsong(name, username, drums, lyrics, voice, url)
    let songObj = {name: name, username: username, drums: drums, lyrics: lyrics, voice: voice, url: url}
    console.log(JSON.stringify(songObj))
    fetch("http://localhost:3000/rapsongs", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8"},
        body: JSON.stringify(newRapsong)
    }).then(r => r.json()).then(console.log)
}

