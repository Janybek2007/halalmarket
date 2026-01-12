import 'dotenv/config';
import { createServer } from 'node:http';
import { ImageKit } from './kit.js';

const PORT = process.env.PORT || 3030;
const MEDIA_DIR = process.env.MEDIA_DIR || './media';
const CACHE_DIR = process.env.CACHE_DIR || './cache';

const imageKit = new ImageKit(MEDIA_DIR, CACHE_DIR, {
	max: 500 * 1024 * 1024, // 500MB LRU
	ttl: 1000 * 60 * 60, // 1 час
	concurrency: 2
});

let cacheHits = 0;
let cacheMisses = 0;

const server = createServer(async (req, res) => {
	try {
		if (!req.url) {
			res.writeHead(400, { 'Content-Type': 'text/plain' });
			return res.end('Bad Request');
		}

		const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
		const pathname = parsedUrl.pathname;

		// Health check
		if (pathname === '/health') {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			return res.end(
				JSON.stringify({
					status: 'healthy',
					timestamp: new Date().toISOString(),
					cache_hits: cacheHits,
					cache_misses: cacheMisses
				})
			);
		}

		// Serve images
		if (pathname && pathname.startsWith('/media/')) {
			const imagePath = decodeURIComponent(pathname.slice('/media/'.length));
			const queryParams = parsedUrl.searchParams;

			const width = queryParams.has('w')
				? Math.min(Math.max(parseInt(queryParams.get('w')), 1), 4096)
				: undefined;

			const height = queryParams.has('h')
				? Math.min(Math.max(parseInt(queryParams.get('h')), 1), 4096)
				: undefined;

			const quality = queryParams.has('q')
				? Math.min(Math.max(parseInt(queryParams.get('q')), 10), 100)
				: 85;

			const params = { w: width, h: height, q: quality };

			try {
				const { imageStream, cacheHit, filePath } =
					await imageKit.getImageStream(imagePath, params);

				if (cacheHit) cacheHits++;
				else cacheMisses++;

				const { size, mtime } = await imageKit.getFileStats(filePath);
				const lastModified = mtime.toUTCString();
				const etag = `"${size}-${mtime.getTime()}"`;

				const expires = new Date();
				expires.setFullYear(expires.getFullYear() + 1);

				const headers = {
					'Content-Type': 'image/webp',
					'Cache-Control': 'public, max-age=31536000, immutable',
					Expires: expires.toUTCString(),
					'Last-Modified': lastModified,
					ETag: etag,
					Vary: 'Accept-Encoding',
					'X-Cache': cacheHit ? 'HIT' : 'MISS',
					'X-Cache-Hit': cacheHit ? 'true' : 'false',
					'X-Image-Optimized': 'true',
					'X-Content-Type-Options': 'nosniff',
					'X-Frame-Options': 'DENY',
					'X-XSS-Protection': '1; mode=block'
				};

				res.writeHead(200, headers);
				imageStream.pipe(res);
			} catch (err) {
				if (err.message === 'Image not found') {
					res.writeHead(404, { 'Content-Type': 'text/plain' });
					res.end('Image not found');
				} else {
					console.error('Error processing image:', err);
					res.writeHead(500, { 'Content-Type': 'text/plain' });
					res.end('Internal Server Error');
				}
			}
			return;
		}

		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('Not Found');
	} catch (err) {
		console.error('Server error:', err);
		res.writeHead(500, { 'Content-Type': 'text/plain' });
		res.end('Internal Server Error');
	}
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));

server.listen(PORT, () => {
	console.log(`Image server running on port ${PORT}`);
	console.log(`Media directory: ${MEDIA_DIR}`);
	console.log(`Cache directory: ${CACHE_DIR}`);
});
