import '../styles/index.css';

const screens = {
  xs: '320px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  '2xl': '1536px',
  '3xl': '1854px',
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // values of tailwind
  backgrounds: {
    default: 'gray-1',
    values: [
      {
        name: 'black',
        value: '#000000',
      },
      {
        name: 'gray-1',
        value: '#161616',
      },
      {
        name: 'gray-2',
        value: '#1f1f1f',
      },
      {
        name: 'gray-3',
        value: '#2c2c2c',
      },
      {
        name: 'gray-4',
        value: '#343434',
      },
      {
        name: 'gray-5',
        value: '#484848',
      },
    ],
  },
  viewport: {
    viewports: Object.entries(screens).map(([viewport, width]) => ({
      name: viewport,
      styles: {
        width,
        height: '100%',
      },
    })),
  },
  layout: 'fullscreen',
  options: {
    storySort: {
      order: [
        'Design Guide',
        'Atoms',
        'Molecules',
        'Organisms',
        'Views',
        'Pages',
      ],
    },
  },
}
