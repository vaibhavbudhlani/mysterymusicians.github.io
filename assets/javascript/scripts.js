window.addEventListener("load", initPlayer);

var audio;
var togglePlay = false;
var togglePlayButton;
var slider;

function initPlayer(){
    audio = document.getElementById("audio");
    var ul = document.getElementById("songs");
    slider = document.getElementById("slider");
    slider.addEventListener("click", seekSong);
    togglePlayButton = document.getElementById("playPause");
    togglePlayButton.addEventListener("click", toggleSong);
    document.getElementById("stopSong").addEventListener("click", stopSong);
    document.getElementById("nextSong").addEventListener("click", nextSong);
    document.getElementById("previousSong").addEventListener("click", previousSong);
    document.getElementById("savePlaylist").addEventListener("click", savePlayList);
    document.getElementById("searchSong").addEventListener("keyup", searchSong);

    for(var i = 0; i < songsArray.length; i++) {
        var li = document.createElement("li");
        var span = document.createElement("span");
        var img = document.createElement("img");
        var playIcon = document.createElement("button");
        var btn = document.createElement("button");
        span.innerHTML = songsArray[i].songName;
        span.setAttribute('title', songsArray[i].songId);
        img.setAttribute('src', songsArray[i].songImage);
        img.className = "cover";
        // btn.innerHTML = '<i class="fas fa-plus"></i>';
        btn.innerHTML = "Add to playlist";
        btn.className = "btn btn-primary playListBtn d-block w-100";
        playIcon.className = 'playIcon';
        // playIcon.innerHTML = '<i class="fas fa-play"></i>';
        // li.className = 'list-group-item';
        li.appendChild(img);
        li.appendChild(span);
        li.appendChild(btn);
        li.appendChild(playIcon);
        // span.addEventListener("click", setSongName);
        playIcon.addEventListener("click", setSongName);
        ul.appendChild(li);
        btn.addEventListener("click", addToPlaylist);
    }

    loadPlayList();

}

function savePlayList(){
    if(window.localStorage) {
        var json = JSON.stringify(obj.playList);
        console.log(json);
        localStorage.setItem('myPlayList', json);
    }
    else{
        alert("Localstorage not supported...");
    }
}

function loadPlayList() {
    if(localStorage.myPlayList) {
        var data = localStorage.getItem('myPlayList')
        obj.playList = JSON.parse(data);
    }
    showPlayList();
}

function searchSong() {
    var toSearch = event.srcElement.value;
    if(toSearch == "") {
        loadPlayList();
    }
    obj.searchSong(toSearch);
    showPlayList();
}

function setSongName(){
    // console.log(event.srcElement.parentElement.childNodes[0].innerText);
    songName = event.srcElement.parentElement.childNodes[1].innerText;
    console.log("Song name is ",songName);
    playSong(songName);
}

function playSong(songName){
    console.log("Song change");
    var songURL;
    for(var i = 0; i < songsArray.length; i++){
        if(songsArray[i].songName == songName){
            songURL = songsArray[i].songUrl;
            audio.title = songsArray[i].songId;
        }
    }
    togglePlayButton.innerHTML = '<i class="fas fa-pause"></i>';
    audio.src = songURL;
    audio.play();
    // var sliderWidth = slider.offsetWidth;
    setInterval(function(){
        slider.value = audio.currentTime;
    },500);
    setTimeout(function(){
        var duration = audio.duration;
        slider.max = duration;
    },200);
}

function seekSong(){
    audio.currentTime = slider.value;
}

//function nextSong(){
//    var songId = audio.title;
//    var n_song = parseInt(songId)+1;
//    var songName;
//    console.log(n_song);
//    for(var i = 0; i < songsArray.length; i++){
//        if(songsArray[i].songId == n_song) {
//            songName = songsArray[i].songName;
//            console.log(n_song, songName);
//        }
//    }
//    playSong(songName);
//}
function nextSong(){
    var songId = audio.title;
//    var n_song = parseInt(songId)+1;
    var songName;
//    console.log(n_song);
    for(var i = 0; i < obj.playList.length; i++){
        if(obj.playList[i].id == songId) {
            songName = obj.playList[i+1].name;
//            console.log(n_song, songName);
        }
    }
    playSong(songName);
}

function previousSong(){

}

function toggleSong(){
    if(togglePlay) {
        audio.play();
        togglePlayButton.innerHTML = '<i class="fas fa-pause"></i>';
        togglePlay = false;
    }
    else {
        audio.pause();
        togglePlayButton.innerHTML = '<i class="fas fa-play"></i>';
        togglePlay = true;
    }
}

function stopSong(){
    audio.currentTime = 0;
    audio.pause();
}

// function addToPlaylist(){
//     var ul = document.getElementById("playList");
//     var elem = event.srcElement.parentElement.innerHTML;
//     var li = document.createElement("li");
//     li.innerHTML = elem;
//     li.className = "list-group-item";
//     li.childNodes[1].addEventListener("click", setSongName);
//     li.childNodes[3].addEventListener("click", setSongName);
//     li.childNodes[2].innerHTML = '<i class="fas fa-trash"></i>';
//     li.childNodes[2].className = "btn btn-primary deleteSong";
//     ul.appendChild(li);
// }

function addToPlaylist(){
    var songId = event.srcElement.parentElement.childNodes[1].title;
    for(var i = 0; i < songsArray.length; i++){
        if(songsArray[i].songId == songId) {
            obj.addSong(songsArray[i].songId,
                        songsArray[i].songName,
                        songsArray[i].songUrl,
                        songsArray[i].songImage);
        }
    }
    showPlayList();
}

function deleteSong(){
    var songId = parseInt(event.srcElement.parentElement.childNodes[1].title);
    console.log(songId);
    obj.deleteSong(songId);
    showPlayList();
}

function showPlayList(){
    var ul = document.getElementById("playList");
    ul.innerHTML = "";
    // console.log("playlist function");
    obj.playList.forEach(function(s){
        // console.log("Creating playlist");
        var li = document.createElement("li");
        var span = document.createElement("span");
        var img = document.createElement("img");
        var playIcon = document.createElement("button");
        var btn = document.createElement("button");
        span.innerHTML = s.name;
        span.setAttribute('title', s.id);
        img.setAttribute('src', s.songimage);
        img.className = "cover";
        btn.innerHTML = '<i class="fas fa-trash"></i>';
        btn.className = "btn btn-primary deleteBtn";
        playIcon.className = 'playIcon';
        li.className = "list-group-item";
        li.appendChild(img);
        li.appendChild(span);
        li.appendChild(btn);
        li.appendChild(playIcon);
        span.addEventListener("click", setSongName);
        playIcon.addEventListener("click", setSongName);
        ul.appendChild(li);
        btn.addEventListener("click", deleteSong);
    })   
}