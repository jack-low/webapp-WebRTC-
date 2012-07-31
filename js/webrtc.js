
navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;
window.URL = window.URL || window.webkitURL;

var app = document.getElementById('app');
var video = document.getElementById('monitor');
var canvas = document.getElementById('photo');
var effect = document.getElementById('effect');
var gallery = document.getElementById('gallery');

var canvasOUT = document.getElementById('OUTPTcvs');
var context = canvasOUT.getContext('2d');

var ctx = canvas.getContext('2d');
var intervalId = null;
var count= 0;
var sx,sy,bx,by;

function changeFilter(el) {
  el.className = '';
  var effect = filters[idx++ % filters.length];
  if (effect) {
    el.classList.add(effect);
  }
}

function gotStream(stream) {
  if (window.URL) {
    video.src = window.URL.createObjectURL(stream);
  } else {
    video.src = stream; // Opera.
  }

  video.onerror = function(e) {
    stream.stop();
  };

  stream.onended = noStream;

  video.onloadedmetadata = function(e) { 
    document.getElementById('splash').hidden = true;
    document.getElementById('app').hidden = false;
  };

 
  setTimeout(function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    document.getElementById('splash').hidden = true;
    document.getElementById('app').hidden = false;
    
  }, 50);
}

function noStream(e) {
  var msg = 'No camera available.';
  if (e.code == 1) {
    msg = 'User denied access to use camera.';
  }
  document.getElementById('errorMessage').textContent = msg;
}

function capture() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    return;
  }
  
}

function canvasSet()
{
		ctx.drawImage(video, 0, 0);
    
		var OUTPT = new Image();

		OUTPT.src = canvas.toDataURL('image/webp');
		sx = 0;
		sy = 0;
		bx = 200;
		by = 200;
		
		context.drawImage(OUTPT, sx, sy, bx, by);
}
function setTimer()
{
canvasSet();
timerID = setInterval("canvasSet()",1);
}
function clearTimer()
{
clearInterval(timerID);
}

function init(el) {
  if (!navigator.getUserMedia) {
    document.getElementById('errorMessage').innerHTML = 'Sorry. <code>navigator.getUserMedia()</code> is not available.';
    return;
  }
  el.onclick = capture;
  el.textContent = 'Snapshot';
  navigator.getUserMedia({video: true}, gotStream, noStream);
}

window.addEventListener('keydown', function(e) {
  if (e.keyCode == 27) { // ESC
    document.querySelector('details').open = false;
  }
}, false);