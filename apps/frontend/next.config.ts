import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	cleanDistDir: true,
	images: {
		loaderFile: './src/image_loader.ts'
	},
	output: 'standalone',
	compress: true,

	poweredByHeader: false,

	compiler: {
		removeConsole:
			process.env.NODE_ENV === 'production'
				? {
						exclude: ['error', 'warn']
					}
				: false
	}
};

export default nextConfig;
