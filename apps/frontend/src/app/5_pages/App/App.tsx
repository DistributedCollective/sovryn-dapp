import React from 'react';

import { Lead } from '@sovryn/ui';

import { EthersProviderTest } from '../../3_organisms/EthersProviderTest';
import { useTheme } from '../../../hooks/useTheme';
import { AppTheme } from '../../../types/tailwind';
import styles from './App.module.css';

function App() {
  const { handleThemeChange } = useTheme();

  return (
    <div className="my-2 px-4">
      <header>
        <p className={styles.test}>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        <Lead test={false}>abc</Lead>
        <Lead test={true}>def</Lead>

        <div className="flex items-center gap-4">
          <div
            className="cursor-pointer"
            onClick={() => handleThemeChange(AppTheme.sovryn)}
          >
            Sovryn
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleThemeChange(AppTheme.dark)}
          >
            Dark
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleThemeChange(AppTheme.light)}
          >
            Light
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleThemeChange(AppTheme.coffee)}
          >
            coffee
          </div>
        </div>
        <p className="text-primary">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque
          tempora itaque voluptatum veritatis perferendis temporibus tenetur
          quod corrupti rerum voluptatibus? Totam a quas recusandae quasi
          molestiae ipsa omnis dolorum aliquam.
        </p>
        <p className="text-primary">
          GTM: {process.env.REACT_APP_GOOGLE_ANALYTICS}
        </p>
      </header>
      <main>
        <EthersProviderTest />
      </main>
    </div>
  );
}

export default App;
