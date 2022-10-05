// Play, Pause and Next button variable
const play = document.querySelector(".play"),
  previous = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  // Tack-image, Song title and Artist name varibale
  trackImage = document.querySelector(".track-image"),
  title = document.querySelector(".title"),
  artist = document.querySelector(".artist"),
  //   track time and Min
  trackCurrentTime = document.querySelector(".current-time"),
  trackDuration = document.querySelector(".duration-time"),
  //Slider variable
  slider = document.querySelector(".duration-slider"),
  // Volume control
  showVolume = document.querySelector("#show-volume"),
  volumeIcon = document.querySelector("#volume-icon"),
  currentVolume = document.querySelector("#volume"),
  //   AutoPlay
  autoPlayBtn = document.querySelector(".play-all"),
  //   Hamburger and close icon
  hamBurger = document.querySelector(".fa-bars"),
  closeIcon = document.querySelector(".fa-times"),
  //   Music playlist
  musicPlaylist = document.querySelector(".music-playlist"),
  playlistDiv = document.querySelector(".playlist-div"),
  playlist = document.querySelector(".playlist");

let timer;
let autoplay = 0;
let indexTrack = 0;
let songIsPlaying = false;
let track = document.createElement("audio");

// All Event Listeners
play.addEventListener("click", justPlay);
next.addEventListener("click", nextSong);
previous.addEventListener("click", prevSong);
autoPlayBtn.addEventListener("click", autoPlayToggle);
volumeIcon.addEventListener("click", muteSound);
currentVolume.addEventListener("change", changeVolume);
slider.addEventListener("change", changeDuration);
track.addEventListener("timeupdate", songTimeUpdate);
hamBurger.addEventListener("click", showPlayList);
closeIcon.addEventListener("click", hidePlayList);

// function to Load Tracks
function loadTrack(indexTrack) {
  clearInterval(timer);
  resetSlider();

  track.src = trackList[indexTrack].path;
  trackImage.src = trackList[indexTrack].img;
  title.innerHTML = trackList[indexTrack].name;
  artist.innerHTML = trackList[indexTrack].singer;
  track.load();

  timer = setInterval(updateSlider, 1000);
}
loadTrack(indexTrack);

// function to play song
function playSong() {
  track.play();
  songIsPlaying = true;
  play.innerHTML = `<i class="fas fa-pause"></i>
    `;
}

// Play or Pause song
function justPlay() {
  if (songIsPlaying == false) {
    playSong();
  } else {
    pauseSong();
  }
}

// function to pause song
function pauseSong() {
  track.pause();
  songIsPlaying = false;
  play.innerHTML = `<i class="fas fa-play"></i>
    `;
}

// Play next song
function nextSong() {
  if (indexTrack < trackList.length - 1) {
    indexTrack++;
    loadTrack(indexTrack);
    playSong();
  } else {
    indexTrack = 0;
    loadTrack(indexTrack);
    playSong();
  }
}

function prevSong() {
  if (indexTrack > 0) {
    indexTrack--;
    loadTrack(indexTrack);
    playSong();
  } else {
    indexTrack = trackList.length - 1;
    loadTrack(indexTrack);
    playSong();
  }
}

// Mute song
function muteSound() {
  track.volume = 0;
  showVolume.innerHTML = 0;
  currentVolume.value = 0;
}

// change volume range
function changeVolume() {
  showVolume.innerHTML = currentVolume.value;
  track.volume = currentVolume.value / 100;
}

// Change Duration
function changeDuration() {
  let sliderPosition = track.duration * (slider.value / 100);
  track.currentTime = sliderPosition;
}

// Auto play all button
function autoPlayToggle() {
  if (autoplay == 0) {
    autoplay = 1;
    autoPlayBtn.style.background = "var(--color-sec)";
    autoPlayBtn.style.color = "white";
  } else {
    autoplay = 0;
    autoPlayBtn.style.background = "#ccc";
    autoPlayBtn.style.color = "black";
  }
}

// Reset Slider
function resetSlider() {
  slider.value = 0;
}

// Update Slider
function updateSlider() {
  let position = 0;

  if (!isNaN(track.duration)) {
    position = track.currentTime * (100 / track.duration);
    slider.value = position;
  }

  if (track.ended) {
    play.innerHTML = `<i class="fas fa-play"></i>
    `;
    if (autoplay == 1 && indexTrack < trackList.length - 1) {
      indexTrack++;
      loadTrack(indexTrack);
      playSong();
    } else if (autoplay == 1 && indexTrack == trackList.length - 1) {
      indexTrack = 0;
      loadTrack(indexTrack);
      playSong();
    }
  }
}

// Update Current Song Time
function songTimeUpdate() {
  if (track.duration) {
    let currentMin = Math.floor(track.currentTime / 60);
    let currentSec = Math.floor(track.currentTime - currentMin * 60);

    let durationMin = Math.floor(track.duration / 60);
    let durationSec = Math.floor(track.duration - durationMin * 60);

    if (durationSec < 10) {
      durationSec = "0" + durationSec;
    }

    if (durationMin < 10) {
      durationMin = "0" + durationMin;
    }

    if (currentMin < 10) {
      currentMin = "0" + currentMin;
    }

    if (currentSec < 10) {
      currentSec = "0" + currentSec;
    }

    trackCurrentTime.innerHTML = currentMin + ":" + currentSec;
    trackDuration.innerHTML = durationMin + ":" + durationSec;
  } else {
    trackCurrentTime.innerHTML = "00" + ":" + "00";
    trackDuration.innerHTML = "00" + ":" + "00";
  }
}

// Show PlayList
function showPlayList() {
  musicPlaylist.style.transform = "translateX(0)";
}

// hide PlayList
function hidePlayList() {
  musicPlaylist.style.transform = "translateX(-100%)";
}

// Display Tracks in PlayList
let counter = 1;
function displayTracks() {
  for (let i = 0; i < trackList.length; i++) {
    // console.log(trackList[i].name);
    let div = document.createElement("div");
    div.classList.add("playlist");

    div.innerHTML = `
        <span class="song-index">${counter++}</span>
        <p class="single-song">${trackList[i].name}</p>
    `;

    playlistDiv.appendChild(div);
  }

  playFromPlayList();
}

displayTracks();

// Play Song From the Play List
function playFromPlayList() {
  playlistDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("single-song")) {
      const indexNum = trackList.findIndex((item, index) => {
        if (item.name === e.target.innerHTML) {
          return true;
        }
      });
      loadTrack(indexNum);
      playSong();
      hidePlayList();
    }
  });
}
