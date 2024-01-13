import { json } from '@sveltejs/kit';
import { generateOpenApiDocument } from 'trpc-openapi';

import { PUBLIC_BASE_URL } from '$env/static/public';
import { app } from '$lib/server/routes';

import type { RequestHandler } from './$types';

const openApiDocument = generateOpenApiDocument(app, {
	title: 'a slice of API',
	version: '1.0.0',
	baseUrl: PUBLIC_BASE_URL,
	// @ts-expect-error - defined in Redoc spec
	'x-logo': {
		url: '/favicon.svg',
		altText: 'a slice of pi Logo',
	},
	license: {
		name: 'MIT',
		url: 'https://github.com/matteopolak/a-slice-of-pi/blob/main/LICENSE',
	},
});

openApiDocument.tags = [
	{
		name: 'agg',
		description: 'Aggregation-related endpoints',
		// @ts-expect-error - defined in Redoc spec
		'x-displayName': 'Aggregation',
	},
]

export const GET: RequestHandler = () => {
	return json(openApiDocument);
};
