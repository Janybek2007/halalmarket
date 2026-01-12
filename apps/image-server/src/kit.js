import { LRUCache } from 'lru-cache';
import { createHash } from 'node:crypto';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';
import sharp from 'sharp';
import PQueue from 'p-queue';

export class ImageKit {
	constructor(mediaDir, cacheDir, options) {
		this.mediaDir = mediaDir;
		this.cacheDir = cacheDir;

		// Level 1: Memory LRU
		this.cache = new LRUCache({
			maxSize: options.max || 500 * 1024 * 1024, // default 500MB
			ttl: options.ttl || 1000 * 60 * 60, // 1h
			sizeCalculation: value => (Buffer.isBuffer(value) ? value.length : 1)
		});

		// Queue для параллельного ресайза
		this.queue = new PQueue({ concurrency: options.concurrency || 2 });

		this.cleanupInterval = null;
		this.startAutoCleanup();
	}

	// Генерация hash ключа
	generateCacheKey(imagePath, params) {
		return createHash('md5')
			.update(`${imagePath}:${JSON.stringify(params)}`)
			.digest('hex');
	}

	// Файловый путь для кеша
	getCacheFilePath(cacheKey) {
		const sub1 = cacheKey.slice(0, 2);
		const sub2 = cacheKey.slice(2, 4);
		return path.join(this.cacheDir, sub1, sub2, `${cacheKey}.webp`);
	}

	async ensureDirectoryExists(dir) {
		await fsp.mkdir(dir, { recursive: true });
	}

	async getFileStats(filePath) {
		try {
			return await fsp.stat(filePath);
		} catch (err) {
			return { size: 0, mtime: new Date() };
		}
	}

	async cleanupCache(maxAgeHours = 24) {
		const now = Date.now();
		const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
		const walk = async dir => {
			const entries = await fsp.readdir(dir, { withFileTypes: true });
			for (const entry of entries) {
				const fullPath = path.join(dir, entry.name);
				if (entry.isDirectory()) await walk(fullPath);
				else {
					const stats = await fsp.stat(fullPath);
					if (now - stats.atimeMs > maxAgeMs) await fsp.unlink(fullPath);
				}
			}
		};
		if (fs.existsSync(this.cacheDir)) await walk(this.cacheDir);
	}

	startAutoCleanup() {
		this.cleanupInterval = setInterval(
			() => this.cleanupCache(),
			5 * 60 * 60 * 1000
		);
		process.on('exit', () => clearInterval(this.cleanupInterval));
	}

	async findOriginalImage(imagePath) {
		const fullPath = path.join(this.mediaDir, imagePath);
		try {
			return await fsp.readFile(fullPath);
		} catch (err) {
			return null;
		}
	}

	async resizeImage(imageData, params) {
		return this.queue.add(async () => {
			let transformer = sharp(imageData);
			if (params.w || params.h)
				transformer = transformer.resize({
					width: params.w,
					height: params.h,
					fit: 'inside',
					withoutEnlargement: true
				});
			transformer = transformer.webp({ quality: params.q || 85 });
			return transformer.toBuffer();
		});
	}

	async saveImageToDisk(imagePath, params, buffer) {
		const key = this.generateCacheKey(imagePath, params);
		const filePath = this.getCacheFilePath(key);
		await this.ensureDirectoryExists(path.dirname(filePath));
		if (!fs.existsSync(filePath)) await fsp.writeFile(filePath, buffer);
		return filePath;
	}

	/**
	 * Получение imageStream через 3 уровня:
	 * 1. Memory LRU
	 * 2. Disk cache (streaming)
	 * 3. Original + Sharp resize
	 */
	async getImageStream(imagePath, params) {
		const key = this.generateCacheKey(imagePath, params);
		let cacheHit = false;

		// === Level 1: Memory LRU ===
		const cached = this.cache.get(key);
		if (cached) {
			cacheHit = true;
			return {
				imageStream: Readable.from(cached), // small images в memory
				cacheHit,
				filePath: this.getCacheFilePath(key)
			};
		}

		// === Level 2: Disk cache ===
		const diskPath = this.getCacheFilePath(key);
		if (fs.existsSync(diskPath)) {
			cacheHit = true;
			// Загружаем в memory для LRU
			const buffer = await fsp.readFile(diskPath);
			this.cache.set(key, buffer);

			// Streaming напрямую из файла
			const stream = fs.createReadStream(diskPath);
			return { imageStream: stream, cacheHit, filePath: diskPath };
		}

		// === Level 3: Original + Sharp resize ===
		const original = await this.findOriginalImage(imagePath);
		if (!original) throw new Error('Image not found');

		const resized = await this.resizeImage(original, params);

		// Сохраняем на диск и в memory
		const filePath = await this.saveImageToDisk(imagePath, params, resized);
		this.cache.set(key, resized);

		// Для маленьких файлов можно отдавать memory stream
		return { imageStream: Readable.from(resized), cacheHit, filePath };
	}
}
