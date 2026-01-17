import fs from 'fs';
import fsp from 'fs/promises';
import { createHash } from 'node:crypto';
import PQueue from 'p-queue';
import path from 'path';
import sharp from 'sharp';
import { Readable } from 'stream';

export class ImageKit {
	constructor(mediaDir, cacheDir, options) {
		this.mediaDir = mediaDir;
		this.cacheDir = cacheDir;

		// Queue для параллельного ресайза
		this.queue = new PQueue({ concurrency: options.concurrency || 2 });

		this.cleanupInterval = null;
		this.maxCacheAgeDays = options.maxCacheAgeDays || 30; // 30days
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

	async cleanupCache() {
		const now = Date.now();
		const maxAgeMs = this.maxCacheAgeDays * 24 * 60 * 60 * 1000; // days to ms
		const walk = async dir => {
			const entries = await fsp.readdir(dir, { withFileTypes: true });
			for (const entry of entries) {
				const fullPath = path.join(dir, entry.name);
				if (entry.isDirectory()) await walk(fullPath);
				else {
					const stats = await fsp.stat(fullPath);
					if (now - stats.mtimeMs > maxAgeMs) await fsp.unlink(fullPath);
				}
			}
		};
		if (fs.existsSync(this.cacheDir)) await walk(this.cacheDir);
	}

	startAutoCleanup() {
		// Run cleanup every 24 hours
		this.cleanupInterval = setInterval(
			() => this.cleanupCache(),
			24 * 60 * 60 * 1000
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
	 * Получение imageStream через 2 уровня:
	 * 1. Disk cache (streaming)
	 * 2. Original + Sharp resize
	 */
	async getImageStream(imagePath, params) {
		const key = this.generateCacheKey(imagePath, params);
		let cacheHit = false;

		// === Level 1: Disk cache ===
		const diskPath = this.getCacheFilePath(key);
		if (fs.existsSync(diskPath)) {
			cacheHit = true;
			// Streaming напрямую из файла
			const stream = fs.createReadStream(diskPath);
			return { imageStream: stream, cacheHit, filePath: diskPath };
		}

		// === Level 2: Original + Sharp resize ===
		const original = await this.findOriginalImage(imagePath);
		if (!original) throw new Error('Image not found');

		const resized = await this.resizeImage(original, params);

		// Сохраняем на диск
		const filePath = await this.saveImageToDisk(imagePath, params, resized);

		// Отдаём stream из файла
		const stream = fs.createReadStream(filePath);
		return { imageStream: stream, cacheHit, filePath };
	}
}
