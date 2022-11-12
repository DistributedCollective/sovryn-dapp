import React, { FC, useCallback, useState } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';

import i18next from 'i18next';
import classNames from 'classnames';

import { Menu, MenuItem } from '@sovryn/ui/src/2_molecules';
import { applyDataAttr } from '@sovryn/ui/src/utils';
import { Dropdown } from '@sovryn/ui/src/2_molecules/Dropdown';

import { languages, languageLocalStorageKey } from '../../../locales/i18n';

type LanguageSelectorProps = {
  className?: string;
  dataLayoutId?: string;
};

export const LanguageSelector: FC<LanguageSelectorProps> = ({
  className,
  dataLayoutId,
}) => {
  const [currentLang, setCurrentLang] = useState(
    i18next.language || reactLocalStorage.get('i18nextLng'),
  );

  const changeLanguage = useCallback(
    (language: string) => () => {
      i18next.changeLanguage(language);
      reactLocalStorage.set(languageLocalStorageKey, language);
      setCurrentLang(language);
    },
    [],
  );

  return (
    <Dropdown
      text={currentLang.toUpperCase()}
      className={classNames(className)}
      {...applyDataAttr(dataLayoutId)}
    >
      <Menu>
        {languages.map(language => (
          <MenuItem
            isActive={currentLang === language}
            text={language.toUpperCase()}
            onClick={changeLanguage(language)}
            key={language}
          />
        ))}
      </Menu>
    </Dropdown>
  );
};
