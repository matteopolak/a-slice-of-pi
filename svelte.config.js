import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({})],
	kit: {
		adapter: adapter({
			precompress: true,
			cachePolicy: {
				maxAge: 60 * 60 * 24 * 365,
				staleWhileRevalidate: 60 * 60 * 24,
				immutablyCacheBusted: true,
			},
			compress: true,
		}),
	},
};

export default config;
