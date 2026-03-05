import { readable } from "svelte/store";

const getRawOrientation = (e?: DeviceOrientationEvent | null) => {
	if (!e) {
		return { alpha: 0, beta: 0, gamma: 0 };
	} else {
		return { alpha: e.alpha ?? 0, beta: e.beta ?? 0, gamma: e.gamma ?? 0 };
	}
};

const getOrientationObject = (e?: DeviceOrientationEvent | null) => {
	const orientation = getRawOrientation(e);
	return {
		absolute: orientation,
		relative: {
			alpha: orientation.alpha - baseOrientation.alpha,
			beta: orientation.beta - baseOrientation.beta,
			gamma: orientation.gamma - baseOrientation.gamma,
		},
	};
};

let firstReading = true;
let baseOrientation = getRawOrientation();

export const resetBaseOrientation = () => {
	firstReading = true;
	baseOrientation = getRawOrientation();
};

export const orientation = readable(
	getOrientationObject(),
	function start(set) {
		// https://developer.mozilla.org/en-US/docs/Web/API/Window/ondeviceorientation
		const handleOrientation = (e: DeviceOrientationEvent) => {
			if (firstReading) {
				firstReading = false;
				baseOrientation = getRawOrientation(e);
			}

			const o = getOrientationObject(e);
			set(o);
		};

		window.addEventListener("deviceorientation", handleOrientation, true);

		return function stop() {
			window.removeEventListener("deviceorientation", handleOrientation, true);
		};
	},
);
