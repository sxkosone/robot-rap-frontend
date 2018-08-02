AOS.init();

const LOCAL_URL = "http://localhost:3000/rapsongs"
const HEROKU_URL = "https://whispering-shore-86049.herokuapp.com/rapsongs"

let recording = false;
let drumRecording = ""
let duration = 0;
let start;
let timer;

document.addEventListener("DOMContentLoaded", () => {
    console.log("connected")
    getAllRapsongs();
    document.getElementById("record-form").addEventListener("submit", (e) => {
        e.preventDefault();
        toggleRecordAndStop();
        disableButtons();
    })

    document.getElementById("save-btn").addEventListener("click", (e) => {
        if (duration > 0 && !recording) {
            createRapSong();
        } else {
            console.log("you have to record something before saving!")
        }
        
    })
    addEventListenersToBackgroundSongs();
    document.querySelector("textarea").addEventListener("blur", unmuteDrums)
    document.querySelector("textarea").addEventListener("focus", muteDrums)
    document.querySelector("#record-songname").addEventListener("blur", unmuteDrums)
    document.querySelector("#record-songname").addEventListener("focus", muteDrums)
    document.querySelector("#record-username").addEventListener("blur", unmuteDrums)
    document.querySelector("#record-username").addEventListener("focus", muteDrums)
})

function getAllRapsongs() {
    //fetch request to deployed rails api
    fetch(HEROKU_URL)
    .then(r => r.json()).then(rapsongs => {
            rapsongs.forEach(rapsong => {
            //loop through all returned rapsong objects
            let newRapsong = new Rapsong(rapsong.id, rapsong.username, rapsong.name, rapsong.drums, rapsong.lyrics, rapsong.voice, rapsong.url, rapsong.duration, rapsong.background_song)
            //render each rapsong onto screen, from newest
            newRapsong.render()
        })
    })
}

//RECORDING
function startRecording() {
    //initialize global vars again
    duration = 0;
    drumRecording = ""
    start = Date.now();

    console.log("you started recording at:", start)
    
}

function stopRecording() {
    duration = Date.now()-start
    console.log("you recorded this:", drumRecording, "length in milliseconds was:", duration)
}

//SAVING A RAPSONG
function createRapSong() {
    let name = document.querySelector("input[name='name']").value
    let username = document.querySelector("input[name='username']").value
    let drums = drumRecording
    let lyrics = document.querySelector('textarea').value;
    let voice = voiceSelect.selectedOptions[0].getAttribute('data-name');
    let url = "/"
    let songDuration = duration
    let backgroundSong = parseInt(document.querySelector(".selected-background-song").dataset.backgroundsongid)

    let newObj = {username: username, name: name, drums: drums, lyrics: lyrics, voice: voice, url: url, duration: songDuration, background_song: backgroundSong}
    fetch(HEROKU_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(newObj)
    }).then(r => r.json())
    .then(data => {
        console.log(data)
        let newRapSong = new Rapsong(data.id, data.username, data.name, data.drums, data.lyrics, data.voice, data.url, data.duration, data.background_song)
        newRapSong.render()
    })
    .catch(err => { console.err(`${err} happened!`)})
}

//PLAY A RAPSONG FUNCTIONALITIES
function playSongLyrics(lyrics, voice) {
    let voices = synth.getVoices();
    let utterThis = new  SpeechSynthesisUtterance(lyrics);
    for (let element of voices) {
        if (element.name == voice) {
            utterThis.voice = element
        }
    }
    synth.speak(utterThis);
    lyricsText.blur();
}

function playDrums(drumStr) {
    //initialize counter to 0. set Interval to 10milliseconds
    //every time the interval fires increase counter by 10 and we check if the first element has a time value that is less than the counter
    //if it does we play the audio at the set key and then shift()
    //if array length equal 0, then clear Interval with id
    let drumBeatArr = drumStr.split('%')
    drumBeatArr.pop()
    let newDrumBeatArr = drumBeatArr.map(x => x.split("-"))
    let counter = 0
    timer = setInterval(function(){
        if(newDrumBeatArr.length === 0) {
            clearInterval(timer)
        } else if(newDrumBeatArr[0][1] <= counter ) {
            playBeat(newDrumBeatArr[0][0])
            newDrumBeatArr.shift()
        }
        counter += 10
    }, 10)
}

function playBeat(keyNum){
    const audio = document.querySelector(`audio[data-key="${keyNum}"]`);
    audio.currentTime = 0
    audio.play()
}

function stopSong(backgroundSongId) {
    speechSynthesis.cancel();
    clearInterval(timer)
    const bg = document.querySelector(`audio[data-backgroundSongId="${backgroundSongId}"]`)
    bg.pause();
    bg.currentTime = 0;
}

function togglePlayStopText(button) {
    button.innerText = button.innerText === "Play" ? "Stop" : "Play"
}

//------------------------------------------------
//BUTTON and RECORD functionalities
function toggleRecordAndStop() {
    //recording will be now toggled ONLY here
    const bg = document.querySelector(".selected-background-song")
    recording = !recording
    if(recording) {
        startRecording()
        playLyrics()
        bg.play()
        document.getElementById("record-btn").value = "Stop recording"
    } else {
        stopRecording()
        bg.pause()
        document.getElementById("record-btn").value = "Record my rap song!"
    }
}

function disableButtons() {
    let allButtons = document.querySelectorAll("button")
    if(document.getElementById("record-btn").value === "Stop recording") {
        document.getElementById("lyrics-btn").disabled = true;
        allButtons.forEach(button => {
            button.disabled = true;
        })
    } else {
        allButtons.forEach(button => {
            document.getElementById("lyrics-btn").disabled = false;
            button.disabled = false;
        })
    }
}
//BACKGROUND SONG functionalities
function addEventListenersToBackgroundSongs() {
    document.querySelectorAll(".background-song").forEach(backgroundSong => {
        backgroundSong.addEventListener("click", (e) => {
            chooseBackgroundSong(e.target)
        })
    })
}

function chooseBackgroundSong(backgroundSong) {
    document.querySelectorAll(".background-song").forEach(backgroundSong => {
        backgroundSong.classList.remove("selected-background-song")
    })
    backgroundSong.classList.add("selected-background-song")
    console.log(backgroundSong)
}

function playBackgroundSong(id, duration, buttonEl) {
    if (id) {
        console.log(id, duration)
        const bg = document.querySelector(`audio[data-backgroundSongId="${id}"]`)
        bg.play()
    }
    setTimeout(function() {
        stopSong(id)
        togglePlayStopText(buttonEl)
    }, duration)
}

function muteDrums() {
    console.log("muted")
    let allDrumAudio = document.querySelectorAll(".drumsounds")
    allDrumAudio.forEach(sound => sound.muted = true)
}

function unmuteDrums() {
    console.log("unmuted")
    let allDrumAudio = document.querySelectorAll(".drumsounds")
    allDrumAudio.forEach(sound => sound.muted = false)
}


