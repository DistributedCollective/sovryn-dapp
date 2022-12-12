import { Data } from './ExportCSV.types';

export const downloadCSV = (data, filename: string) => {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');

  downloadLink.href = url;
  downloadLink.setAttribute('download', `${filename}.csv`);
  downloadLink.click();
};

export const createCSV = (data: Data[]) => {
  const csvRows: string[] = [];

  const headers = Object.keys(data[0]);

  csvRows.push(headers.join(','));

  csvRows.join('\n');

  data.forEach(item => {
    csvRows.push(Object.values(item).join(','));
    csvRows.join('\n');
  });

  return csvRows.join('\n');
};
