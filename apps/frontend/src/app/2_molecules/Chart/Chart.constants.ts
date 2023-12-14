export const PRIMARY_COLOR = '#2C303B';
export const TEXT_COLOR = '#f5f5f5';
export const BORDER_COLOR = '#484D59';
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
    ctx.fillStyle = options.color || '#2C303B';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};
