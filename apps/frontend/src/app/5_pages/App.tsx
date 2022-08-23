import React from 'react';
import { Button, Lead } from '@sovryn/ui';
import styles from './index.module.css';

enum Theme {
  'sovryn' = 'sovryn',
  'dark' = 'dark',
  'light' = 'light',
  'coffee' = 'coffee',
}

function App() {
  const handleThemeChange = (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <div className="my-2 px-4">
      <header>
        <p className={styles.test}>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        <Button className="p-3" />
        <Button />
        <Lead test={false}>abc</Lead>
        <Lead test={true}>def</Lead>

        <div className="flex items-center gap-4">
          <div
            className="cursor-pointer"
            onClick={() => handleThemeChange(Theme.sovryn)}
          >
            Sovryn
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleThemeChange(Theme.dark)}
          >
            Dark
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleThemeChange(Theme.light)}
          >
            Light
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleThemeChange(Theme.coffee)}
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
      </header>
    </div>
  );
}

export default App;
