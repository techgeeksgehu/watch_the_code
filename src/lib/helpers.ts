function loadVideo(
	video: HTMLVideoElement,
	callback: (video: HTMLVideoElement) => void,
) {
	const setupTimeline = () => {
		video.removeAttribute("autoplay");
		video.currentTime = 0;
		video.pause();

		callback(video);
	};

	if (video.readyState >= 1) {
		setupTimeline();
	} else {
		video.addEventListener("loadedmetadata", setupTimeline, {
			once: true,
		});
	}
}

export { loadVideo };
