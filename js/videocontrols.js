var videoTag = document.getElementById("videoplayer");
var loadingBar = document.getElementById("loadingBar");
// videoTag.src="videos/lecture.mp4";
// videoTag.src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
// videoTag.src = "https://www.radiantmediaplayer.com/media/bbb-360p.mp4";
videoTag.poster = "videos/ffmpeg_4.jpg";
// loadingBar.style.display = "block";
// loadingBar.src = "images/loading.gif";
isVideoPlaying = false;
isVideoMuted = false;
progressPercent = 0;
isFullScreen = false;
hideControlsTimeout = null;
document.getElementById("showProgress").innerText = "00:00";
document.getElementById("showDuration").innerText = "00:00";

bindVideoEvents();
bindVideoContainerEvents();
// bindVideoControlEvents();

function toggleMute() {
	if (isVideoMuted === true) {
		showIconOnCenter("images/volume-up-indicator.png");
		isVideoMuted = false;
		changeVolume(1)
		document.getElementById("muteButton").src = "images/volume-up-indicator.png";
	} else {
		showIconOnCenter("images/volume-off-indicator.png");
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

function showIconOnCenter(resource) {
	var centerIcon = document.getElementById("centerIcon");
	centerIcon.style.display = "block";
	centerIcon.src = resource;
	setTimeout(() => {
		centerIcon.style.display = "none";
		centerIcon.src = "";
	}, 500);
}

function showControls() {
	document.getElementById("controlsTab").style.display = "block";
}

function hideControls() {
	clearTimeout(hideControlsTimeout);
	hideControlsTimeout = setTimeout(() => {	
		//document.getElementById("controlsTab").style.display = "none";
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
	var duration = getFormattedTime(videoTag.duration);
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
	progressPercent = (videoTag.currentTime * 100) / videoTag.duration;
	document.getElementById("showProgress").innerText = ("0" + parseInt(mins)).slice(-2) + ":" + ("0" + parseInt(seconds)).slice(-2);
	document.getElementById("myProgressBar").style.width = `${progressPercent}%`;
}

function onSeeking () {
	loadingBar.src = "images/loading.gif";
	loadingBar.style.display = "block";
	if (isVideoPlaying) {
		togglePlayPause();
	}
}

function onSeeked () {
	loadingBar.src = "images/loading.gif";
	loadingBar.style.display = "none";
	if (!isVideoPlaying) {
		togglePlayPause();
	}
}

function showFullScreen() {
	var videoContainer = document.getElementById("contain");
	document.getElementById("fullScreenButton").style.display = "none";
	document.getElementById("exitFullScreenButton").style.display = "block";
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
 	document.getElementById("fullScreenButton").style.display = "block";
	document.getElementById("exitFullScreenButton").style.display = "none";
}

function handleKeyPress(event) {
	keyPressActions(event);
}

function keyPressActions (pressedKeyEvent) {
	switch (pressedKeyEvent.charCode) {
		case 32: 
			playPauseControls();
			return;
	}
	switch (pressedKeyEvent.keyCode) {
		case 39:
			forwardTenSeconds();
			break;
		case 37:
			backTenSeconds();
			break;
	}
}

function onMouseEnter() {
	clearTimeout(hideControlsTimeout);
	showControls();
}

function onMouseMove() {
	showControls();
	hideControls();
}

function handleLoadedBufferedData() {
	let buffered = videoTag.buffered.end(0);	
	const videoDuration = videoTag.duration;
	var percent = parseInt((buffered / videoDuration) * 100);
	console.log(`percent loaded ${percent}`);
	document.getElementById("myBar").style.width = `${percent}%`;
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

function playPauseControls() {
	if (isVideoPlaying) {
		showIconOnCenter("images/pause-symbol.png");
		pauseVideo();
	} else {
		showIconOnCenter("images/play.png");
		playVideo();
	}
}

checkWindowWidth();

function checkWindowWidth() {
	if(window.innerWidth <= 600){
		setVideoHeight()
	}
}

function setVideoHeight() {
	var videoHeight = document.getElementById("videoContainer").clientHeight;
	document.getElementById("controlsTab").style.height = videoHeight + "px";
	document.getElementById("loadingBar").style.height = videoHeight + "px";
	console.log(videoHeight)
	console.log(document.getElementById("loadingBar").clientHeight)

}

function setVideoHeight() {
	var videoHeight = document.getElementById("videoplayer").clientHeight;
	console.log(videoHeight)
	document.getElementById("controlsTab").style.height = videoHeight + "px";
	document.getElementById("progresscontainer").style.height = videoHeight + "px";
	console.log(document.getElementById("progresscontainer").clientHeight)
}


function bindVideoContainerEvents() {
	var videoPlayerContainer = document.getElementById("contain");
	document.getElementById("videoContainer")
			.addEventListener("dblclick", toggleFullScreen);
	videoPlayerContainer.addEventListener("mousemove", onMouseMove);
	videoPlayerContainer.addEventListener("mouseenter", showControls);
	videoPlayerContainer.addEventListener("mouseleave", hideControls);
	videoPlayerContainer.addEventListener("keypress", handleKeyPress);
	videoPlayerContainer.addEventListener("keydown", handleKeyPress);	
}

function bindVideoEvents() {
	videoTag.addEventListener("timeupdate", onTimeUpdate);
	videoTag.addEventListener("seeking", onSeeking);
	videoTag.addEventListener("seeked", onSeeked);
	videoTag.addEventListener("durationchange", onDurationChange);
	videoTag.addEventListener("canplay", () => {
		loadingBar.style.display = "none";
		loadingBar.src = "";
		bindVideoControlEvents();
	});
	videoTag.addEventListener("loadeddata", () => {
		videoTag.addEventListener("progress", handleLoadedBufferedData);	
	});
}

function bindVideoControlEvents() {
	document.getElementById("fullScreenButton").addEventListener("click", showFullScreen);
	document.getElementById("exitFullScreenButton").addEventListener("click", exitFullScreen);
	document.getElementById("playButton").addEventListener("click", playPauseControls);
	document.getElementById("backTenSecondsButton").addEventListener("click", backTenSeconds);
	document.getElementById("forwardTenSecondsButton").addEventListener("click", forwardTenSeconds);
	document.getElementById("muteButton").addEventListener("click", toggleMute);
	document.getElementById("myProgress").addEventListener("click", function(e){
		var offset = document.getElementById("myProgress").offsetLeft;
		var left = (e.pageX - offset);
		var totalWidth = document.getElementById("myProgress").clientWidth;
		var percentage = (left / totalWidth);
		var vidTime = videoTag.duration * percentage;
		videoTag.currentTime = parseInt(vidTime);
	})
}


