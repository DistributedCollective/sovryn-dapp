import React from 'react';

import { CSVLink } from 'react-csv';

import { Button } from '@sovryn/ui';

interface Props {
  className?: string;
  headers?: string[];
  data: string[][];
  filename: string;
}

export const Export: React.FC<Props> = ({ data, headers, filename }) => {
  return (
    <CSVLink data={data} filename={filename} headers={headers}>
      <Button disabled={data.length === 0} text="Export" />
    </CSVLink>
  );
};
