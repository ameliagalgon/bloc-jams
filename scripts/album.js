var createSongRow = function(songNumber, songName, songLength) {
   var template =
      '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

   var $row = $(template);

   var clickHandler = function(){

     var songNumber = parseInt($(this).attr('data-song-number'));

  	 if (currentlyPlayingSongNumber !== null) {
       //change the older played song to its song number
    	  var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    	  currentlyPlayingCell.html(currentlyPlayingSongNumber);
  	 }
  	 if (songNumber !== currentlyPlayingSongNumber) {
       //change the current song to the currentlyPlayingSong
  		  $(this).html(pauseButtonTemplate);
  		  currentlyPlayingSongNumber = songNumber;
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        updatePlayerBarSong();
  	 } else if (songNumber === currentlyPlayingSongNumber) {
       //stop the currently playing song
  		   $(this).html(playButtonTemplate);
         $('.main-controls .play-pause').html(playerBarPlayButton);
  		   currentlyPlayingSongNumber = null;
         currentSongFromAlbum = null;
  	 }
   };

   var onHover = function(event){
     var songItem = $(this).find('.song-item-number');
     var songItemNumber = parseInt(songItem.attr('data-song-number'));
     if(songItemNumber !== currentlyPlayingSongNumber){
       songItem.html(playButtonTemplate);
     }
   };

   var offHover = function(event){
     var songItem = $(this).find('.song-item-number');
     var songItemNumber = parseInt(songItem.attr('data-song-number'));
     if(songItemNumber !== currentlyPlayingSongNumber){
       songItem.html(songItemNumber);
     }
     console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
   };

   $row.find('.song-item-number').click(clickHandler);
   $row.hover(onHover, offHover);
   return $row;
};

var setCurrentAlbum = function(album) {
   currentAlbum = album;
   var $albumTitle = $('.album-view-title');
   var $albumArtist = $('.album-view-artist');
   var $albumReleaseInfo = $('.album-view-release-info');
   var $albumImage = $('.album-cover-art');
   var $albumSongList = $('.album-view-song-list');

   // #2
   $albumTitle.text(album.title);
   $albumArtist.text(album.artist);
   $albumReleaseInfo.text(album.year + ' ' + album.label);
   $albumImage.attr('src', album.albumArtUrl);
   // #3
   $albumSongList.empty();

   // #4
   for (var i = 0; i < album.songs.length; i++) {
     var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     $albumSongList.append($newRow);
   }
};

var trackIndex = function(album, song){
  return album.songs.indexOf(song);
};

var updatePlayerBarSong = function(){
  $('.song-name').text(currentSongFromAlbum.title);
  $('.artist-name').text(currentAlbum.artist);
  $('.artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

  $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function(){
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  if(currentSongIndex === currentAlbum.songs.length - 1){
    currentlyPlayingSongNumber = 1;
  } else{
    currentlyPlayingSongNumber++;
  }
  currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
  //update player bar
  updatePlayerBarSong();
  //change old song number cell to the song number
  var prevPlayingCell = $('.song-item-number[data-song-number="' + (currentSongIndex + 1) + '"]');
  prevPlayingCell.html(currentSongIndex + 1);
  //change the new song's number cell to a pause button
  var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  currentlyPlayingCell.html(pauseButtonTemplate);
};

var previousSong = function(){
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  if(currentSongIndex === 0){
    currentlyPlayingSongNumber = currentAlbum.songs.length;
  } else{
    currentlyPlayingSongNumber--;
  }
  currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
  //update player bar
  updatePlayerBarSong();
  //change old song number cell to the song number
  var prevPlayingCell = $('.song-item-number[data-song-number="' + (currentSongIndex + 1) + '"]');
  prevPlayingCell.html(currentSongIndex + 1);
  //change the new song's number cell to a pause button
  var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  currentlyPlayingCell.html(pauseButtonTemplate);
}

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store state of playing songs
var currentlyPlayingSongNumber = null;
var currentAlbum = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
   setCurrentAlbum(albumPicasso);
   $previousButton.click(previousSong);
   $nextButton.click(nextSong);
});
