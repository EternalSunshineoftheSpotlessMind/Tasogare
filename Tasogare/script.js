const jsmediatags = window.jsmediatags;
const musicContainter = document.querySelector('.menu');
const title = document.querySelector('#title');
const artist = document.querySelector('#artist');
const cover = document.querySelector('#cover');
const control = document.querySelector('#audioControl');


// song titles
const songs = ['dancing queen', 'flower', 'nowhere'];

// keep track
let songIndex = 2;

// initially load
loadSong(songs[songIndex]);

// update song details
function loadSong(song){
    const audio = document.createElement('source');
    audio.id = 'audio';
    audio.type = "audio/mpeg";
    const musicFile = fetch('music/'+song+'.m4a');

    title.innerText = song;
    audio.src = 'music/'+song+'.m4a';
    cover.src = 'images/'+song+'.jpg';
    control.appendChild(audio);
}

//event listener
