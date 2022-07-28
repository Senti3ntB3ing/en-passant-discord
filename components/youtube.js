
export const composeURL = id => `https://www.youtube.com/watch?v=${id}`;
export const composeSHARE = id => `youtu.be/${id}`;

export async function getLatestVideos(key, channel) {
	const url = `https://www.googleapis.com/youtube/v3/search?key=${key}` + 
		`&channelId=${channel}&part=snippet,id,title&order=date&maxResults=10`;
	try {
		const response = await fetch(url);
		if (response.status != 200) return null;
		return await response.json();
	} catch { return null; }
}

export async function getVideosAfterDate(key, channel, date) {
	const videos = await getLatestVideos(key, channel);
	if (videos == null || videos.items == undefined) return [];
	if (typeof date == 'string') date = new Date(date);
	return videos.items.filter(
		v => new Date(v.snippet.publishedAt).getTime() > date.getTime() &&
			 v.snippet.description != ''
	);
}
