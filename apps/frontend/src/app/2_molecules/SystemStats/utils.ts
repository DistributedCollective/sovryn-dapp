export const calculateCollateralRatio = (
  collateral: string,
  debt: string,
  price: string,
) => (((Number(collateral) * Number(price)) / Number(debt)) * 100).toFixed(2);
