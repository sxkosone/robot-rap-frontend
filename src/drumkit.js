function playSound(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    if (!audio) return; //stop function from going further if no key associated
    audio.currentTime = 0; //rewind to start if the audio is already playing!!
    audio.play();
    key.classList.add("playing");

    //if recording, then also store key and Date.now()
    if (recording) {
        drumRecording += e.keyCode
        let timer = Date.now() - start; //return time elapsed from start of recording in milliseconds
        drumRecording += "-"+timer + "%"
    }
}

function removeTransition(e) {
    if (e.propertyName !== "transform") return; //skip transition event if it's not transform
    e.target.classList.remove("playing");
}

const keys = document.querySelectorAll(".keys");
keys.forEach(key => {
    key.addEventListener("transitionend", removeTransition);
})

window.addEventListener("keydown", playSound)
