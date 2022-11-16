import type { LottieComponentProps } from 'lottie-react';

import { animationMap } from './animation-map';

export type LottieAnimation = keyof typeof animationMap;

export type LottieProps = Omit<LottieComponentProps, 'animationData'> & {
  animation: LottieAnimation;
};
