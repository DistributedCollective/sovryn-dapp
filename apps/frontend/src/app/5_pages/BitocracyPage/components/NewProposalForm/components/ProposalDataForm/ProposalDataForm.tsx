import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { t } from 'i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  Button,
  ButtonStyle,
  FormGroup,
  Icon,
  IconNames,
  Input,
  InputSize,
  TabType,
  Tabs,
} from '@sovryn/ui';

import { translations } from '../../../../../../../locales/i18n';
import { validateURL } from '../../../../../../../utils/helpers';
import {
  ProposalCreationDetails,
  ProposalCreationType,
} from '../../../../contexts/ProposalContext.types';
import {
  maxCharactersLength,
  maxDiscussionUrlLength,
  maxProposalTextLength,
} from './ProposalDataForm.constants';
import { generateFormGroupLabel } from './ProposalDataForm.utils';

const ACTIVE_CLASSNAME = 'text-primary-20';

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
  const [index, setIndex] = useState(0);
  const handleInputChangeInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setForm(prevForm => ({ ...prevForm, [name]: value }));
    },
    [],
  );

  const handleInputChangeTextarea = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setForm(prevForm => ({ ...prevForm, [name]: value }));
    },
    [],
  );

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

  const handleSubmit = useCallback(() => {
    onChange(form);
    onSubmit();
  }, [form, onChange, onSubmit]);

  const handlePreview = useCallback(() => {
    onChange(form);
    onPreview();
  }, [form, onChange, onPreview]);

  const tabs = useMemo(
    () => [
      {
        label: t(translations.bitocracyPage.actions.edit),
        content: (
          <textarea
            name="text"
            maxLength={maxProposalTextLength}
            value={form.text}
            onChange={handleInputChangeTextarea}
            className="block w-full bg-gray-70 border border-gray-70 p-3 rounded focus:border-gray-60 h-36 mt-2"
          />
        ),
        activeClassName: ACTIVE_CLASSNAME,
      },
      {
        label: t(translations.bitocracyPage.actions.preview),
        content: (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="w-full bg-gray-70 border border-gray-70 p-3 rounded focus:border-gray-60 mt-2 h-36 overflow-auto"
          >
            {form.text}
          </ReactMarkdown>
        ),
        activeClassName: ACTIVE_CLASSNAME,
      },
    ],
    [form.text, handleInputChangeTextarea],
  );

  useEffect(() => {
    setForm(value);
  }, [value]);

  return (
    <div className="flex flex-col gap-8 relative pb-4">
      <Button
        onClick={handleBack}
        style={ButtonStyle.ghost}
        className="text-gray-10 inline-flex justify-start items-center text-base font-medium cursor-pointer"
        text={
          <>
            <Icon size={12} icon={IconNames.ARROW_LEFT} className="mr-2" />
            {t(translations.common.buttons.back)}
          </>
        }
      />
      <FormGroup
        label={generateFormGroupLabel(
          t(translations.bitocracyPage.proposalDataForm.title),
          form.title,
          maxCharactersLength,
        )}
      >
        <Input
          value={form.title}
          maxLength={maxCharactersLength}
          className="max-w-full"
          onChangeText={title => setForm(form => ({ ...form, title }))}
          size={InputSize.large}
          onChange={handleInputChangeInput}
          name="title"
        />
      </FormGroup>

      <FormGroup
        label={generateFormGroupLabel(
          t(translations.bitocracyPage.proposalDataForm.discussionUrl),
          form.link,
          maxDiscussionUrlLength,
        )}
        errorLabel={
          isValidUrl || !form.link
            ? undefined
            : t(translations.bitocracyPage.proposalDataForm.invalidURL)
        }
      >
        <Input
          value={form.link}
          maxLength={maxDiscussionUrlLength}
          className="max-w-full"
          onChangeText={link => setForm(form => ({ ...form, link }))}
          size={InputSize.large}
          onChange={handleInputChangeInput}
          name="link"
        />
      </FormGroup>

      <FormGroup
        label={generateFormGroupLabel(
          t(translations.bitocracyPage.proposalDataForm.proposalSummary),
          form.summary,
          maxCharactersLength,
        )}
      >
        <textarea
          name="summary"
          maxLength={maxCharactersLength}
          value={form.summary}
          onChange={handleInputChangeTextarea}
          className="w-full bg-gray-70 border border-gray-70 p-3 rounded focus:border-gray-60 min-h-[3.75rem] overflow-hidden"
        />
      </FormGroup>

      <FormGroup
        label={generateFormGroupLabel(
          t(translations.bitocracyPage.proposalDataForm.proposalText),
          form.text,
          maxProposalTextLength.toLocaleString(),
        )}
      >
        <Tabs
          items={tabs}
          onChange={setIndex}
          index={index}
          type={TabType.secondary}
          className="block mb-2"
        />
      </FormGroup>

      {[
        ProposalCreationType.Parameters,
        ProposalCreationType.Treasury,
      ].includes(proposalType) && (
        <Button
          text={t(translations.common.buttons.continue)}
          className="w-full sm:w-auto self-center min-w-44 "
          onClick={handleSubmit}
          style={ButtonStyle.secondary}
          disabled={isSubmitDisabled}
        />
      )}

      {proposalType === ProposalCreationType.Proclamation && (
        <div className="flex items-center gap-4">
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
