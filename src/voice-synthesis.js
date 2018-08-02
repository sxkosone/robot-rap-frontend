//global vars
let synth = window.speechSynthesis;
let lyricsForm = document.querySelector('#lyrics-form');
let lyricsText = document.querySelector('textarea');
let voiceSelect = document.querySelector('select');


//add event listener to button
lyricsForm.addEventListener("submit", (e) => {
    console.log("clicked")
    e.preventDefault();
    playLyrics();
})

function populateVoices() {
    let voices = synth.getVoices();
    for (let voice of voices) {
        let option = document.createElement("option");
        option.textContent = `${voice.name} (${voice.lang})`;
        if(voice.default) {
            option.textContent += " - DEFAULT";
        }
        option.setAttribute('data-lang', voice.lang)
        option.setAttribute('data-name', voice.name)
        voiceSelect.appendChild(option)
    }
}

populateVoices();

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
}

function playLyrics() {
    console.log("playing")
    let voices = synth.getVoices();
    let utterThis = new  SpeechSynthesisUtterance(lyricsText.value);
    let selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for (let voice of voices) {
        if (voice.name == selectedOption) {
            utterThis.voice = voice
        }
    }
    synth.speak(utterThis);
    lyricsText.blur();
}
