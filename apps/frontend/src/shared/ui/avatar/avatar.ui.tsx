import clsx from 'clsx';

import { ApiMedia } from '~/shared/constants';

import type { AvatarProps } from './avatar.types';
import s from './styles.module.scss';

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  className,
  placeholder,
  width,
  height,
  media,
}) => {
  return (
    <div
      data-nosrc={src ? undefined : true}
      className={clsx(s.avatar, className)}
      style={{ width, height }}
    >
      {src ? (
        <img src={media ? ApiMedia(src) : src} alt={alt} />
      ) : (
        <span className={s.placeholder}>{placeholder?.toUpperCase()}</span>
      )}
    </div>
  );
};
