import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	cleanDistDir: true,
	images: {
		loaderFile: './src/image_loader.ts'
	},
	output: 'standalone'
};

export default nextConfig;
