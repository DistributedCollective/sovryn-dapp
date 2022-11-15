import LottieView from 'lottie-react';
import React, { FC, useEffect, useState } from 'react';
import { animationMap } from './animation-map';
import { LottieProps } from './Lottie.types';

export const Lottie: FC<LottieProps> = ({ animation, ...props }) => {
  const [animationData, setAnimationData] = useState<unknown>();

  useEffect(() => {
    const promise = animationMap[animation as unknown as string];
    if (promise) {
      promise
        .then(data => setAnimationData(data))
        .catch(error => {
          console.error(error);
          setAnimationData(undefined);
        });
    }
  }, [animation]);

  return animationData ? (
    <LottieView animationData={animationData} {...props} />
  ) : null;
};
