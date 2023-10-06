import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  FormGroup,
  Icon,
  IconNames,
  Input,
  InputSize,
} from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { validateURL } from '../../../../../../../utils/helpers';
import {
  ProposalCreationDetails,
  ProposalCreationType,
} from '../../../../contexts/ProposalContext.types';

export type ProposalDataFormProps = {
  value: ProposalCreationDetails;
  onChange: (value: ProposalCreationDetails) => void;
  proposalType: ProposalCreationType;
  onBack: () => void;
  onSubmit: () => void;
  onPreview: () => void;
};

export const ProposalDataForm: FC<ProposalDataFormProps> = ({
  value,
  onChange,
  proposalType,
  onBack,
  onSubmit,
  onPreview,
}) => {
  const [form, setForm] = useState<ProposalCreationDetails>(value);

  const isValidUrl = useMemo(() => validateURL(form.link), [form.link]);

  const isSubmitDisabled = useMemo(
    () =>
      !form.title || !form.summary || !form.link || !form.text || !isValidUrl,
    [form.link, form.summary, form.text, form.title, isValidUrl],
  );

  const handleBack = useCallback(() => {
    onChange(form);
    onBack();
  }, [form, onBack, onChange]);

  const onChangeHandler = useCallback(() => onChange(form), [form, onChange]);
  const handleSubmit = useCallback(() => {
    onChange(form);
    onSubmit();
  }, [form, onChange, onSubmit]);
  const handlePreview = useCallback(() => {
    onChange(form);
    onPreview();
  }, [form, onChange, onPreview]);

  return (
    <div className="flex flex-col gap-4 relative pt-4">
      <button className="absolute left-0 -top-2" onClick={handleBack}>
        <Icon size={14} icon={IconNames.ARROW_BACK} />
      </button>
      <FormGroup label={t(translations.bitocracyPage.proposalDataForm.title)}>
        <Input
          value={form.title}
          maxLength={140}
          className="max-w-[22rem]"
          onChangeText={title => setForm(form => ({ ...form, title }))}
          size={InputSize.large}
        />
      </FormGroup>

      <FormGroup
        label={t(translations.bitocracyPage.proposalDataForm.discussionUrl)}
        errorLabel={
          isValidUrl || !form.link
            ? undefined
            : t(translations.bitocracyPage.proposalDataForm.invalidURL)
        }
      >
        <Input
          value={form.link}
          className="max-w-[22rem]"
          onChangeText={link => setForm(form => ({ ...form, link }))}
          size={InputSize.large}
        />
      </FormGroup>

      <FormGroup
        label={t(translations.bitocracyPage.proposalDataForm.proposalSummary)}
      >
        <Input
          value={form.summary}
          maxLength={140}
          className="max-w-[22rem]"
          onChangeText={summary => setForm(form => ({ ...form, summary }))}
          size={InputSize.large}
        />
      </FormGroup>

      <FormGroup
        label={t(translations.bitocracyPage.proposalDataForm.description)}
      >
        <Input
          value={form.text}
          maxLength={10000}
          className="max-w-[22rem]"
          onChangeText={text => setForm(form => ({ ...form, text }))}
          size={InputSize.large}
        />
      </FormGroup>

      {[
        ProposalCreationType.Parameters,
        ProposalCreationType.Treasury,
      ].includes(proposalType) && (
        <Button
          text={t(translations.common.buttons.continue)}
          className="w-full sm:w-auto mt-4"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        />
      )}

      {proposalType === ProposalCreationType.Proclamation && (
        <div className="flex items-center gap-4 mt-4">
          <Button
            text={t(translations.bitocracyPage.actions.preview)}
            onClick={handlePreview}
            style={ButtonStyle.secondary}
            className="flex-1"
          />
          <Button
            text={t(translations.common.buttons.continue)}
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="flex-1"
          />
        </div>
      )}
    </div>
  );
};
