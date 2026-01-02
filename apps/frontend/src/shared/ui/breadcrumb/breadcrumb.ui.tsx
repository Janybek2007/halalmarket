import React from 'react';

import type { BreadcrumbProps } from './breadcrumb.types';
import s from './styles.module.scss';
import Link from 'next/link'

export const Breadcrumb: React.FC<BreadcrumbProps> = React.memo(
  ({ items, className = '' }) => {
    return (
      <nav className={`${s.breadcrumb} ${className}`} aria-label="breadcrumb">
        <ol className={s.list}>
          {items.map(item => (
            <li
              key={item.label + item.path}
              className={`${s.item} ${item.isActive ? s.active : ''}`}
              aria-current={item.isActive ? 'page' : undefined}
            >
              {item.isActive ? (
                <span className={s.current}>{item.label}</span>
              ) : (
                <Link href={item.path} className={s.link}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
