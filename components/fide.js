
const ENDPOINT = 'https://ratings.fide.com/profile/';

const NAME = /profile-top-title">\s*(.*?)\s*</;
const STD = /std\s*<\/span>\s*(\d{3,4})/;
const BLITZ = /blitz\s*<\/span>\s*(\d{3,4})/;
const RAPID = /rapid\s*<\/span>\s*(\d{3,4})/;
const TITLE = /profile-top-title">\s*(.*?)\s*</;

export async function getFIDERatings(id) {
	const url = `${ENDPOINT}${id}`;
	let html = null;
	try { html = await fetch(url); }
	catch { return null; }
	if (html.status != 200) return null;
	html = await html.text();
	let ratings = [];
	if (STD.test(html)) ratings.push({
		category: 'standard', rating: STD.exec(html)[1]
	});
	if (BLITZ.test(html)) ratings.push({
		category: 'blitz', rating: BLITZ.exec(html)[1]
	});
	if (RAPID.test(html)) ratings.push({
		category: 'rapid', rating: RAPID.exec(html)[1]
	});
	return ratings;
}

export async function getFIDEName(id) {
	const url = `${ENDPOINT}${id}`;
	let html = null;
	try { html = await fetch(url); }
	catch { return null; }
	if (html.status != 200) return null;
	html = await html.text();
	if (NAME.test(html)) return NAME.exec(html)[1];
	else return id;
}
