import React, { FC, RefObject } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { SimpleTable, SimpleTableRow } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import styles from './PointsSection.module.css';

const baseTranslation = translations.leaderboardPage.pointsSection;
const tablesTranslation = translations.leaderboardPage.pointsSection.tables;

type PointsSectionProps = {
  pointsSectionRef: RefObject<HTMLDivElement>;
};

export const PointsSection: FC<PointsSectionProps> = ({ pointsSectionRef }) => (
  <>
    <div
      ref={pointsSectionRef}
      className="w-full md:w-[26rem] text-center mb-8"
    >
      <div className="text-2xl font-medium mt-9">
        {t(baseTranslation.title)}
      </div>
      <div className="text-sm font-semibold mt-4">
        {t(baseTranslation.description)}
      </div>
    </div>

    <div className="w-full grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:gap-6 gap-4 mb-8 md:mb-16">
      <SimpleTable>
        <div className="text-gray-30 text-sm font-medium mb-3">
          {t(tablesTranslation.trading.title)}
        </div>
        <SimpleTableRow
          className={classNames(styles.tableRow, 'mb-2.5')}
          label={t(tablesTranslation.trading.item1)}
          value={10}
        />
        <SimpleTableRow
          className={classNames(styles.tableRow, 'mb-2.5')}
          label={t(tablesTranslation.trading.item2)}
          value={1}
        />
        <SimpleTableRow
          className={classNames(styles.tableRow, 'mb-2.5')}
          label={t(tablesTranslation.trading.item3)}
          value={25}
        />
        <SimpleTableRow
          className={classNames(styles.tableRow, 'mb-2.5')}
          label={t(tablesTranslation.trading.item4)}
          value="+10%"
        />
        <SimpleTableRow
          className={styles.tableRow}
          label={t(tablesTranslation.trading.item5)}
          value="+10%"
        />
      </SimpleTable>

      <SimpleTable>
        <div className="text-gray-30 text-sm font-medium mb-3">
          {t(tablesTranslation.staking.title)}
        </div>
        <SimpleTableRow
          className={classNames(styles.tableRow, 'mb-2.5')}
          label={t(tablesTranslation.staking.item1)}
          value={10}
        />
        <SimpleTableRow
          className={classNames(styles.tableRow, 'mb-2.5')}
          label={t(tablesTranslation.staking.item2)}
          value={1}
        />
        <SimpleTableRow
          className={classNames(styles.tableRow, 'mb-2.5')}
          label={t(tablesTranslation.staking.item3)}
          value="+10%"
        />
        <SimpleTableRow
          className={styles.tableRow}
          label={t(tablesTranslation.staking.item4)}
          value="+10%"
        />
      </SimpleTable>

      <SimpleTable>
        <div className="text-gray-30 text-sm font-medium mb-3">
          {t(tablesTranslation.social.title)}
        </div>
        <SimpleTableRow
          className={classNames(styles.tableRow, 'mb-2.5')}
          label={t(tablesTranslation.social.item1)}
          value={5}
        />
        <SimpleTableRow
          className={classNames(styles.tableRow, 'mb-2.5')}
          label={t(tablesTranslation.social.item2)}
          value={10}
        />
        <SimpleTableRow
          className={classNames(styles.tableRow, 'mb-2.5')}
          label={t(tablesTranslation.social.item3)}
          value={200}
        />
        <SimpleTableRow
          className={styles.tableRow}
          label={t(tablesTranslation.social.item4)}
          value={500}
        />
      </SimpleTable>
    </div>
  </>
);
