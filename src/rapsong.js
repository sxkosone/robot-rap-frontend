class Rapsong {
    constructor(id, username, name, drums, lyrics, voice, url) {
        this.id = id
        this.name = name
        this.username = username
        this.drums = drums
        this.lyrics = lyrics
        this.voice = voice
        this.url = url
    }

    render() {
        let rapsongEl = document.createElement("div")
        let rapsongsDiv = document.getElementById("rapsongs")
        rapsongsDiv.prepend(rapsongEl)
        rapsongEl.innerHTML = this.innerHTML()
        rapsongEl.querySelector("button").addEventListener("click", (event) => {
            //debugger
            if (event.target.innerText === "Play") {
                playSong(this.lyrics, this.voice, this.drums, event)
                togglePlayStopText(event.target)
            } else if (event.target.innerText === "Stop") {
                stopSong()
                togglePlayStopText(event.target)
            }
            
        })
    }

    innerHTML() {
        return `<h3>${this.name} by ${this.username}</h3><p>${this.lyrics}</p><button data-songId="${this.id}">Play</button>`
    }

}