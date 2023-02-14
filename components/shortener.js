
function query(url) {
	if (typeof url !== 'string') return { };
    const query = { };
    const pairs = (url[0] === '?' ? url.substring(1) : url).split('&');
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

function compose(query) {
	const pairs = [];
	for (const key in query) if (key !== '' && query[key] !== '') pairs.push(
		encodeURIComponent(key) + '=' + encodeURIComponent(query[key])
	);
	return pairs.join('&');
}

function components(url) {
	const match = /(https?:\/\/?(?:www\.)?)([^\/?#\n]+)(\/[^?#\n]*)?\??(.*)/i.exec(url);
	if (match === null) return [ null, null, null, null  ];
	return match;
}

export function shorten(url) {
	let [ _match, _, site, path, queries ] = components(url);
	if (queries !== null && queries !== undefined) queries = query(queries);
	else queries = { };
	if (site === null) return null;
	if (site === 'youtube.com' || site === 'youtu.be') {
		site = path.includes('shorts') ? 'youtube.com' : 'youtu.be';
		if ('v' in queries) path = '/' + queries['v'];
		if ('t' in queries && queries['t'] !== '0s')
			queries = { 't': queries['t'] };
		else queries = { };
	}
	return (site + path + '?' + compose(queries)).replace(/[\/\?]+$/g, '');
}
