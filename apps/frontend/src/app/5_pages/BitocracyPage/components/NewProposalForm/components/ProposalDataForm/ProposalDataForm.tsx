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
import { ProposalFormData, ProposalType } from '../../NewProposalForm.types';

export type ProposalDataFormProps = {
  value: ProposalFormData;
  onChange: (value: ProposalFormData) => void;
  proposalType: ProposalType;
  onBack: () => void;
};

export const ProposalDataForm: FC<ProposalDataFormProps> = ({
  value,
  onChange,
  proposalType,
  onBack,
}) => {
  const [form, setForm] = useState(value);

  const isValidURL = useMemo(
    () => validateURL(form.discussionURL),
    [form.discussionURL],
  );

  const isSubmitDisabled = useMemo(
    () =>
      !form.title ||
      !form.description ||
      !form.discussionURL ||
      !form.description ||
      !isValidURL,
    [form.description, form.discussionURL, form.title, isValidURL],
  );

  const onChangeHandler = useCallback(() => onChange(form), [form, onChange]);

  return (
    <div className="flex flex-col gap-4 relative pt-4">
      <button className="absolute left-0 -top-2" onClick={onBack}>
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
        label={t(translations.bitocracyPage.proposalDataForm.discussionURL)}
        errorLabel={
          isValidURL || !form.discussionURL
            ? undefined
            : t(translations.bitocracyPage.proposalDataForm.invalidURL)
        }
      >
        <Input
          value={form.discussionURL}
          className="max-w-[22rem]"
          onChangeText={discussionURL =>
            setForm(form => ({ ...form, discussionURL }))
          }
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
          value={form.description}
          maxLength={10000}
          className="max-w-[22rem]"
          onChangeText={description =>
            setForm(form => ({ ...form, description }))
          }
          size={InputSize.large}
        />
      </FormGroup>

      {[ProposalType.Parameter, ProposalType.Treasury].includes(
        proposalType,
      ) && (
        <Button
          text={t(translations.common.buttons.continue)}
          className="w-full sm:w-auto mt-4"
          onClick={onChangeHandler}
          disabled={isSubmitDisabled}
        />
      )}

      {proposalType === ProposalType.Proclamation && (
        <div className="flex items-center gap-4 mt-4">
          <Button
            text={t(translations.bitocracyPage.actions.preview)}
            onClick={onChangeHandler}
            style={ButtonStyle.secondary}
            className="flex-1"
          />
          <Button
            text={t(translations.common.buttons.continue)}
            onClick={onChangeHandler}
            disabled={isSubmitDisabled}
            className="flex-1"
          />
        </div>
      )}
    </div>
  );
};
