import React, { FC } from 'react';

import { t } from 'i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import styles from './ProposalInfo.module.css';

const pageTranslations = translations.proposalPage;

type ProposalInfoProps = {
  link: string;
  description: string;
};

export const ProposalInfo: FC<ProposalInfoProps> = ({ link, description }) => (
  <div className="bg-gray-90 px-6 pt-6 pb-3 rounded">
    <div className="sm:flex sm:mb-0 mb-2">
      <Paragraph
        size={ParagraphSize.base}
        className="text-xs min-w-24 w-24 mb-3 text-gray-30"
      >
        {t(pageTranslations.discussionLink)}
      </Paragraph>
      {link && (
        <Paragraph size={ParagraphSize.base} className="text-sm leading-5">
          <a
            href={link}
            className="text-primary-20 break-words"
            target="_blank"
            rel="noreferrer"
          >
            {link}
          </a>
        </Paragraph>
      )}
    </div>

    <div className="sm:flex sm:mb-0 mb-2 overflow-hidden">
      <Paragraph
        size={ParagraphSize.base}
        className="text-xs min-w-24 w-24 text-gray-30 mb-2"
      >
        {t(pageTranslations.proposalText)}
      </Paragraph>
      <div className={styles.description}>
        <ReactMarkdown
          components={{
            a: props => (
              <a href={props.href} target="_blank" rel="noreferrer">
                {props.children}
              </a>
            ),
          }}
          className={styles.markdown}
          remarkPlugins={[remarkGfm]}
        >
          {description}
        </ReactMarkdown>
      </div>
    </div>
  </div>
);
