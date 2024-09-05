import React, { FC, useCallback, useMemo, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  Dialog,
  DialogBody,
  DialogHeader,
  Icon,
  IconNames,
  Link,
  Paragraph,
  Tooltip,
  TooltipTrigger,
} from '@sovryn/ui';

import { EModeIcon } from '../../../../../../1_atoms/Icons/Icons';
import { useAaveEModeCategories } from '../../../../../../../hooks/aave/useAaveEModeCategories';
import { translations } from '../../../../../../../locales/i18n';
import { EModeCategory } from '../../../../../../../types/aave';
import { DisableEModeForm } from './components/DisableEModeForm/DisableEModeForm';
import { EnableEModeForm } from './components/EnableEModeForm/EnableEModeForm';
import { SwitchEModeForm } from './components/SwitchEModeForm/SwitchEModeForm';

type EfficiencyModeCardProps = {
  className?: string;
  eModeCategoryId: Number;
};

export const EfficiencyModeCard: FC<EfficiencyModeCardProps> = ({
  className,
  eModeCategoryId,
}) => {
  const eModeCategories = useAaveEModeCategories();
  const [enableEModeOpen, setEnableEModeOpen] = useState(false);
  const [disableEModeOpen, setDisableEModeOpen] = useState(false);
  const [switchEModeOpen, setSwitchEModeOpen] = useState(false);

  const onEnableEModeClose = useCallback(() => {
    setEnableEModeOpen(false);
  }, []);

  const onDisableEModeClose = useCallback(() => {
    setDisableEModeOpen(false);
  }, []);

  const onSwitchEModeClose = useCallback(() => {
    setSwitchEModeOpen(false);
  }, []);

  const currentCategory = useMemo(() => {
    return eModeCategories.find(c => c.id === eModeCategoryId);
  }, [eModeCategories, eModeCategoryId]);

  return (
    <>
      <Tooltip
        className={classNames('flex flex-row gap-2 items-center', className)}
        tooltipClassName="p-1 bg-gray-80"
        trigger={TooltipTrigger.click}
        content={
          <div className="max-w-52 ">
            <div className="p-[10px] text-white space-y-1">
              <Paragraph className="font-medium text-sm">
                {t(translations.aavePage.eModeCard.title)}
              </Paragraph>

              {eModeCategoryId !== 0 && (
                <div className="py-4">
                  <Paragraph className="mb-1 text-gray-30 font-medium text-xs">
                    {t(translations.aavePage.eMode.assetCategory)}
                  </Paragraph>

                  <div className="grid grid-cols-2">
                    <span className="text-gray-10 font-medium text-xs">
                      {currentCategory?.label}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Icon
                        icon={IconNames.SUCCESS_ICON}
                        className="text-success"
                        size={20}
                      />
                      <Paragraph className="font-medium text-xs">
                        {t(translations.common.enabled)}
                      </Paragraph>
                    </div>
                  </div>
                </div>
              )}

              <Paragraph>
                {t(translations.aavePage.eModeCard.description)}{' '}
                <Link href="#" text={t(translations.common.learnMore)} />
              </Paragraph>
            </div>
            {eModeCategoryId !== 0 ? (
              <div className="space-y-1">
                <Button
                  disabled={eModeCategories.length <= 1}
                  onClick={() => setSwitchEModeOpen(true)}
                  text={t(translations.aavePage.eMode.switchCategory)}
                  className="w-full"
                />
                <Button
                  style={ButtonStyle.secondary}
                  onClick={() => setDisableEModeOpen(true)}
                  text={t(translations.common.buttons.disable)}
                  className="w-full"
                />
              </div>
            ) : (
              <Button
                onClick={() => setEnableEModeOpen(true)}
                text={t(translations.common.buttons.enable)}
                className="w-full"
              />
            )}
          </div>
        }
      >
        <div>
          <Icon className="text-gray-30" icon={EModeIcon} size={16} />
          <span className="text-gray-30 text-sm">
            {eModeCategoryId !== 0
              ? t(translations.aavePage.eModeCard.enabled)
              : t(translations.aavePage.eModeCard.disabled)}
          </span>
          <Icon icon={IconNames.SETTINGS} />
        </div>
      </Tooltip>

      <Dialog disableFocusTrap isOpen={enableEModeOpen}>
        <DialogHeader
          title={t(translations.aavePage.eMode.enableEMode)}
          onClose={onEnableEModeClose}
        />
        <DialogBody>
          <EnableEModeForm
            categories={eModeCategories}
            onComplete={onEnableEModeClose}
          />
        </DialogBody>
      </Dialog>

      <Dialog disableFocusTrap isOpen={switchEModeOpen}>
        <DialogHeader
          title={t(translations.aavePage.eMode.switchCategory)}
          onClose={onSwitchEModeClose}
        />
        <DialogBody>
          <SwitchEModeForm
            categories={eModeCategories}
            current={currentCategory as EModeCategory}
            onComplete={onSwitchEModeClose}
          />
        </DialogBody>
      </Dialog>

      <Dialog disableFocusTrap isOpen={disableEModeOpen}>
        <DialogHeader
          title={t(translations.aavePage.eMode.disableEMode)}
          onClose={onDisableEModeClose}
        />
        <DialogBody>
          <DisableEModeForm
            current={currentCategory as EModeCategory}
            onComplete={onDisableEModeClose}
          />
        </DialogBody>
      </Dialog>
    </>
  );
};
