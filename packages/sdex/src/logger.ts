import { datadogLogs } from '@datadog/browser-logs';

if (process.env.REACT_APP_DATADOG_CLIENT_TOKEN) {
  console.log(
    'datadogLogs init successful',
    process.env.REACT_APP_DATADOG_CLIENT_TOKEN,
  );
} else {
  console.log('datadogLogs token missing');
}

datadogLogs.init({
  clientToken: process.env.REACT_APP_DATADOG_CLIENT_TOKEN || '',
  site: 'datadoghq.com',
  forwardErrorsToLogs: true,
  sessionSampleRate: 100,
  service: 'd2',
});

export const logger = (type: 'info' | 'error', title: string, data: object) => {
  if (type === 'error') {
    datadogLogs.logger.error(title, data);
  } else if (type === 'info') {
    datadogLogs.logger.info(title, data);
  }
};
