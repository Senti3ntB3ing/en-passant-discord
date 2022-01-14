
export const closest = (s, a) => {
	let b = null;
	let d = Infinity;
	for (let i = 0; i < a.length; i++) {
		const l = levenshtein(s, a[i]);
		if (l < d) { b = i; d = l; }
	}
	return a[b];
};

export const levenshtein = (a, b) => {
	const track = Array(b.length + 1).fill(null).map(
		_ => Array(a.length + 1).fill(null)
	);
	for (let i = 0; i <= a.length; i++) track[0][i] = i;
	for (let j = 0; j <= b.length; j++) track[j][0] = j;
	for (let j = 1; j <= b.length; j += 1) {
		for (let i = 1; i <= a.length; i += 1) {
			const k = a[i - 1] === b[j - 1] ? 0 : 1;
			track[j][i] = Math.min(
				track[j][i - 1] + 1,     // deletion
				track[j - 1][i] + 1,     // insertion
				track[j - 1][i - 1] + k, // substitution
			);
		}
	}
	return track[b.length][a.length];
};
