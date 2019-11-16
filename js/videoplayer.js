var manifestUri = 'videos/dash.mpd';
// var manifestUri = "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd";

function initApp() {
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }
}

function initPlayer() {
    var video = document.getElementById("videoplayer");
    var player = new shaka.Player(video);

    player.configure({
        streaming: {
            bufferingGoal: 30,
            rebufferingGoal: 15,
            bufferBehind: 60
        }
    });

    window.player = player;

    // Listen for errors
    player.addEventListener('error', onErrorEvent);
    player.load(manifestUri).then(function () {
        // This runs if the asynchronous load is successful.
        video.play();
        console.log('The video has now been loaded!');
    })
    .catch(onError);
}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
}

document.addEventListener("DOMContentLoaded", initApp);
