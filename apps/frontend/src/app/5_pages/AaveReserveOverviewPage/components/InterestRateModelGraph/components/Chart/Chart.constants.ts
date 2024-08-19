export const PRIMARY_COLOR = '#2C303B';
export const TEXT_COLOR = '#f5f5f5';
export const LINE_COLOR = '#f58c31';
export const BORDER_COLOR = '#484D59';
export const TICK_COLOR = '#b6bac1';
export const GRID_COLOR = 'rgb(72 77 89)';
export const FONT_FAMILY = 'Roboto';
export const FONT_SIZE = 12;
export const FONT_WEIGHT = '500';
export const DASH_GRID_TYPE = 'dash';

export const CUSTOM_CANVAS_BACKGROUND_COLOR = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#1e2128';
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
