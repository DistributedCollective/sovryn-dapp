const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_DISCORD_DESCRIPTION_LENGTH = 3500;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const JSON_HEADERS = {
  ...CORS_HEADERS,
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: JSON_HEADERS,
  body: JSON.stringify(payload),
});

const normalizeText = (value, maxLength) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

const escapeMentions = value => value.replace(/@/g, '@\u200b');

const truncateText = (value, maxLength) =>
  value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;

const getClientIp = event => {
  const headers = event.headers || {};
  const header =
    headers['x-forwarded-for'] ||
    headers['X-Forwarded-For'] ||
    headers['x-nf-client-connection-ip'] ||
    '';

  return header.split(',')[0].trim();
};

const verifyTurnstile = async ({ token, secret, clientIp }) => {
  const payload = new URLSearchParams();
  payload.append('secret', secret);
  payload.append('response', token);
  if (clientIp) {
    payload.append('remoteip', clientIp);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload.toString(),
  });

  if (!response.ok) {
    return false;
  }

  const result = await response.json().catch(() => null);
  return !!result?.success;
};

const sendToDiscord = async ({ webhookUrl, name, email, message }) => {
  const payload = {
    allowed_mentions: {
      parse: [],
    },
    embeds: [
      {
        title: 'New Sovryn Support Request',
        color: 0xf7931a,
        fields: [
          {
            name: 'Name',
            value: escapeMentions(name),
            inline: true,
          },
          {
            name: 'Email',
            value: escapeMentions(email),
            inline: true,
          },
        ],
        description: escapeMentions(
          truncateText(message, MAX_DISCORD_DESCRIPTION_LENGTH),
        ),
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.ok;
};

exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, {
      error: 'Method not allowed.',
      code: 'method_not_allowed',
    });
  }

  const webhookUrl = process.env.DISCORD_SUPPORT_WEBHOOK_URL;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

  if (!webhookUrl || !turnstileSecret) {
    return jsonResponse(500, {
      error: 'Support service is not configured.',
      code: 'not_configured',
    });
  }

  let parsedBody = {};

  try {
    parsedBody = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, {
      error: 'Invalid request payload.',
      code: 'invalid_payload',
    });
  }

  const name = normalizeText(parsedBody.name, MAX_NAME_LENGTH);
  const email = normalizeText(parsedBody.email, MAX_EMAIL_LENGTH);
  const message = normalizeText(parsedBody.message, MAX_MESSAGE_LENGTH);
  const turnstileToken = normalizeText(parsedBody.turnstileToken, 4096);

  if (!name || !email || !message || !turnstileToken) {
    return jsonResponse(400, {
      error: 'Missing required fields.',
      code: 'missing_fields',
    });
  }

  if (!EMAIL_REGEX.test(email)) {
    return jsonResponse(400, {
      error: 'Invalid email address.',
      code: 'invalid_email',
    });
  }

  const captchaIsValid = await verifyTurnstile({
    token: turnstileToken,
    secret: turnstileSecret,
    clientIp: getClientIp(event),
  }).catch(() => false);

  if (!captchaIsValid) {
    return jsonResponse(403, {
      error: 'Captcha verification failed. Please try again.',
      code: 'captcha_failed',
    });
  }

  const delivered = await sendToDiscord({
    webhookUrl,
    name,
    email,
    message,
  }).catch(() => false);

  if (!delivered) {
    return jsonResponse(502, {
      error: 'Unable to deliver your feedback right now. Please try again.',
      code: 'discord_failed',
    });
  }

  return jsonResponse(200, { ok: true });
};
