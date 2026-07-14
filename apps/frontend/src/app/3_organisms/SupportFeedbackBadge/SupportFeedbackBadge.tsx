import React, {
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { nanoid } from 'nanoid';

import {
  Button,
  ButtonStyle,
  ButtonType,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogSize,
  Icon,
  IconNames,
  Input,
  NotificationType,
} from '@sovryn/ui';

import { useNotificationContext } from '../../../contexts/NotificationContext';
import { validateEmail } from '../../../utils/helpers';

const SUPPORT_FEEDBACK_ENDPOINT = '/.netlify/functions/support-feedback';
const TURNSTILE_SCRIPT_ID = 'sovryn-turnstile-script';
const TURNSTILE_SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TURNSTILE_SITE_KEY = process.env.REACT_APP_TURNSTILE_SITE_KEY;

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_FEEDBACK_LENGTH = 2000;

type TurnstileWidgetId = string | number;

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: Record<string, unknown>,
  ) => TurnstileWidgetId;
  remove: (widgetId?: TurnstileWidgetId) => void;
  reset: (widgetId?: TurnstileWidgetId) => void;
};

type FormErrors = {
  name?: string;
  email?: string;
  feedback?: string;
  captcha?: string;
};

const getTurnstileApi = () =>
  (window as Window & { turnstile?: TurnstileApi }).turnstile;

const loadTurnstileScript = async (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (getTurnstileApi()) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(
      TURNSTILE_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Failed to load captcha script')),
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load captcha script'));
    document.head.appendChild(script);
  });

export const SupportFeedbackBadge: FC = () => {
  const { addNotification } = useNotificationContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const captchaContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<TurnstileWidgetId | null>(null);

  const removeCaptchaWidget = useCallback(() => {
    const turnstile = getTurnstileApi();

    if (turnstile && turnstileWidgetIdRef.current !== null) {
      turnstile.remove(turnstileWidgetIdRef.current);
    }

    turnstileWidgetIdRef.current = null;
  }, []);

  const resetCaptchaChallenge = useCallback(() => {
    setTurnstileToken('');

    const turnstile = getTurnstileApi();
    if (turnstile && turnstileWidgetIdRef.current !== null) {
      turnstile.reset(turnstileWidgetIdRef.current);
    }
  }, []);

  const resetForm = useCallback(() => {
    setName('');
    setEmail('');
    setFeedback('');
    setShowCaptcha(false);
    setTurnstileToken('');
    setErrors({});
    setIsSubmitting(false);
    removeCaptchaWidget();
  }, [removeCaptchaWidget]);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    resetForm();
  }, [resetForm]);

  const validateFields = useCallback(() => {
    const nextErrors: FormErrors = {};

    const normalizedName = name.trim();
    const normalizedEmail = email.trim();
    const normalizedFeedback = feedback.trim();

    if (!normalizedName) {
      nextErrors.name = 'Name is required.';
    }

    if (!normalizedEmail) {
      nextErrors.email = 'Email is required.';
    } else if (!validateEmail(normalizedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!normalizedFeedback) {
      nextErrors.feedback = 'Feedback is required.';
    }

    return {
      nextErrors,
      normalizedName,
      normalizedEmail,
      normalizedFeedback,
    };
  }, [email, feedback, name]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting) {
        return;
      }

      const {
        nextErrors,
        normalizedName,
        normalizedEmail,
        normalizedFeedback,
      } = validateFields();

      if (!TURNSTILE_SITE_KEY) {
        nextErrors.captcha =
          'Support form is unavailable. Captcha is not configured.';
      }

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }

      if (!turnstileToken) {
        setShowCaptcha(true);
        setErrors({
          captcha: 'Complete the captcha challenge and submit again.',
        });
        return;
      }

      setIsSubmitting(true);
      setErrors({});

      try {
        const response = await fetch(SUPPORT_FEEDBACK_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: normalizedName,
            email: normalizedEmail,
            message: normalizedFeedback,
            turnstileToken,
          }),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          resetCaptchaChallenge();

          if (payload?.code === 'captcha_failed') {
            setErrors({
              captcha:
                'Captcha verification failed. Complete the challenge again.',
            });
          }

          addNotification({
            type: NotificationType.error,
            title:
              payload?.error ||
              'Unable to send your message right now. Please try again.',
            dismissible: true,
            id: nanoid(),
          });
          return;
        }

        addNotification({
          type: NotificationType.success,
          title: 'Message sent. Our support team will reach out soon.',
          dismissible: true,
          id: nanoid(),
        });

        closeDialog();
      } catch {
        resetCaptchaChallenge();
        addNotification({
          type: NotificationType.error,
          title: 'Unable to send your message right now. Please try again.',
          dismissible: true,
          id: nanoid(),
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      addNotification,
      closeDialog,
      isSubmitting,
      resetCaptchaChallenge,
      turnstileToken,
      validateFields,
    ],
  );

  useEffect(() => {
    if (!isDialogOpen || !showCaptcha || !TURNSTILE_SITE_KEY) {
      return;
    }

    if (!captchaContainerRef.current || turnstileWidgetIdRef.current !== null) {
      return;
    }

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (
          cancelled ||
          !captchaContainerRef.current ||
          turnstileWidgetIdRef.current !== null
        ) {
          return;
        }

        const turnstile = getTurnstileApi();
        if (!turnstile) {
          setErrors({
            captcha: 'Captcha failed to load. Please refresh and try again.',
          });
          return;
        }

        turnstileWidgetIdRef.current = turnstile.render(
          captchaContainerRef.current,
          {
            sitekey: TURNSTILE_SITE_KEY,
            theme: 'dark',
            callback: (token: string) => {
              setTurnstileToken(token);
              setErrors(prev => ({ ...prev, captcha: undefined }));
            },
            'expired-callback': () => {
              setTurnstileToken('');
            },
            'error-callback': () => {
              setTurnstileToken('');
              setErrors({
                captcha: 'Captcha verification failed. Please try again.',
              });
            },
          },
        );
      })
      .catch(() => {
        if (!cancelled) {
          setErrors({
            captcha: 'Captcha failed to load. Please refresh and try again.',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isDialogOpen, showCaptcha]);

  useEffect(
    () => () => {
      removeCaptchaWidget();
    },
    [removeCaptchaWidget],
  );

  return (
    <>
      <button
        type="button"
        className="fixed bottom-4 right-4 z-[110] flex items-center gap-2 rounded-full border border-gray-60 bg-gray-80 px-4 py-3 text-sm font-medium text-gray-10 shadow-[0_8px_22px_rgba(0,0,0,0.45)] transition-colors hover:bg-gray-70"
        onClick={() => setIsDialogOpen(true)}
      >
        <Icon icon={IconNames.MAIL} size={14} />
        <span className="hidden sm:inline">Support</span>
      </button>

      <Dialog width={DialogSize.sm} isOpen={isDialogOpen} disableFocusTrap>
        <DialogHeader title="Support" onClose={closeDialog} />
        <DialogBody className="p-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1" htmlFor="support-name">
                Name
              </label>
              <Input
                id="support-name"
                value={name}
                debounce={0}
                maxLength={MAX_NAME_LENGTH}
                placeholder="Your name"
                onChangeText={setName}
              />
              {errors.name && (
                <p className="text-error text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="support-email">
                Email
              </label>
              <Input
                id="support-email"
                value={email}
                debounce={0}
                maxLength={MAX_EMAIL_LENGTH}
                placeholder="you@example.com"
                onChangeText={setEmail}
              />
              {errors.email && (
                <p className="text-error text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="support-feedback">
                Feedback / issue
              </label>
              <textarea
                id="support-feedback"
                rows={5}
                maxLength={MAX_FEEDBACK_LENGTH}
                className="w-full bg-gray-70 border border-gray-70 p-3 rounded focus:border-gray-60 min-h-[7.5rem] overflow-auto"
                value={feedback}
                onChange={event => setFeedback(event.target.value)}
                placeholder="Describe what happened and how we can help."
              />
              {errors.feedback && (
                <p className="text-error text-xs mt-1">{errors.feedback}</p>
              )}
            </div>

            {showCaptcha && (
              <div>
                <div ref={captchaContainerRef} className="min-h-[70px]" />
              </div>
            )}

            {errors.captcha && (
              <p className="text-error text-xs -mt-2">{errors.captcha}</p>
            )}

            <div className="flex justify-end gap-3 mt-2">
              <Button
                text="Cancel"
                style={ButtonStyle.ghost}
                onClick={closeDialog}
              />
              <Button
                type={ButtonType.submit}
                text={isSubmitting ? 'Sending...' : 'Submit'}
                loading={isSubmitting}
              />
            </div>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
};
