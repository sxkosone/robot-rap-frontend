const LOCAL_URL = "http://localhost:3000/rapsongs"
const HEROKU_URL = "https://whispering-shore-86049.herokuapp.com/rapsongs"

let recording = false;
let drumRecording = ""
let start;

document.addEventListener("DOMContentLoaded", () => {
    console.log("connected")
    getAllRapsongs();
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
    //fetch request to local rails api
    fetch(LOCAL_URL)
    .then(r => r.json()).then(rapsongs => {
        rapsongs.forEach(rapsong => {
            console.log(rapsong)
            let newRapsong = new Rapsong(rapsong.id, rapsong.username, rapsong.name, rapsong.drums, rapsong.lyrics, rapsong.voice, rapsong.url)
            newRapsong.render()
        })
    })
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
    fetch("http://localhost:3000/rapsongs", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(newRapsong)
    }).then(r => r.json()).then(console.log).catch(err => { console.err(`${err} happened!`)})
}
