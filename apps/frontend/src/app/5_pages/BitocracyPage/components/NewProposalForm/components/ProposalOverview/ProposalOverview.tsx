import React, { FC, useMemo, useState } from 'react';

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
import {
  ProposalOverviewData,
  ProposalType,
} from '../../NewProposalForm.types';

export type ProposalOverviewProps = {
  value: ProposalOverviewData;
  onChange: (value: ProposalOverviewData) => void;
  proposalType: ProposalType;
  onBack: () => void;
};

export const ProposalOverview: FC<ProposalOverviewProps> = ({
  value,
  onChange,
  proposalType,
  onBack,
}) => {
  const [form, setForm] = useState(value);

  const isSubmitDisabled = useMemo(
    () =>
      !form.title &&
      !form.description &&
      !form.discussionURL &&
      !form.description,
    [form.description, form.discussionURL, form.title],
  );
  return (
    <div className="flex flex-col gap-4 relative pt-4">
      <button className="absolute left-0 -top-2" onClick={onBack}>
        <Icon size={14} icon={IconNames.ARROW_BACK} />
      </button>
      <FormGroup label={t(translations.bitocracyPage.proposalOverview.title)}>
        <Input
          value={form.title}
          onChangeText={title => setForm(form => ({ ...form, title }))}
          size={InputSize.large}
        />
      </FormGroup>

      <FormGroup
        label={t(translations.bitocracyPage.proposalOverview.discussionURL)}
      >
        <Input
          value={form.discussionURL}
          onChangeText={discussionURL =>
            setForm(form => ({ ...form, discussionURL }))
          }
          size={InputSize.large}
        />
      </FormGroup>

      <FormGroup
        label={t(translations.bitocracyPage.proposalOverview.proposalSummary)}
      >
        <Input
          value={form.summary}
          onChangeText={summary => setForm(form => ({ ...form, summary }))}
          size={InputSize.large}
        />
      </FormGroup>

      <FormGroup
        label={t(translations.bitocracyPage.proposalOverview.description)}
      >
        <Input
          value={form.description}
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
          onClick={() => onChange(form)}
          disabled={isSubmitDisabled}
        />
      )}

      {proposalType === ProposalType.Proclamation && (
        <div className="flex items-center gap-4 mt-4">
          <Button
            text={t(translations.bitocracyPage.actions.preview)}
            onClick={() => onChange(form)}
            style={ButtonStyle.secondary}
            className="flex-1"
          />
          <Button
            text={t(translations.common.buttons.continue)}
            onClick={() => onChange(form)}
            disabled={isSubmitDisabled}
            className="flex-1"
          />
        </div>
      )}
    </div>
  );
};
