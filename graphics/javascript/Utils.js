class Utils {
	gaussianRand(sample=6) {
		let sum = 0;
		for (let i = 0; i < sample; i++) {
			sum += Math.random();
		}
		return sum / sample;
	}
}
