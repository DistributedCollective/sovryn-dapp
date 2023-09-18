import React, { FC } from 'react';

import { t } from 'i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';

const pageTranslations = translations.proposalPage;

type ProposalInfoProps = {
  link: string;
  description: string;
};

export const ProposalInfo: FC<ProposalInfoProps> = ({ link, description }) => {
  return (
    <div className="bg-gray-90 px-6 pt-6 pb-3 rounded">
      <div className="flex">
        <Paragraph
          size={ParagraphSize.base}
          className="text-xs w-24 mb-3 text-gray-30"
        >
          {t(pageTranslations.discussionLink)}
        </Paragraph>
        {link && (
          <Paragraph size={ParagraphSize.base} className="text-xs">
            <a
              href={link}
              className="text-primary-20"
              target="_blank"
              rel="noreferrer"
            >
              {link}
            </a>
          </Paragraph>
        )}
      </div>

      <div className="flex">
        <Paragraph
          size={ParagraphSize.base}
          className="text-xs w-24 text-gray-30"
        >
          {t(pageTranslations.proposalText)}
        </Paragraph>
        <Paragraph size={ParagraphSize.base} className="text-xs">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {description}
          </ReactMarkdown>
        </Paragraph>
      </div>
    </div>
  );
};
