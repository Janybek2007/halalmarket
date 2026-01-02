import clsx from 'clsx';
import React from 'react';


import type { SellerPageHeadProps } from './seller-page-head.types';
import s from './styles.module.scss';
import { Icon } from '~/shared/ui/icon/icon.ui'

export const SellerPageHead: React.FC<SellerPageHeadProps> = React.memo(
  ({ children, title, text, action, endEl, column = false }) => {
    return (
      <div className={'container'}>
        <div className={clsx(s.header, column && s.column)}>
          <div className={s.title}>
            <Icon name="lucide:chevron-right" c_size={24} />
            <h2>{title}</h2>
            {text && <span>{text}</span>}
            {action}
          </div>
          {endEl}
        </div>
        {children}
      </div>
    );
  }
);
SellerPageHead.displayName = '_SellerPageHead_';
