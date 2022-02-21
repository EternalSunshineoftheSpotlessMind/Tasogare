const jsmediatags = window.jsmediatags;
const audio = document.querySelector('#audio');

document.querySelector("#input").addEventListener("change", (event) => {
  
  const file = event.target.files[0];

  jsmediatags.read(file, {
    onSuccess: function(tag) { 

      // Array buffer to base64
      const data = tag.tags.picture.data;
      const format = tag.tags.picture.format;
      let base64String = "";
      for (let i = 0; i < data.length; i++) {
        base64String += String.fromCharCode(data[i]);
      }

      // Output media tags
      document.querySelector("#cover").style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;
      
      // Output song title and artist
      document.querySelector("#title").textContent = tag.tags.title;
      document.querySelector("#artist").textContent = tag.tags.artist;

      // Load song into player
      const control = document.createElement('source');
      control.id = 'control';
      control.type = "audio/mpeg";
      audio.src = URL.createObjectURL(file);
      audio.appendChild(control);
      },
      onError: function(error) {
        console.log(error);
      }
  });  
});

/*
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
*/
//event listener
