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
    	  var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    	  currentlyPlayingCell.html(currentlyPlayingSongNumber);
  	 }
  	 if (songNumber !== currentlyPlayingSongNumber) {
       //change the current song to the currentlyPlayingSong
  		  $(this).html(pauseButtonTemplate);
  		  setSong(songNumber);
        //play the currentSoundFile after calling  setSong()
        currentSoundFile.play();
        //change the volumn bar fill
        var volumeFill = $('.volume .fill');
        var volumnThumb = $('.volume .thumb');
        volumeFill.width(currentVolume);
        volumnThumb.css({left: currentVolume + '%'});

        updatePlayerBarSong();
        updateSeekBarWhilePlayingSong();
  	 } else if (songNumber === currentlyPlayingSongNumber) {
         //check if the currentSoundFile is paused:
         if(currentSoundFile.isPaused()){
           //start playing the song again and revert the icon in the song row and the player bar to the pause button.
           $(this).html(pauseButtonTemplate);
           $('.main-controls .play-pause').html(playerBarPauseButton);
           currentSoundFile.play();
           updateSeekBarWhilePlayingSong();
         } else{
           //pause it and set the content of the song number cell and player bar's pause button back to the play button.
           $(this).html(playButtonTemplate);
           $('.main-controls .play-pause').html(playerBarPlayButton);
           currentSoundFile.pause();
         }
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
     //console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
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
/*
takes one argument, songNumber, and assigns currentlyPlayingSongNumber and currentSongFromAlbum a new value based on the new song number.
*/
var setSong = function(songNumber){
  if(currentSoundFile){
    currentSoundFile.stop();
  }

  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];

  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });

  setVolume(currentVolume);
};

var seek = function(time){
  if(currentSoundFile){
    currentSoundFile.setTime(time);
  }
};

var setVolume = function(volume){
  if(currentSoundFile){
    currentSoundFile.setVolume(volume);
    //set the current volume
    currentVolume = volume;
  }
};

/*
takes one argument, number, and returns the song number element that corresponds to that song number.
*/
var getSongNumberCell = function(number){
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var nextSong = function(){
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  if(currentSongIndex === currentAlbum.songs.length - 1){
    setSong(1);
  } else{
    setSong(currentlyPlayingSongNumber + 1);
  }
  //update player bar
  updatePlayerBarSong();
  //play new song
  currentSoundFile.play();
  updateSeekBarWhilePlayingSong();
  //change old song number cell to the song number
  var prevPlayingCell = getSongNumberCell(currentSongIndex + 1);
  prevPlayingCell.html(currentSongIndex + 1);
  //change the new song's number cell to a pause button
  var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
  currentlyPlayingCell.html(pauseButtonTemplate);
};

var previousSong = function(){
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  if(currentSongIndex === 0){
    setSong(currentAlbum.songs.length);
  } else{
    setSong(currentlyPlayingSongNumber - 1);
  }
  //update player bar
  updatePlayerBarSong();
  //play new song
  currentSoundFile.play();
  updateSeekBarWhilePlayingSong();
  //change old song number cell to the song number
  var prevPlayingCell = getSongNumberCell(currentSongIndex + 1);
  prevPlayingCell.html(currentSongIndex + 1);
  //change the new song's number cell to a pause button
  var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
  currentlyPlayingCell.html(pauseButtonTemplate);
}

var updateSeekBarWhilePlayingSong = function(){
  if(currentSoundFile){
    currentSoundFile.bind('timeupdate', function(event){
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');

      updateSeekPercentage($seekBar, seekBarFillRatio);
    });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio){
  var offsetXPercent = seekBarFillRatio * 100;
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';

  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function(){
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event){
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();

    var seekBarFillRatio = offsetX / barWidth;

    updateSeekPercentage($(this), seekBarFillRatio);

    if($(this).parent().hasClass('seek-control')){
      seek(seekBarFillRatio * currentAlbum.songs[currentlyPlayingSongNumber - 1].duration);
    } else {
      setVolume(seekBarFillRatio * 100);
    }
  });

  $seekBars.find('.thumb').mousedown(function(event){
    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event){
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      updateSeekPercentage($seekBar, seekBarFillRatio);

      if($(this).parent().hasClass('seek-control')){
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      } else {
        setVolume(seekBarFillRatio * 100);
      }

    });

    $(document).bind('mouseup.thumb', function(event){
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store state of playing songs
var currentlyPlayingSongNumber = null;
var currentAlbum = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
   setCurrentAlbum(albumPicasso);
   setupSeekBars();
   $previousButton.click(previousSong);
   $nextButton.click(nextSong);
});
