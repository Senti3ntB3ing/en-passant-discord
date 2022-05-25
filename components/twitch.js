
const TWITCH_CLIENT_ID = Deno.env.get("TWITCH_CLIENT_ID");
const TWITCH_AUTH_TOKEN = Deno.env.get("TWITCH_AUTH_TOKEN");

export const BASE_URL = "https://api.twitch.tv/helix/";
export const QUERIES = {
	search: { channel: "search/channels?query=" },
	streams: "streams?user_id=",
	schedule: "schedule?broadcaster_id="
};
const HEADERS = { 
	headers: { 
		"Authorization": "Bearer " + TWITCH_AUTH_TOKEN,
		"Client-Id": TWITCH_CLIENT_ID
	} 
};

export const buildUrl = uri => BASE_URL + uri;

export async function channel(streamer) {
	if (streamer === '') return undefined;
	try {
		const queryUrl = buildUrl(QUERIES.search.channel);
		const req = await fetch(queryUrl + streamer + "&first=10", HEADERS);
		if (req.status != 200) return null;
		const data = (await req.json()).data;
		for (const channel of data)
			if (channel.display_name.toLowerCase() === streamer.toLowerCase())
				return channel;
	} catch { return undefined; }
	return undefined;
}

export async function streams(user_ids) {
	if (user_ids.length === 0) return null;
	let data = null;
	try {
		let queryUrl = buildUrl(QUERIES.streams);
		for (let i = 0; i < user_ids.length; i++)
			if (i === user_ids.length - 1) queryUrl += user_ids[i];
			else queryUrl += `${user_ids[i]}&user_id=`;
		const req = await fetch(queryUrl, HEADERS);
		if (req.status != 200) return null;
		data = (await req.json()).data;
	} catch { return undefined; }
	return data;
}

export async function live(streamer) {
	const c = await channel(streamer);
	if (c == undefined || c == null) return c;
	return c.is_live;
}

export async function schedule(id, date) {
	date = date || new Date().toISOString();
	const url = `${BASE_URL}schedule?broadcaster_id=${id}&start_time=${date}&first=7`;
	try {
		const req = await fetch(url, HEADERS);
		if (req.status != 200) return null;
		const data = (await req.json()).data;
		return data;
	} catch { return null; }
}
