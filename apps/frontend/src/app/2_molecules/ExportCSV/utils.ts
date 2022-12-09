import { Data } from './ExportCSV.types';

export const downloadCSV = (data, filename: string) => {
  const blob = new Blob([data], { type: 'text/csv' });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');

  a.setAttribute('href', url);

  a.setAttribute('download', `${filename}.csv`);
  a.click();
};

export const createCSV = (data: Data[]) => {
  const csvRows: string[] = [];

  const headers = Object.keys(data[0]);

  csvRows.push(headers.join(','));

  csvRows.join('\n');

  data.forEach(d => {
    csvRows.push(Object.values(d).join(','));
    csvRows.join('\n');
  });

  return csvRows.join('\n');
};
