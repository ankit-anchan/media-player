var videoTag = document.getElementById("videoplayer");
var loadingBar = document.getElementById("loadingBar");
console.log(videoTag)
videoTag.src="lecture.mp4";
isVideoPlaying = false;
isVideoMuted = false;
progressPercent = 0;
isFullScreen = false;
document.getElementById("showProgress").innerText = progressPercent;

		function toggleMute() {
			if (isVideoMuted) {
				isVideoMuted = false;
				changeVolume(1)
				document.getElementById("muteButton").innerText = "Mute";
			} else {
				isVideoMuted = true;
				changeVolume(0)
				document.getElementById("muteButton").innerText = "unmute";
			}
		}

		bindEvents();

		function playVideo () {
			isVideoPlaying = true;
			videoTag.play();
			document.getElementById("playButton").src = "pause-symbol.png";
		}

		function showControls() {
			document.getElementById("controlsTab").setAttribute("style", "display: block");
		}

		function hideControls() {
			//document.getElementById("controlsTab").setAttribute("style", "display: none");
		}

		function pauseVideo () {
			isVideoPlaying = false;
			videoTag.pause();
			document.getElementById("playButton").src = "play.png"
		}

		function forwardTenSeconds () {
			this.videoTag.currentTime += 10;
		}

		function backTenSeconds () {
			this.videoTag.currentTime -= 10;
		}

		function onDurationChange(event) {
			var mins = videoTag.duration / 60;
			var seconds = videoTag.duration % 60;
			document.getElementById("showDuration").innerText = parseInt(mins) + ":" + parseInt(seconds);
		}

		function getFormattedTime(totalTime) {
			return {mins: videoTag.duration / 60, seconds:videoTag.duration % 60 }
		}

		function onTimeUpdate (event) {
			// document.getElementById("showProgress").innerText = videoTag.currentTime;
			var mins = videoTag.currentTime / 60;
			var seconds = videoTag.currentTime % 60;
			progressPercent = (videoTag.currentTime * 100) / videoTag.duration;
			document.getElementById("showProgress").innerText = parseInt(mins) + ":" + parseInt(seconds);
		}

		function onSeeking (event) {
			loadingBar.setAttribute("style", "display: block");
			if (isVideoPlaying) {
				togglePlayPause();
			}
		}

		function onSeeked (event) {
			loadingBar.setAttribute("style", "display: none");
			if (!isVideoPlaying) {
				togglePlayPause();
			}
		}

		function showFullScreen() {
			var videoContainer = document.getElementById("contain");
			document.getElementById("fullScreenButton").setAttribute("style", "display: none");
			document.getElementById("exitFullScreenButton").setAttribute("style", "display: block");
			if (videoContainer.requestFullscreen) {
				videoContainer.requestFullscreen();
			} else if (videoContainer.mozRequestFullScreen) {
				videoContainer.mozRequestFullScreen();
			} else if (videoContainer.webkitRequestFullscreen) {
				videoContainer.webkitRequestFullscreen();
			} else if (videoContainer.msRequestFullscreen) { 
				videoContainer.msRequestFullscreen();
			}
		}

		function exitFullScreen() {
			if (document.exitFullscreen) {
			    document.exitFullscreen();
			  } else if (document.mozCancelFullScreen) { /* Firefox */
			    document.mozCancelFullScreen();
			  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
			    document.webkitExitFullscreen();
			  } else if (document.msExitFullscreen) { /* IE/Edge */
			    document.msExitFullscreen();
			  }
		 	document.getElementById("fullScreenButton").setAttribute("style", "display: block");
			document.getElementById("exitFullScreenButton").setAttribute("style", "display: none");
		}

		function handleKeyPress(event) {
			console.log("key pressed");
			console.log(event);
			keyPressActions(event);
		}

		function keyPressActions (pressedKeyEvent) {
			switch (pressedKeyEvent.charCode) {
				case 32: 
					console.log("pressed space");
					togglePlayPause();
					break;
			}
			switch (pressedKeyEvent.keyCode) {
				case 39:
					console.log("pressed right arrow");
					forwardTenSeconds();
					break;
				case 37:
					console.log("pressed left arrow");
					backTenSeconds();
					break;
			}
		}

		function toggleFullScreen() {
			if (isFullScreen === true) {
				isFullScreen = false;
				exitFullScreen();
			} else {
				isFullScreen = true;
				showFullScreen();
			}
		}

		function togglePlayPause () {
			if (isVideoPlaying) {
				pauseVideo();
			} else {
				playVideo();
			}
		}

		function changeVolume (volume) {
			videoTag.volume = volume;
		}

		function bindEvents() {
			console.log("binding events");
			var videoPlayerContainer = document.getElementById("contain");
			videoPlayerContainer.addEventListener("mouseenter", showControls);
			videoPlayerContainer.addEventListener("mouseleave", hideControls);
			videoPlayerContainer.addEventListener("dblclick", toggleFullScreen);
			videoPlayerContainer.addEventListener("keypress", handleKeyPress);
			videoPlayerContainer.addEventListener("keydown", handleKeyPress);
			videoTag.addEventListener("timeupdate", onTimeUpdate);
			videoTag.addEventListener("seeking", onSeeking);
			videoTag.addEventListener("seeked", onSeeked);
			videoTag.addEventListener("durationchange", onDurationChange);
		}



