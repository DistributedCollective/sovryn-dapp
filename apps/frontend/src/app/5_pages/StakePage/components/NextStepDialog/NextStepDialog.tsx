import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';
import { reactLocalStorage } from 'reactjs-localstorage';

import {
  Button,
  ButtonType,
  Checkbox,
  Dialog,
  DialogHeader,
  Heading,
  HeadingType,
  Icon,
  IconNames,
} from '@sovryn/ui';

import { EmailNotificationSettingsDialog } from '../../../../3_organisms/EmailNotificationSettingsDialog/EmailNotificationSettingsDialog';
import { translations } from '../../../../../locales/i18n';

const localStorageKey = 'nextStepPopup';
const translationBasePath = translations.stakePage.nextStepDialog;

type NextStepDialogProps = {
  isOpen: boolean;
  onConfirm: () => void;
};

export const NextStepDialog: FC<NextStepDialogProps> = ({
  isOpen,
  onConfirm,
}) => {
  const [isDissmised, setIsDissmised] = useState(
    !!reactLocalStorage.get(localStorageKey),
  );
  const [settingDialogOpen, setSettingDialogOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  const onClose = useCallback(() => {
    if (checked) {
      reactLocalStorage.set(localStorageKey, 'false');
      setIsDissmised(true);
    }
    onConfirm();
  }, [checked, onConfirm]);

  const onClick = useCallback(() => {
    setSettingDialogOpen(true);
    onClose();
  }, [onClose]);

  return (
    <>
      <EmailNotificationSettingsDialog
        isOpen={settingDialogOpen}
        onClose={() => setSettingDialogOpen(false)}
      />
      <Dialog isOpen={!isDissmised && isOpen} onClose={onConfirm}>
        <DialogHeader title={t(translationBasePath.dialogTitle)} />
        <div className="py-6 px-4">
          <Heading className="mb-6 font-normal" type={HeadingType.h1}>
            {t(translationBasePath.title)}
          </Heading>
          <div className="flex-col py-7 px-5 rounded bg-gray-80">
            <div className="flex">
              <div className="bg-gray-70 min-w-[4.375rem] h-[4.375rem] rounded mr-4 text-sovryn-blue flex items-center justify-center">
                <Icon size={50} icon={IconNames.MAIL} />
              </div>
              <div className="flex flex-col items-start justify-start">
                <Heading className="text-white mb-2" type={HeadingType.h2}>
                  {t(translationBasePath.emailNotifications)}
                </Heading>
                <Heading className="text-gray-10 mb-2" type={HeadingType.h3}>
                  {t(translationBasePath.description)}
                </Heading>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between md:pb-6 px-4 gap-4">
          <Checkbox
            onChangeValue={setChecked}
            label={t(translationBasePath.doNotShowAgain)}
            checked={checked}
          />
          <Button
            className="w-full md:w-auto"
            type={ButtonType.button}
            text={t(translationBasePath.signUp)}
            onClick={onClick}
          />
        </div>
      </Dialog>
    </>
  );
};
