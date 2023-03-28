import React from 'react';

import { isDevEnvironment } from './utils/helpers';

if (isDevEnvironment()) {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
