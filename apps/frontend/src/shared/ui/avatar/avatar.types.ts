export interface AvatarProps {
	src?: string | null;
	alt: string;
	placeholder?: string;
	width?: string;
	height?: string;
	className?: string;
	media?: boolean;
	mediaOpts?: { h?: number; w?: number };
}
