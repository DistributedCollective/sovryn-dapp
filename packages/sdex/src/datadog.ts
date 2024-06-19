import { datadogLogs } from '@datadog/browser-logs';

console.log('datadogLogs', process.env.DATADOG_CLIENT_TOKEN);

datadogLogs.init({
  clientToken: process.env.DATADOG_CLIENT_TOKEN || '',
  site: 'datadoghq.com',
  forwardErrorsToLogs: true,
  sessionSampleRate: 100,
});
