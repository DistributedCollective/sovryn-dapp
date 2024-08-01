import React from 'react';

import { t } from 'i18next';
import { Link } from 'react-router-dom';

import { Paragraph } from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { useGetUnclaimedUserVestingCount } from '../../hooks/useLmLimit';
import {
  LOCK_CLAIM_COUNT,
  MIN_ALERT_COUNT,
} from './UnclaimedVestingAlert.constants';

export const UnclaimcedVestingAlert = () => {
  const count = useGetUnclaimedUserVestingCount();

  if (count > MIN_ALERT_COUNT && count < LOCK_CLAIM_COUNT) {
    return (
      <div className="bg-error-light bg-opacity-50 p-4 rounded-lg mt-12 my-4 mx-8">
        <Paragraph>
          {t(translations.unclaimedVestings.text, { value: count })}{' '}
          <Link
            to="/rewards"
            className="underline text-primary-20 hover:text-primary-10"
          >
            {t(translations.unclaimedVestings.cta)}
          </Link>
        </Paragraph>
      </div>
    );
  }

  return null;
};
