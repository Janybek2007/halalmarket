import 'dotenv/config';
import { statSync } from 'node:fs';
import { createServer } from 'node:http';
import * as url from 'node:url';
import { ImageKit } from './kit.js';

const PORT = process.env.PORT || 3030;
const MEDIA_DIR = process.env.MEDIA_DIR || './media';
const CACHE_DIR = process.env.CACHE_DIR || './cache';

const imageKit = new ImageKit(MEDIA_DIR, CACHE_DIR, {
	max: 4096,
	ttl: 1000 * 60 * 30 // 30 min
});

let cacheHits = 0;
let cacheMisses = 0;

const server = createServer(async (req, res) => {
	try {
		if (!req.url) {
			res.writeHead(400, {
				'Content-Type': 'text/plain',
				'X-Content-Type-Options': 'nosniff',
				'X-Frame-Options': 'DENY',
				'X-XSS-Protection': '1; mode=block'
			});
			res.end('Bad Request');
			return;
		}

		const parsedUrl = url.parse(req.url, true);
		const pathname = parsedUrl.pathname;

		if (pathname === '/health') {
			res.writeHead(200, {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache, no-store',
				'X-Content-Type-Options': 'nosniff',
				'X-Frame-Options': 'DENY',
				'X-XSS-Protection': '1; mode=block'
			});
			res.end(
				JSON.stringify({
					status: 'healthy',
					timestamp: new Date().toISOString(),
					cache_hits: cacheHits,
					cache_misses: cacheMisses
				})
			);
			return;
		}

		if (pathname && pathname.startsWith('/media/')) {
			const imagePath = decodeURIComponent(pathname.slice('/media/'.length));
			const queryParams = parsedUrl.query;

			const width = queryParams.w
				? Math.min(Math.max(parseInt(queryParams.w), 1), 4096)
				: undefined;
			const height = queryParams.h
				? Math.min(Math.max(parseInt(queryParams.h), 1), 4096)
				: undefined;
			const quality = queryParams.q
				? Math.min(Math.max(parseInt(queryParams.q), 10), 100)
				: 85;

			const params = {
				w: width,
				h: height,
				q: quality
			};

			try {
				const { imageStream, cacheHit, filePath } =
					await imageKit.getImageStream(imagePath, params);

				if (cacheHit) {
					cacheHits++;
				} else {
					cacheMisses++;
				}

				let lastModified = new Date().toUTCString();
				let etag = `"${Date.now()}"`;

				try {
					const fileStats = statSync(filePath);
					lastModified = fileStats.mtime.toUTCString();
					etag = `"${fileStats.size}-${fileStats.mtime.getTime()}"`;
				} catch (error) {
					if (error.code !== 'ENOENT') {
						console.warn('Error getting file stats:', error);
					}
				}


				const expiresDate = new Date();
				expiresDate.setFullYear(expiresDate.getFullYear() + 1);

				const headers = {
					'Content-Type': 'image/webp',
					'Cache-Control': 'public, max-age=31536000, immutable',
					Expires: expiresDate.toUTCString(),
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
			} catch (error) {
				if (error instanceof Error && error.message === 'Image not found') {
					res.writeHead(404, {
						'Content-Type': 'text/plain',
						'X-Content-Type-Options': 'nosniff',
						'X-Frame-Options': 'DENY',
						'X-XSS-Protection': '1; mode=block'
					});
					res.end('Image not found');
				} else {
					console.error('Error processing image:', error);
					res.writeHead(500, {
						'Content-Type': 'text/plain',
						'X-Content-Type-Options': 'nosniff',
						'X-Frame-Options': 'DENY',
						'X-XSS-Protection': '1; mode=block'
					});
					res.end('Internal Server Error');
				}
			}
			return;
		}

		if (pathname === '/') {
			res.writeHead(200, {
				'Content-Type': 'text/plain',
				'X-Content-Type-Options': 'nosniff',
				'X-Frame-Options': 'DENY',
				'X-XSS-Protection': '1; mode=block'
			});
			res.end('Image Server is running');
			return;
		}

		res.writeHead(404, {
			'Content-Type': 'text/plain',
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'DENY',
			'X-XSS-Protection': '1; mode=block'
		});
		res.end('Not Found');
	} catch (error) {
		console.error('Server error:', error);
		res.writeHead(500, {
			'Content-Type': 'text/plain',
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'DENY',
			'X-XSS-Protection': '1; mode=block'
		});
		res.end('Internal Server Error');
	}
});

process.on('SIGTERM', () => {
	console.log('SIGTERM received. Shutting down gracefully...');
	server.close(() => {
		console.log('Server closed');
		process.exit(0);
	});
});

process.on('SIGINT', () => {
	console.log('SIGINT received. Shutting down gracefully...');
	server.close(() => {
		console.log('Server closed');
		process.exit(0);
	});
});

server.listen(PORT, () => {
	console.log(`Image server running on port ${PORT}`);
	console.log(`Media directory: ${MEDIA_DIR}`);
	console.log(`Cache directory: ${CACHE_DIR}`);
});
