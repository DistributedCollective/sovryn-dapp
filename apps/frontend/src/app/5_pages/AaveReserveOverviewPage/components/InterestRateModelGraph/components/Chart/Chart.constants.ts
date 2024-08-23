import { theme } from '@sovryn/tailwindcss-config';

export const GRID_COLOR = '#484d59';
export const TICK_COLOR = '#b6bac1';
const SM_BREAKPOINT = parseInt(theme.screens.sm, 10) || 576;

export const CUSTOM_CANVAS_BACKGROUND_COLOR = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, options) => {
    const { ctx } = chart;
    const windowWidth = window.innerWidth;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    if (windowWidth < SM_BREAKPOINT) {
      ctx.fillStyle = theme.colors['gray-90'];
    } else {
      ctx.fillStyle = theme.colors['gray-80'];
    }
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

export const harcodedData = {
  values: [
    { x: 0, y: 0 }, // Start of the curve
    { x: 10, y: 1 }, // Small increase
    { x: 20, y: 2 }, // Gradual increase
    { x: 30, y: 3 }, // Gradual increase
    { x: 40, y: 5 }, // Gradual increase
    { x: 60, y: 9 }, // Steeper increase
    { x: 92, y: 15 }, // Significant rise, matching the 78.64% mark
    { x: 100, y: 100 }, // Sharp rise at the 92% mark
  ],
  annotations: {
    current: [
      { x: 78.64, y: 0 },
      { x: 78.64, y: 50 }, // Point at the origin for the line to the x-axis
    ],
    optimal: [
      { x: 92, y: 0 },
      { x: 92, y: 70 }, // Point at the origin for the line to the x-axis
    ],
  },
};
