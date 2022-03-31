
import { soxa } from "https://deno.land/x/soxa@1.4/mod.ts"

const TWITCH_CLIENT_ID = Deno.env.get("TWITCH_CLIENT_ID");
const TWITCH_SECRET = Deno.env.get("TWITCH_SECRET");
const TWITCH_AUTH_TOKEN = Deno.env.get("TWITCH_AUTH_TOKEN");

export const API_BASE_URL = "https://api.twitch.tv/helix/";
export const QUERIES = {
	search: { channel: "search/channels?query=" },
	streams: "streams?user_id="
};
const HEADERS = { 
	headers: { 
		"Authorization": "Bearer " + TWITCH_AUTH_TOKEN,
		"Client-Id": TWITCH_CLIENT_ID
	} 
};

export const buildUrl = uri => API_BASE_URL + uri;

export async function channel(streamer) {
	if (streamer === "") return undefined;
	try {
		const queryUrl = buildUrl(QUERIES.search.channel);
		const req = await soxa.get(queryUrl + streamer + "&first=100", HEADERS);
		const data = req.data.data;
		for (const channel of data)
			if (channel.display_name.toLowerCase() === streamer.toLowerCase())
				return channel;
	} catch { return undefined; }
	return undefined;
}

export async function streams(user_ids) {
	if (user_ids.length === 0) return [];
	try {
		let queryUrl = buildUrl(QUERIES.streams);
		for (let i = 0; i < user_ids.length; i++)
			if (i === user_ids.length - 1) queryUrl += user_ids[i];
			else queryUrl += `${user_ids[i]}&user_id=`;
		const req = await soxa.get(queryUrl, HEADERS);
		const data = req.data.data;
	} catch { return undefined; }
	return data;
}

export async function live(streamer) {
	const c = await channel(streamer);
	if (c === undefined) return undefined;
	return c.is_live;
}
