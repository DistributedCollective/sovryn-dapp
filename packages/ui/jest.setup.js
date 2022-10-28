import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';

import { DATA_ATTRIBUTE } from './src/utils/constants';

configure({
  testIdAttribute: DATA_ATTRIBUTE,
});
