export const PRIMARY_COLOR = '#2C303B';
export const TEXT_COLOR = '#f5f5f5';
export const LINE_COLOR = '#f58c31';
export const TICK_COLOR = '#b6bac1';
export const BORDER_COLOR = '#484D59';
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

export const harcodedData = [
  { x: '2023-06-15T00:00:00Z', y: 2.5 },
  { x: '2023-06-16T00:00:00Z', y: 2.6 },
  { x: '2023-06-17T00:00:00Z', y: 2.7 },
  { x: '2023-06-18T00:00:00Z', y: 2.7 },
  { x: '2023-06-19T00:00:00Z', y: 2.8 },
  { x: '2023-06-20T00:00:00Z', y: 2.9 },
  { x: '2023-06-21T00:00:00Z', y: 3.0 },
  { x: '2023-06-22T00:00:00Z', y: 3.0 },
  { x: '2023-06-23T00:00:00Z', y: 3.1 },
  { x: '2023-06-24T00:00:00Z', y: 3.1 },
  { x: '2023-06-25T00:00:00Z', y: 3.2 },
  { x: '2023-06-26T00:00:00Z', y: 3.3 },
  { x: '2023-06-27T00:00:00Z', y: 3.4 },
  { x: '2023-06-28T00:00:00Z', y: 3.5 },
  { x: '2023-06-29T00:00:00Z', y: 3.7 },
  { x: '2023-06-30T00:00:00Z', y: 4.0 },
  { x: '2023-07-01T00:00:00Z', y: 4.2 },
  { x: '2023-07-02T00:00:00Z', y: 4.0 },
  { x: '2023-07-03T00:00:00Z', y: 3.9 },
  { x: '2023-07-04T00:00:00Z', y: 3.8 },
  { x: '2023-07-05T00:00:00Z', y: 3.8 },
  { x: '2023-07-06T00:00:00Z', y: 3.7 },
  { x: '2023-07-07T00:00:00Z', y: 3.7 },
  { x: '2023-07-08T00:00:00Z', y: 3.6 },
  { x: '2023-07-09T00:00:00Z', y: 3.6 },
  { x: '2023-07-10T00:00:00Z', y: 3.5 },
  { x: '2023-07-11T00:00:00Z', y: 3.5 },
  { x: '2023-07-12T00:00:00Z', y: 3.5 },
  { x: '2023-07-13T00:00:00Z', y: 3.4 },
  { x: '2023-07-14T00:00:00Z', y: 3.4 },
  { x: '2023-07-15T00:00:00Z', y: 3.3 },
  { x: '2023-07-16T00:00:00Z', y: 3.3 },
  { x: '2023-07-17T00:00:00Z', y: 3.3 },
  { x: '2023-07-18T00:00:00Z', y: 3.3 },
  { x: '2023-07-19T00:00:00Z', y: 3.3 },
  { x: '2023-07-20T00:00:00Z', y: 3.2 },
  { x: '2023-07-21T00:00:00Z', y: 3.2 },
  { x: '2023-07-22T00:00:00Z', y: 3.2 },
  { x: '2023-07-23T00:00:00Z', y: 3.2 },
  { x: '2023-07-24T00:00:00Z', y: 3.2 },
  { x: '2023-07-25T00:00:00Z', y: 3.2 },
  { x: '2023-07-26T00:00:00Z', y: 3.1 },
  { x: '2023-07-27T00:00:00Z', y: 3.1 },
  { x: '2023-07-28T00:00:00Z', y: 3.1 },
  { x: '2023-07-29T00:00:00Z', y: 3.1 },
  { x: '2023-07-30T00:00:00Z', y: 3.1 },
  { x: '2023-07-31T00:00:00Z', y: 3.1 },
];
