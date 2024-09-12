import { theme } from '@sovryn/tailwindcss-config';

export const GRID_COLOR = '#484d59';
export const TICK_COLOR = '#b6bac1';
const SM_BREAKPOINT = parseInt(theme.screens.sm, 10);

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
