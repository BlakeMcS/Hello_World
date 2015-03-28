soundManager.flashVersion = 9;  
soundManager.url = 'swf/';
var themeColor =  "#f05";
var maryHadALitteLamb = ["e","d","c","d","e","e","e","x","d","d","d","x","e","g","g"];
var keyNotes = [];
var bpm = 120;
var milPerBeat = 1 / (bpm / 60 / 1000)
var key = "c";
var record = false;
var attemptSong = [];
var score = 0;
var song = [];
var listens = 3;
generate(key,1,1);

$(document).ready(function(){
  soundManager.onready(function(){

    $(".playParent > div").click(function(event){
      var id = ($(this)[0].id);
      playAnimNote(id, themeColor, getColor(id.length));
    });

    $( "body" ).keypress(function(event) {
      note = getNoteFromKey(event);
      playAnimNote(note, themeColor, getColor(note.length));
      console.log("asdf");
      console.log(event.keyCode);
    });

    $(".control").click(function(event){
      $(this).css("background-color", themeColor);
      $(this).animate({backgroundColor: "white"}, "slow");

      var id = $(this)[0].id;
      console.log(id);
      if (id === "stop"){
        keepPlaying = !(keepPlaying);
      } else if (id === "play"){
          playSong(song);
      } else if (id === "attempt"){
        record = true;
        attemptSong = [];
        $("#notesDisplay").text(attemptSong)
      } else if (id === "submit"){
        if (arraysEqual(attemptSong,song)){
          score += 1;
          $("#scoreDisplay").text(score);
        } else {
          score = 0;
          $("#scoreDisplay").text(score);
        }
        record = false;
        generate(key, score/2+1 > 6 ? 7 : score/2+1, score/2+1);
        attemptSong = [];
        $("#notesDisplay").text(attemptSong);
        listens = 3;
        $("#listensDisplay").text(listens);
      }
    });         
  });
});

/** A function that calls the audio and visual 
    components of playing a sound from two different functions*/
var playAnimNote = function (note, startColor, endColor) {
  playNote(note);
  animateKey(note, startColor, endColor);

  if ($("#keyCheckBox").is(":checked")){
    key = note;
    changeKeyDisplay(key);
  }

  if (record) {
    attemptSong.push(note);
    $("#notesDisplay").text(attemptSong);
  }
}

/** A function that takes a string indicating a note
    and calls playSound with the url it generates*/
var playNote = function (note) {
  playSound('soundMan/audiofiles/notes/' + note + '.mp3'); 
}

/** A function that takes a url and plays a
    sound accordingly*/
var playSound = function (urlVar) {
  soundManager.createSound({
    url: urlVar,
    stream: true,
    autoPlay: true
  });
}

/** Recursive function that plays a note on a timer
    then calls itself if there are more notes to play*/
function doSetTimeout(i, song) {
  setTimeout(function() {
    //Checks whether the user wants to see the computer play
    if ($("#watch").is(":checked")) {
      playAnimNote(song[i], themeColor, getColor(song[i].length))
    } else {
    playNote(song[i]);
    }

    i++;
    if (i < song.length && keepPlaying) {
      doSetTimeout(i, song);
    }
  }, 
  milPerBeat);
}

var playSong = function (song) {
  if (listens != 0) {
    doSetTimeout(0, song);
    keepPlaying = true;
    listens -= 1;
    $("#listensDisplay").text(listens);
  }
}

/** A function that animates a given key starting at
    one color and ending at another*/
var animateKey = function (note, startColor, endColor) {
  $("#" + note).css("background-color", startColor);
  $("#" + note).animate({backgroundColor: endColor});
}

/** A function that takes a string indicating 
    a note value and determines whether the note 
    is black or white */
var getColor = function (id) {
  if (id === 1) {
    oldColor = "white"
  } else {
    oldColor = "black"
  };
  return oldColor;
}

/** A function that determines the notes of a given scale
    based on a local variable chromatic scale */
function generateKeyNotes (note) {
  var chromaticScale = ["c","csharp","d","eb","e","f","fsharp","g","ab","a","bb","b"];
  keyNotesNums = [0,2,4,5,7,9,11];
  keyNotes = [];
  for (var i = 0; i < keyNotesNums.length; i++) {
    keyNotes.push((chromaticScale[(keyNotesNums[i] + chromaticScale.indexOf(note))%12]));
  }
  return keyNotes;
}

function generate (key, numOfNotes, length) {
  var newSong = [];
  var keyNotes = generateKeyNotes(key);
  for (var i = 0; i < length; i++) {
    var randNum = Math.floor(Math.random() * numOfNotes);
    newSong.push(keyNotes[randNum]);
  }
  song = newSong;
}

function changeKeyDisplay (key) {
  if (key == "z") {
      key = "c";
  }

  if (key.length === 1) {
    $("#keyDisplay").text(key.toUpperCase());
    console.log(key);
  } else if (key.length === 2) {
    $("#keyDisplay").text(key[0].toUpperCase() + "b");
  } else {
    $("#keyDisplay").text(key[0].toUpperCase() + "#");
  }
} 


function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/** A function that takes an keyboard event and
    returns a meaningful string the represents 
    a note within one octave*/
var getNoteFromKey = function (event) {
  var note = "";
  switch(event.keyCode) {
    case 122:
       note = "c";
       break;
     case 120 :
       note = "d";
       break;
     case 99:
       note = "e";
       break;
     case 118:
       note = "f";
       break;
     case 98:
       note = "g";
       break;
     case 110:
       note = "a";
       break;
     case 109:
       note = "b";
       break;
     case 44:
       note = "z";
       break;
     case 115:
       note = "csharp";
       break;
     case 100:
       note = "eb";
       break;
     case 103:
       note = "fsharp";
       break;
     case 104:
       note = "ab";
       break;
     case 106:
       note = "bb";
       break;
  }
  return note;
}