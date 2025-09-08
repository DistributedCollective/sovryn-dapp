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

import { getProtocolContract } from '@sovryn/contracts';
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

import { RSK_CHAIN_ID } from '../../../../../../../config/chains';

import { translations } from '../../../../../../../locales/i18n';
import { validateURL } from '../../../../../../../utils/helpers';
import styles from '../../../../../ProposalPage/components/ProposalInfo/ProposalInfo.module.css';
import { useProposalContext } from '../../../../contexts/NewProposalContext';
import { ProposalCreationType } from '../../../../contexts/ProposalContext.types';
import { Governor } from '../../NewProposalForm.types';
import {
  MAXIMUM_SUMMARY_LENGTH,
  MAXIMUM_TITLE_LENGTH,
  MAXIMUM_PROPOSAL_TEXT_LENGTH,
  MAXIMUM_DISCUSSION_URL_LENGTH,
} from './ProposalDataForm.constants';
import { generateFormGroupLabel } from './ProposalDataForm.utils';

const ACTIVE_CLASSNAME = 'text-primary-20';

export type ProposalDataFormProps = {
  proposalType: ProposalCreationType;
  onBack: () => void;
  onSubmit: () => void;
  onPreview: () => void;
  updateConfirmButtonState: (value: boolean) => void;
};

export const ProposalDataForm: FC<ProposalDataFormProps> = ({
  proposalType,
  onBack,
  onSubmit,
  onPreview,
  updateConfirmButtonState,
}) => {
  const {
    setGovernor,
    details: form,
    setDetails: setForm,
  } = useProposalContext();
  const [index, setIndex] = useState(0);
  const handleInputChangeInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setForm(prevForm => ({ ...prevForm, [name]: value }));
    },
    [setForm],
  );

  const handleInputChangeTextarea = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setForm(prevForm => ({ ...prevForm, [name]: value }));
    },
    [setForm],
  );

  const isValidUrl = useMemo(() => validateURL(form.link), [form.link]);

  const isSubmitDisabled = useMemo(
    () =>
      !form.title || !form.summary || !form.link || !form.text || !isValidUrl,
    [form.link, form.summary, form.text, form.title, isValidUrl],
  );

  useEffect(() => {
    if (proposalType === ProposalCreationType.Proclamation) {
      updateConfirmButtonState(isSubmitDisabled);
    }
  }, [isSubmitDisabled, proposalType, updateConfirmButtonState]);

  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  const handleSubmit = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  const handlePreview = useCallback(() => {
    onPreview();
  }, [onPreview]);

  const tabs = useMemo(
    () => [
      {
        label: t(translations.bitocracyPage.actions.edit),
        content: (
          <textarea
            name="text"
            maxLength={MAXIMUM_PROPOSAL_TEXT_LENGTH}
            value={form.text}
            onChange={handleInputChangeTextarea}
            className="block w-full bg-gray-70 border border-gray-70 p-3 rounded focus:border-gray-60 min-h-36 mt-2"
          />
        ),
        activeClassName: ACTIVE_CLASSNAME,
      },
      {
        label: t(translations.bitocracyPage.actions.preview),
        content: (
          <div className={styles.description}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: props => (
                  <a href={props.href} target="_blank" rel="noreferrer">
                    {props.children}
                  </a>
                ),
              }}
              className="w-full bg-gray-70 border border-gray-70 p-3 rounded focus:border-gray-60 mt-2 min-h-36 overflow-auto"
            >
              {form.text}
            </ReactMarkdown>
          </div>
        ),
        activeClassName: ACTIVE_CLASSNAME,
      },
    ],
    [form.text, handleInputChangeTextarea],
  );

  useEffect(() => {
    if (proposalType === ProposalCreationType.Proclamation) {
      getProtocolContract(Governor.Admin, RSK_CHAIN_ID).then(admin => {
        setGovernor(admin.address);
      });
    }
  }, [proposalType, setGovernor]);

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
          MAXIMUM_TITLE_LENGTH,
        )}
      >
        <Input
          value={form.title}
          maxLength={MAXIMUM_TITLE_LENGTH}
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
          MAXIMUM_DISCUSSION_URL_LENGTH,
        )}
        errorLabel={
          isValidUrl || !form.link
            ? undefined
            : t(translations.bitocracyPage.proposalDataForm.invalidURL)
        }
      >
        <Input
          value={form.link}
          maxLength={MAXIMUM_DISCUSSION_URL_LENGTH}
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
          MAXIMUM_SUMMARY_LENGTH,
        )}
      >
        <textarea
          name="summary"
          maxLength={MAXIMUM_SUMMARY_LENGTH}
          value={form.summary}
          onChange={handleInputChangeTextarea}
          className="w-full bg-gray-70 border border-gray-70 p-3 rounded focus:border-gray-60 min-h-[3.75rem] overflow-hidden"
        />
      </FormGroup>

      <FormGroup
        label={generateFormGroupLabel(
          t(translations.bitocracyPage.proposalDataForm.proposalText),
          form.text,
          MAXIMUM_PROPOSAL_TEXT_LENGTH.toLocaleString(),
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
            text={t(translations.common.buttons.confirm)}
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="flex-1"
          />
        </div>
      )}
    </div>
  );
};
