import "../styles/index.css";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@sovryn/tailwindcss-config/index";
import { MemoryRouter } from "react-router-dom";

const config = resolveConfig(tailwindConfig);

const screens = {
  xs: "320px",
  ...config.theme.screens,
};

export const decorators = [
  (Story) => (
    <MemoryRouter>
      <Story />
    </MemoryRouter>
  ),
];

const backgrounds = Object.entries(config.theme.backgroundColor).map(
  ([name, value]) => ({ name, value })
);

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
    default: "gray-1",
    values: backgrounds,
  },
  viewport: {
    viewports: Object.entries(screens).map(([viewport, width]) => ({
      name: viewport,
      styles: {
        width,
        height: "100%",
      },
    })),
  },
  layout: "fullscreen",
  options: {
    storySort: {
      order: [
        "Design Guide",
        "Meta",
        "Atoms",
        "Molecules",
        "Organisms",
        "Views",
        "Pages",
      ],
    },
  },
};
