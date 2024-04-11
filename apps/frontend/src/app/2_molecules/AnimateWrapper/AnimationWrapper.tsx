import React from 'react';

export interface AnimateWrapperProps {
  children: React.ReactNode;
  animationName?: string;
}
export const AnimationWrapper: React.FC<AnimateWrapperProps> = ({
  children,
  animationName = 'animate-fade-in',
}) => {
  return <div className={animationName}>{children}</div>;
};
