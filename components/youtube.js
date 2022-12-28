
export const composeURL = id => `https://www.youtube.com/watch?v=${id}`;
export const composeSHARE = id => `youtu.be/${id}`;

/// https://developers.google.com/youtube/v3/docs/search/list
/// https://developers.google.com/youtube/v3/docs/search#resource

export async function getLatestVideos(key, channel, date) {
	const url = `https://www.googleapis.com/youtube/v3/search?key=${key}` + 
		`&channelId=${channel}&part=snippet,id&order=date&maxResults=50&` +
		`publishedAfter=${date}&type=video`;
	try {
		const response = await fetch(url);
		if (response.status != 200) return null;
		return await response.json();
	} catch { return null; }
}

export async function getVideosAfterDate(key, channel, date) {
	const videos = await getLatestVideos(key, channel, date);
	if (videos == null || videos.items == undefined) return [];
	return videos.items.filter(
		// filter out live streams, broadcasts, premiers and shorts
		v => v.snippet.description != '' && v.snippet.liveBroadcastContent == 'none'
	);
}
