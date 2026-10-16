/// <reference types="react-scripts" />
/// <reference types="@welldone-software/why-did-you-render" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_CHAIN_ID: string;
    readonly REACT_APP_ENABLE_SERVICE_WORKER: string;
    readonly REACT_APP_RELEASE_DATA: string;
    readonly REACT_APP_TURNSTILE_SITE_KEY: string;
  }
}
