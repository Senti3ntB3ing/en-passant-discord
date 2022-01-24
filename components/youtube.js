
export function composeURL(id) { return `https://www.youtube.com/watch?v=${id}`; }

export async function getLatestVideos(key, channel) {
	const url = `https://www.googleapis.com/youtube/v3/search?key=${key}` + 
				`&channelId=${channel}&part=snippet,id&order=date&maxResults=5`;
	try {
		const response = await fetch(url);
		if (response.status != 200) return null;
		return await response.json();
	} catch { return null; }
}

export async function getVideosAfterDate(key, channel, date) {
	let videos = await getLatestVideos(key, channel);
	if (videos == null || videos.items == undefined) return [];
	return videos.items.filter(v => new Date(v.snippet.publishedAt) > new Date(date));
}
