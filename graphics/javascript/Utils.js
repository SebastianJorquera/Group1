class Utils {
	static gaussianRand(sample=6) {
		let sum = 0;
		for (let i = 0; i < sample; i++) {
			sum += Math.random();
		}
		return sum / sample;
	}

	static lerp(original, target, ratio) {
		if (ratio > 1) {
			return target;
		} else if (ratio < 0) {
			return original;
		}
		let diff = target - original;
		return original + diff * ratio;
	}

	static hexToRgb(colorHex) {
		let red = colorHex >> 16;
		let green = (colorHex >> 8) % (16 ** 2);
		let blue = colorHex % (16 ** 2);
		return [red, green, blue];
	}

	static rgbToHex(colorRgb) {
		let colorHex = 0;
		for (let i = 0; i < colorRgb.length; i++) {
			colorHex = colorHex << 8;
			colorHex += colorRgb[i];
		}
		return colorHex;
	}
}
