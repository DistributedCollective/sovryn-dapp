import React from 'react';
import { Button, Lead } from '@sovryn/ui/src';
import styles from './index.module.css';

function App() {
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
      </header>
    </div>
  );
}

export default App;
