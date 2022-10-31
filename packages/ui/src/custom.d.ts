declare module '*.css' {
  const content: { [key: string]: any };
  export = content;
}

declare module '*.css';
declare module '*.svg' {
  import React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}
