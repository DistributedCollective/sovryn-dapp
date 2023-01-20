import { loadLiquity } from '../../../utils/liquity';

export const earnPageLoader = async () => {
  const { liquity, provider } = await loadLiquity();
  return { liquity, provider };
};
