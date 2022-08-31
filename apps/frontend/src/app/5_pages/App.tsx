import React from "react";
import { Button, Lead } from "@sovryn/ui";
import styles from "./index.module.css";
import { AppTheme } from "../../types/tailwind";
import { useTheme } from "../../hooks/useTheme";

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
        <Button className="p-3" />
        <Button />
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
      </header>
    </div>
  );
}

export default App;
