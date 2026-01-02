import type { ImageItem } from '~/global';

export interface ProductImagesProps {
  images: ImageItem[];
  alt: string;
  classNames?: Partial<{
    container?: string;
    image?: string;
  }>;
}
