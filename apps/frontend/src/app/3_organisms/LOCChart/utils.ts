export const chartConfig = {
  defaultFont: 'Roboto',
  fontColor: '#F5F5F5',
  defaultColor: '#484D59',
  activeColor: '#F57118',
  borderColor: '#16171C',
  weight: '500',
  tickSize: 12,
  tickPadding: 16,
  tickLength: 6,
  lineWidth: 1,
  fontSize: 12,
  tooltipPadding: 12,
  caretSize: 10,
  legendBoxWidth: 12,
  legendLineWidth: 0,
  tooltipLineHeight: 1.5,
  tooltipBorderRadius: 4,
  minValue: 7,
  maxValue: 21,
};

export const calculateRedemptionBuffer = (
  debt: number,
  collateral: number,
  collateralRatio: number,
  price: string,
) => {
  const collateralRatioValue = (collateralRatio + 0.01) / 100; //user’s CR + 0.01%
  const minimumLOCRedemption =
    debt - (collateral * Number(price)) / collateralRatioValue;
  return minimumLOCRedemption;
};
