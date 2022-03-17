let load = [];

window.addEventListener('load', () => WebsiteBuilder.utils.each(load, next => next()));

WebsiteBuilder.mounted = next => load.push(next);