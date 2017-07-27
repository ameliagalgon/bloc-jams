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

     var songNumber = $(this).attr('data-song-number');

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
  	 } else if (songNumber === currentlyPlayingSongNumber) {
       //stop the currently playing song
  		   $(this).html(playButtonTemplate);
  		   currentlyPlayingSongNumber = null;
         currentSongFromAlbum = null;
  	 }
   };

   var onHover = function(event){
     var songItem = $(this).find('.song-item-number');
     var songItemNumber = songItem.attr('data-song-number');
     if(songItemNumber !== currentlyPlayingSongNumber){
       songItem.html(playButtonTemplate);
     }
   };

   var offHover = function(event){
     var songItem = $(this).find('.song-item-number');
     var songItemNumber = songItem.attr('data-song-number');
     if(songItemNumber !== currentlyPlayingSongNumber){
       songItem.html(songItemNumber);
     }
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

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
var currentlyPlayingSongNumber = null;
var currentAlbum = null;
var currentSongFromAlbum = null;


$(document).ready(function() {
   setCurrentAlbum(albumPicasso);
});
