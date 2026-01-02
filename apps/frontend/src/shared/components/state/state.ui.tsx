import React from 'react';

import type { StateProps } from './state.types';
import s from './styles.module.scss';
import { Icon } from '~/shared/ui/icon/icon.ui'

export const State: React.FC<StateProps> = React.memo(
  ({ icon, title, text }) => {
    return (
      <div className={`container ${s.container}`}>
        {icon && <Icon className={s.icon} name={icon} c_size={48} />}
        <div className={s.content}>
          <h2>{title}</h2>
          {text && <p>{text}</p>}
        </div>
      </div>
    );
  }
);

State.displayName = 'State';
