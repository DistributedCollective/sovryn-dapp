import React from 'react';

import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph } from '@sovryn/ui';

type EmailContentRendererProps = {
  metaTitle: string;
  title: string;
  subtitle: React.ReactNode;
};

export const EmailContentRenderer: React.FC<EmailContentRendererProps> = ({
  metaTitle,
  title,
  subtitle,
}) => {
  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
      </Helmet>
      <div className="w-full flex flex-col items-center justify-center m-auto max-w-[51rem] text-gray-10 px-7 py-11 lg:py-16 bg-gray-90 mt-24 mb-5 lg:mt-[15.875rem] rounded">
        <Heading className="font-medium text-2xl mb-10 lg:mb-12 text-center">
          {title}
        </Heading>
        <Paragraph className="max-w-xl leading-[1.125rem] font-normal text-sm lg:text-base text-center lg:px-4">
          {subtitle}
        </Paragraph>
      </div>
    </>
  );
};
