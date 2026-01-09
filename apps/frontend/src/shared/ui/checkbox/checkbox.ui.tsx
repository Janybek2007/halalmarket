import clsx from 'clsx';
import React from 'react';

import { Icon } from '../icon/icon.ui';
import type { CheckboxProps } from './checkbox.types';
import styles from './styles.module.scss';

export const Checkbox: React.FC<CheckboxProps> = React.memo(
  ({ checked, onChecked, className, color = 'default', }) => {
    return (
      <div
        className={clsx(styles.checkboxWrapper, className, styles[color])}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChecked?.(!checked)}
        onKeyDown={e => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChecked?.(!checked);
          }
        }}
      >
        <div
          className={clsx(styles.checkbox, {
            [styles.checked]: checked,
          })}
        >
          {checked && (
            <Icon
              name="material-symbols:check-rounded"
              className={styles.checkboxIcon}
            />
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
