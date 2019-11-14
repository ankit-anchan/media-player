var videoTag = document.getElementById("videoplayer");
var loadingBar = document.getElementById("loadingBar");
// videoTag.src="videos/lecture.mp4";
// videoTag.src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
videoTag.src = "https://www.radiantmediaplayer.com/media/bbb-360p.mp4";
isVideoPlaying = false;
isVideoMuted = false;
progressPercent = 0;
isFullScreen = false;
showingControls = false;
document.getElementById("showProgress").innerText = "00:00";

bindVideoEvents();
bindVideoContainerEvents();
bindVideoControlEvents();

function toggleMute() {
	if (isVideoMuted === true) {
		isVideoMuted = false;
		changeVolume(1)
		document.getElementById("muteButton").src = "images/volume-up-indicator.png";
	} else {
		isVideoMuted = true;
		changeVolume(0)
		document.getElementById("muteButton").src = "images/volume-off-indicator.png";
	}
}

function playVideo () {
	showControls();
	isVideoPlaying = true;
	videoTag.play();
	document.getElementById("playButton").src = "images/pause-symbol.png";
	hideControls();
}

function showControls() {
	clearInterval(hideControls);
	document.getElementById("controlsTab").setAttribute("style", "display: block");
}

function hideControls() {
	setTimeout(() => {	
		document.getElementById("controlsTab").setAttribute("style", "display: none");
	}, 2000);
}

function pauseVideo () {
	showControls();
	isVideoPlaying = false;
	videoTag.pause();
	document.getElementById("playButton").src = "images/play.png"
	hideControls();
}

function forwardTenSeconds () {
	videoTag.currentTime += 10;
}

function backTenSeconds () {
	videoTag.currentTime -= 10;
}

function onDurationChange(event) {
	var duration = getFormattedTime(videoTag.duration)
	document.getElementById("showDuration").innerText = duration.minutes + ":" + duration.seconds;
}

function getFormattedTime(totalTime) {
	let minutes = totalTime / 60;
	let seconds = totalTime % 60;
	return {minutes: ("0" + parseInt(minutes)).slice(-2), seconds: ("0" + parseInt(seconds)).slice(-2) }
}

function onTimeUpdate (event) {
	var mins = videoTag.currentTime / 60;
	var seconds = videoTag.currentTime % 60;
	progressPercent = parseInt((videoTag.currentTime * 100) / videoTag.duration);
	console.log(progressPercent);
	document.getElementById("showProgress").innerText = ("0" + parseInt(mins)).slice(-2) + ":" + ("0" + parseInt(seconds)).slice(-2);
	document.getElementById("myProgressBar").setAttribute("style", `width: ${progressPercent}%`)
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
	keyPressActions(event);
}

function keyPressActions (pressedKeyEvent) {
	switch (pressedKeyEvent.charCode) {
		case 32: 
			console.log("pressed space");
			togglePlayPause();
			return;
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

function handleLoadedBufferedData() {
	console.log(videoTag.readyState);
	if (videoTag.readyState === 1) {
		let buffered = videoTag.buffered.end(0);	
		const videoDuration = videoTag.duration;
		var percent = parseInt((buffered / videoDuration) * 100);
		document.getElementById("myBar").setAttribute("style", `width: ${percent}%`)
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

function bindVideoContainerEvents() {
	var videoPlayerContainer = document.getElementById("contain");
	var videoContainer = document.getElementById("videoContainer")
			.addEventListener("dblclick", toggleFullScreen);
	videoPlayerContainer.addEventListener("mouseenter", showControls);
	videoPlayerContainer.addEventListener("mouseleave", hideControls);
	videoPlayerContainer.addEventListener("mouseover", showControls);
	videoPlayerContainer.addEventListener("keypress", handleKeyPress);
	videoPlayerContainer.addEventListener("keydown", handleKeyPress);	
}

function bindVideoEvents() {
	videoTag.addEventListener("timeupdate", onTimeUpdate);
	videoTag.addEventListener("seeking", onSeeking);
	videoTag.addEventListener("seeked", onSeeked);
	videoTag.addEventListener("durationchange", onDurationChange);
	videoTag.addEventListener("loadeddata", () => {
		videoTag.addEventListener("progress", handleLoadedBufferedData);	
	});
}

function bindVideoControlEvents() {
	document.getElementById("fullScreenButton").addEventListener("click", showFullScreen);
	document.getElementById("exitFullScreenButton").addEventListener("click", exitFullScreen);
	document.getElementById("playButton").addEventListener("click", togglePlayPause);
	document.getElementById("backTenSecondsButton").addEventListener("click", backTenSeconds);
	document.getElementById("forwardTenSecondsButton").addEventListener("click", forwardTenSeconds);
	document.getElementById("muteButton").addEventListener("click", toggleMute);
}


