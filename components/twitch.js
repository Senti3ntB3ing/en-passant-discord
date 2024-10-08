
import { Database } from "../database.js";
import { Time, ActionURL } from "../config.js";

// const TWITCH_CLIENT_ID = await Database.get("twitch_client_id");
// changing const to let in an attempt to fix some issues, app id remains constant, oauth bot changes frequently.
const TWITCH_APP_ID = await Database.get("twitch_app_id");
let TWITCH_OAUTH_BOT = await Database.get("twitch_oauth_bot");
let HEADERS = {
	headers: {
		"Authorization": "Bearer " + TWITCH_OAUTH_BOT,
		"Client-Id": TWITCH_APP_ID
	}
};

export async function authGen() {
	let token = await Database.get("twitch_oauth_bot");
	if (token != TWITCH_OAUTH_BOT) {
		TWITCH_OAUTH_BOT = token;
	}
	HEADERS = {
		headers: {
			"Authorization": "Bearer " + TWITCH_OAUTH_BOT,
			"Client-Id": TWITCH_APP_ID
		}
	};
}

export const BASE_URL = "https://api.twitch.tv/helix/";
export const QUERIES = {
	search: { channel: "search/channels?query=" },
	streams: "streams?user_id=",
	schedule: "schedule?broadcaster_id="
};



export let buildUrl = uri => BASE_URL + uri;

export async function channel(streamer) {
	if (streamer === "") return undefined;
	await authGen();
	try {
		const queryUrl = buildUrl(QUERIES.search.channel);
		const res = await fetch(queryUrl + streamer + "&first=1", HEADERS);
		if (res.status != 200) return null;
		const data = (await res.json()).data;
		for (const channel of data)
			if (channel.display_name.toLowerCase() === streamer.toLowerCase())
				return channel;
	} catch (error) {
		console.error(error);
		return undefined;
	}
	return undefined;
}

export async function streams(user_ids) {
	if (user_ids.length === 0) return null;
	let data = null;
	await authGen();
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

export async function schedule(id, date) {
	date = date || new Date().toISOString();
	const url = `${BASE_URL}schedule?broadcaster_id=${id}&start_time=${date}&first=7`;
	await authGen();
	try {
		const req = await fetch(url, HEADERS);
		if (req.status != 200) {
			console.log(req.message);
			return null;
		} 
		const data = (await req.json()).data;
		return data;
	} catch { return null; }
}

export async function uptime(streamer) {
	const c = await channel(streamer);
	if (c === undefined || c === null || !c.is_live ||
		c.started_at === undefined || c.started_at === "") return "0h 0m";
	const s = new Date(c.started_at);
	const e = new Date();
	const d = e.getTime() - s.getTime();
	const h = Math.floor((d % Time.day) / Time.hour);
	const m = Math.floor((d % Time.hour) / Time.minute);
	return `${h}h ${m}m`;
}

export async function follow_count(streamer) {
	const url = `https://twitchtracker.com/api/channels/summary/${streamer}`;
	try {
		const req = await fetch(url);
		if (req.status != 200) return null;
		const data = await req.json();
		return "followers_total" in data ? data.followers_total : null;
	} catch { return null; }
}

export async function validate() {
	try {
		const req = await fetch(ActionURL + '/validate');
		if (req.status != 200) return false;
		await authGen();
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

export async function connect() {
	try {
		const req = await fetch(ActionURL + '/connect');
		if (req.status != 200) return false;
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
