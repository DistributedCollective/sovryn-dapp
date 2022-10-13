# Sovryn UI library

```
yarn add @sovryn/ui
```

```
import '@sovryn/ui/dist/index.css';

import { Button } from '@sovryn/ui';
```

# Development

## Styles

Only use custom styles in \*.module.css

Wrong usage:

```
<div className="p-3 text-blue">some text</div>
```

Correct:

```
# file: example.module.css
.example {
    @apply p-3 text-blue;
}

# component

import styles from './example.module.css';
....
<div className={styles.example}>some text</div>
```

While it will be working on development env classes p-3 text-blue will not be bundled to the production version of the library
and stylings will not be applied to the app which uses ui library.

Classes put in the css modules will bundled as javascript file and imported to the app together with component.
