import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Button, ButtonStyle, Icon, IconNames } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { Data } from './ExportCSV.types';
import { createCSV, downloadCSV } from './utils';

type ExportCSVProps = {
  className?: string;
  filename: string;
  getData: () => Promise<Data[]>;
  onExportEnd?: () => void;
};

export const ExportCSV: React.FC<ExportCSVProps> = ({
  className,
  filename,
  getData,
  onExportEnd,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getData();
      const csvData = createCSV(data);
      downloadCSV(csvData, filename);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      onExportEnd?.();
    }
  }, [filename, getData, onExportEnd]);

  return (
    <Button
      text={
        <>
          {t(translations.exportCSV)}

          <Icon
            className="ml-2"
            size={12}
            icon={IconNames.LINK}
            viewBox="0 0 12 12"
          />
        </>
      }
      onClick={onSubmit}
      loading={isLoading}
      style={ButtonStyle.secondary}
      className={className}
    />
  );
};
