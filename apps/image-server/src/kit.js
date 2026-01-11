import { LRUCache } from 'lru-cache';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import sharp from 'sharp';

export class ImageKit {
	constructor(mediaDir, cacheDir, cacheOptions) {
		this.mediaDir = mediaDir;
		this.cacheDir = cacheDir;
		this.cache = new LRUCache(cacheOptions);
		this.cleanupInterval = null;

		this.startAutoCleanup();
	}

	generateCacheKey(imagePath, params) {
		const paramsString = JSON.stringify(params);
		return createHash('md5')
			.update(`${imagePath}:${paramsString}`)
			.digest('hex');
	}

	async ensureDirectoryExists(dirPath) {
		try {
			await fs.mkdir(dirPath, { recursive: true });
		} catch (error) {
			if (error.code !== 'EEXIST') {
				throw error;
			}
		}
	}

	async getCacheDirectorySize() {
		try {
			const files = await fs.readdir(this.cacheDir);
			let totalSize = 0;

			for (const file of files) {
				const filePath = path.join(this.cacheDir, file);
				const stats = await fs.stat(filePath);
				totalSize += stats.size;
			}

			return totalSize;
		} catch (error) {
			if (error.code === 'ENOENT') return 0;
			throw error;
		}
	}

	async cleanupCache(maxAgeHours = 24) {
		try {
			const now = Date.now();
			const maxAgeMs = maxAgeHours * 60 * 60 * 1000;

			const files = await fs.readdir(this.cacheDir);
			const filesWithStats = await Promise.all(
				files.map(async file => {
					const filePath = path.join(this.cacheDir, file);
					const stats = await fs.stat(filePath);
					return { file, filePath, stats };
				})
			);

			for (const { filePath, stats } of filesWithStats) {
				if (now - stats.atimeMs > maxAgeMs) {
					try {
						await fs.unlink(filePath);
					} catch (error) {
						console.error(`Failed to delete cache file ${filePath}:`, error);
					}
				}
			}
		} catch (error) {
			console.error('Error during cache cleanup by age:', error);
		}
	}

	startAutoCleanup() {
		this.cleanupInterval = setInterval(async () => {
			try {
				await this.cleanupCache();
			} catch (error) {
				console.error('Error during auto cleanup:', error);
			}
		}, 5 * 60 * 60 * 1000); // 5h

		process.on('exit', () => {
			if (this.cleanupInterval) {
				clearInterval(this.cleanupInterval);
			}
		});
	}

	async findImageOnDisk(imagePath, params) {
		const cacheKey = this.generateCacheKey(imagePath, params);
		const cacheFilePath = path.join(this.cacheDir, `${cacheKey}.webp`);

		try {
			const data = await fs.readFile(cacheFilePath);
			return data;
		} catch (error) {
			if (error.code === 'ENOENT') return null;
			throw error;
		}
	}

	async saveImageToDisk(imagePath, params, imageData) {
		const cacheKey = this.generateCacheKey(imagePath, params);
		const cacheFilePath = path.join(this.cacheDir, `${cacheKey}.webp`);

		await this.ensureDirectoryExists(this.cacheDir);
		try {
			await fs.writeFile(cacheFilePath, imageData);
		} catch (error) {
			console.error('Failed to save image to cache:', error);
		}
	}

	async findOriginalImage(imagePath) {
		const fullPath = path.join(this.mediaDir, imagePath);

		try {
			const data = await fs.readFile(fullPath);
			return data;
		} catch (error) {
			if (error.code === 'ENOENT') return null;
			throw error;
		}
	}

	async resizeImage(imageData, params) {
		let transformer = sharp(imageData).webp();

		if (params.w) transformer = transformer.resize({ width: params.w });
		if (params.h) transformer = transformer.resize({ height: params.h });
		if (params.q) transformer = transformer.webp({ quality: params.q });

		return await transformer.toBuffer();
	}

	async getImageStream(imagePath, params) {
		const cacheKey = this.generateCacheKey(imagePath, params);
		let cacheHit = false;
		let filePath = null;

		// 1. LRU кэш
		const cachedImage = this.cache.get(cacheKey);
		if (cachedImage) {
			cacheHit = true;
			const stream = new Readable();
			stream.push(cachedImage);
			stream.push(null);
			filePath = path.join(this.cacheDir, `${cacheKey}.webp`);
			return { imageStream: stream, cacheHit, filePath };
		}

		// 2. Диск
		const diskImage = await this.findImageOnDisk(imagePath, params);
		if (diskImage) {
			cacheHit = true;
			this.cache.set(cacheKey, diskImage);
			const stream = new Readable();
			stream.push(diskImage);
			stream.push(null);
			filePath = path.join(this.cacheDir, `${cacheKey}.webp`);
			return { imageStream: stream, cacheHit, filePath };
		}

		// 3. Оригинал
		const originalImage = await this.findOriginalImage(imagePath);
		if (!originalImage) throw new Error('Image not found');

		// 4. Ресайз
		let transformer = sharp(originalImage).webp({});
		if (params.w) transformer = transformer.resize({ width: params.w });
		if (params.h) transformer = transformer.resize({ height: params.h });
		if (params.q) transformer = transformer.webp({ quality: params.q });

		const resizedImage = await transformer.toBuffer();

		// 5. Сохраняем и кэшируем
		filePath = path.join(this.cacheDir, `${cacheKey}.webp`);
		await this.saveImageToDisk(imagePath, params, resizedImage);
		this.cache.set(cacheKey, resizedImage);

		const stream = new Readable();
		stream.push(resizedImage);
		stream.push(null);
		return { imageStream: stream, cacheHit, filePath };
	}

	async getImage(imagePath, params) {
		const stream = await this.getImageStream(imagePath, params);
		return new Promise((resolve, reject) => {
			const chunks = [];
			stream.on('data', chunk => chunks.push(chunk));
			stream.on('end', () => resolve(Buffer.concat(chunks)));
			stream.on('error', reject);
		});
	}
}
