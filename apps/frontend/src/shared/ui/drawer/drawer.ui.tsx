import clsx from 'clsx';
import React from 'react';

import { useClickAway } from '~/shared/hooks/use-click-away';

import { Icon } from '../icon/icon.ui';
import type { DrawerProps } from './drawer.types';
import s from './styles.module.scss';

export const Drawer: React.FC<DrawerProps> = React.memo(
  ({ onClose, children, overlay = true, header, className }) => {
    React.useEffect(() => {
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);

    const containerRef = useClickAway<HTMLDivElement>(onClose);

    return (
      <>
        <div
          data-drawer
          className={clsx(s.drawer, overlay && s.overlay, className)}
        >
          <div data-drawer-body className={s.body} ref={containerRef}>
            <div id="header" data-drawer-header className={s.header}>
              {header || <div></div>}
              <button
                data-drawer-close
                className={s.closeButton}
                onClick={onClose}
              >
                <Icon name="lucide:x" c_size={20} />
              </button>
            </div>
            {children}
          </div>
        </div>
      </>
    );
  }
);

Drawer.displayName = 'Drawer';
