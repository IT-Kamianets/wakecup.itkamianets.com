import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const outputDir = path.join(rootDir, 'dist/app/browser');

const staticRoutes = [
	'/',
	'/menu',
	'/about',
	'/favorites',
	'/navigation',
	'/gallery',
	'/discounts',
	'/loyalty',
	'/articles',
	'/quests',
	'/questions',
	'/rules',
	'/reviews',
	'/events',
	'/products',
	'/jobs',
	'/team',
	'/socials',
];

const company = await readJson('src/data/company.json');
const dishes = await readJson('src/data/dishes.json');
const articles = await readJson('src/data/articles.json');
const discounts = await readJson('src/data/discounts.json');
const events = await readJson('src/data/events.json');
const jobs = await readJson('src/data/jobs.json');
const products = await readJson('src/data/products.json');
const profiles = await readJson('src/data/profiles.json');
const quests = await readJson('src/data/quests.json');
const reviews = await readJson('src/data/reviews.json');
const siteUrl = trimTrailingSlash(company.siteUrl || 'https://example.com');
const pageSeo = company.pageSeo ?? {};

const routes = [
	...staticRoutes.filter((route) => isIndexable(route, pageSeo)),
	...toSlugRoutes('/dish', dishes),
	...toSlugRoutes('/article', articles),
	...toSlugRoutes('/discount', discounts),
	...toSlugRoutes('/event', events),
	...toSlugRoutes('/job', jobs),
	...toSlugRoutes('/product', products),
	...toSlugRoutes('/profile', profiles),
	...toSlugRoutes('/quest', quests),
	...toSlugRoutes('/review', reviews),
];
const lastmod = new Date().toISOString().slice(0, 10);

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, 'sitemap.xml'), buildSitemap(routes, siteUrl, lastmod));
await writeFile(path.join(outputDir, 'robots.txt'), buildRobots(siteUrl));

function buildSitemap(routes, siteUrl, lastmod) {
	const urls = routes
		.map(
			(route) => `	<url>
		<loc>${escapeXml(toAbsoluteUrl(siteUrl, route))}</loc>
		<lastmod>${lastmod}</lastmod>
	</url>`,
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRobots(siteUrl) {
	return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

function isIndexable(route, pageSeo) {
	const robots = pageSeo[route]?.robots;

	return typeof robots !== 'string' || !robots.toLowerCase().includes('noindex');
}

function toSlugRoutes(prefix, entries) {
	return Array.isArray(entries)
		? entries
				.map((entry) => entry?.slug)
				.filter((slug) => typeof slug === 'string' && slug.trim().length > 0)
				.map((slug) => `${prefix}/${slug.trim()}`)
		: [];
}

async function readJson(relativePath) {
	return JSON.parse(await readFile(path.join(rootDir, relativePath), 'utf8'));
}

function toAbsoluteUrl(siteUrl, route) {
	return `${siteUrl}${route === '/' ? '' : route}`;
}

function trimTrailingSlash(value) {
	return value.endsWith('/') ? value.slice(0, -1) : value;
}

function escapeXml(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}
