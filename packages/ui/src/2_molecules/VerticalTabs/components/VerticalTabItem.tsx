import { FC } from 'react';

import classNames from 'classnames';

import { VerticalTabsItemProps } from '../VerticalTabs.types';
import styles from './VerticalTabItem.module.css';

export type VerticalTabsItemButtonProps = VerticalTabsItemProps & {
  active: boolean;
  activeIndicatorBgColor: string;
  onClick: () => void;
};

export const VerticalTabItem: FC<VerticalTabsItemButtonProps> = ({
  disabled,
  label,
  infoText,
  active,
  dataActionId,
  onClick,
  activeIndicatorBgColor,
}) => {
  return (
    <button
      className={classNames(styles.button, { [styles.active]: active })}
      disabled={disabled}
      data-action-id={dataActionId}
      onClick={onClick}
    >
      <p className={styles.label}>{label}</p>
      {infoText && <small className={styles.info}>{infoText}</small>}
      {active && (
        <div
          className={classNames(styles.activeButtonIndicator, {
            [styles.withInfoText]: infoText,
          })}
          style={{
            borderColor: `transparent ${activeIndicatorBgColor} transparent transparent`,
          }}
        />
      )}
    </button>
  );
};
