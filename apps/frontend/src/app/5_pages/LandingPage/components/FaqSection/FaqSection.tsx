import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { Accordion, Link, Paragraph } from '@sovryn/ui';

import { BOB_DOCS_LINK } from '../../../../../constants/links';
import { translations } from '../../../../../locales/i18n';

const pageTranslations = translations.landingPage.faqSection;

const faqData = [
  {
    title: t(pageTranslations.list.first.title),
    description: t(pageTranslations.list.first.description),
  },
  {
    title: t(pageTranslations.list.second.title),
    description: (
      <Trans
        i18nKey={t(pageTranslations.list.second.description)}
        components={[
          <Link
            text={t(pageTranslations.list.second.cta)}
            href={BOB_DOCS_LINK}
            openNewTab
          />,
        ]}
      />
    ),
  },
  {
    title: t(pageTranslations.list.third.title),
    description: t(pageTranslations.list.third.description),
  },
  {
    title: t(pageTranslations.list.fourth.title),
    description: t(pageTranslations.list.fourth.description),
  },
  {
    title: t(pageTranslations.list.fifth.title),
    description: t(pageTranslations.list.fifth.description),
  },
];

export const FaqSection: FC = () => {
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(
    null,
  );

  const renderDescription = useCallback(item => {
    if (typeof item.description === 'string') {
      return <Trans i18nKey={item.description} />;
    } else {
      return item.description;
    }
  }, []);

  const onClick = useCallback((index: number) => {
    setOpenAccordionIndex(prevIndex => (prevIndex === index ? null : index));
  }, []);
  return (
    <div className="sm:pt-8 sm:pb-8 pt-6 pb-0 sm:px-6 px-3 rounded bg-gray-90 self-start xl:mt-0 mt-8">
      <Paragraph
        className="font-medium text-2xl text-sov-white mb-8"
        children={t(pageTranslations.title)}
      />

      <div>
        {faqData.map((item, index) => (
          <Accordion
            key={index}
            label={item.title}
            children={
              <div className="bg-gray-70 px-4 py-3 -mt-3 rounded-b">
                <Paragraph className="text-gray-40 text-xs font-medium">
                  {renderDescription(item)}
                </Paragraph>
              </div>
            }
            open={openAccordionIndex === index}
            onClick={() => onClick(index)}
            className="mb-3"
            labelClassName="bg-gray-70 h-10 rounded w-full flex items-center px-4 text-sm justify-between font-medium"
          />
        ))}
      </div>
    </div>
  );
};
