const LOCAL_URL = "http://localhost:3000/rapsongs"
const HEROKU_URL = "https://whispering-shore-86049.herokuapp.com/rapsongs"

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
    fetch(LOCAL_URL)
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
    fetch("http://localhost:3000/rapsongs", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(newRapsong)
    }).then(r => r.json()).then(console.log).catch(err => { console.err(`${err} happened!`)})
}


function createPlayButtonHandler(node) {
    node.addEventListener("click", function(){
        playSong()
    })
}

function playSong(lyrics, voice, drumBeat) {
    let voices = synth.getVoices();
    let utterThis = new  SpeechSynthesisUtterance(lyrics);
    for (let element of voices) {
        if (element.name == voice) {
            utterThis.voice = element
        }
    }
    synth.speak(utterThis);
    lyricsText.blur();


    let drumBeat = rapsong.drums;
    let drumKeycode = [];
    drumBeat.split('%').forEach(function(drumSound){
        drumKeycode.push(drumSound.slice(0,2))
    })

    drumKeycode.forEach(function(keyNum){
        setTimeout(function(){
            playBeat(keyNum)
        }, 1000)
    })

}

function playBeat(keyNum){
    const audio = document.querySelector(`audio[data-key="${keyNum}"]`);
    audio.play()
}
