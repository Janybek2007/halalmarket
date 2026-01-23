import { Inter, Open_Sans, Roboto } from 'next/font/google';
import { API_URL } from '~/shared/constants';
import { $Meta } from '~/shared/libs/seo';
import { LayoutClient } from './layout.client';
import './styles';

const inter = Inter({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
	preload: true
});

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
	display: 'swap',
	preload: true
});

const openSans = Open_Sans({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700', '800'],
	display: 'swap',
	preload: true
});

export const metadata = $Meta({});

export default function RootLayout({ children }: React.PropsWithChildren) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link
					rel='preconnect'
					href='https://fonts.gstatic.com'
					crossOrigin='anonymous'
				/>
				<link rel='preconnect' href={API_URL} />
				<link rel='dns-prefetch' href={API_URL} />
			</head>
			<body
				className={`${inter.className} ${roboto.className} ${openSans.className}}`}
			>
				<div className='wrapper'>
					<LayoutClient>{children}</LayoutClient>
				</div>
			</body>
		</html>
	);
}
