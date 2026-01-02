import clsx from 'clsx';
import React from 'react';

import type { PaginationProps } from './pagination.types';
import s from './styles.module.scss';
import { Icon } from '~/shared/ui/icon/icon.ui'

export const Pagination: React.FC<PaginationProps> = React.memo(
  ({
    HandleNext,
    HandlePrev,
    ToPage,
    disabled,
    page,
    pageNumbers,
    className,
  }) => {
    return (
      <div className={clsx(s.pagination, className)}>
        <button
          className={`${s.navButton} ${disabled.prev ? s.disabled : ''}`}
          onClick={() => !disabled.prev && HandlePrev()}
          disabled={disabled.prev}
        >
          <Icon name="lucide:chevron-left" />
          Предыдущий
        </button>

        {pageNumbers.map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <span key={`ellipsis-${index}`} className={s.ellipsis}>
                ...
              </span>
            );
          }

          return (
            <button
              key={`page-${pageNum}`}
              className={`${s.pageItem} ${page === pageNum ? s.active : ''}`}
              onClick={() => ToPage(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          className={`${s.navButton} ${disabled.next ? s.disabled : ''}`}
          onClick={() => !disabled.next && HandleNext()}
          disabled={disabled.next}
        >
          Следующий
          <Icon name="lucide:chevron-right" />
        </button>
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';
