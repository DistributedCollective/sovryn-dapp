/// <reference types="react-scripts" />
/// <reference types="@welldone-software/why-did-you-render" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_CHAIN_ID: string;
  }
}
