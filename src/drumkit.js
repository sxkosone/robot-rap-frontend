function playSound(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    //console.log(audio);
    if (!audio) return; //stop function from going further if no key associated
    audio.currentTime = 0; //rewind to start if the audio is already playing!!
    audio.play();
    key.classList.add("playing");
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


