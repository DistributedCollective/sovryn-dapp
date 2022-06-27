import React, { FC } from 'react';

type ButtonProps = {
  className?: string;
};

export const Button: FC<ButtonProps> = ({ className }) => {
  return <button className={className || 'bg-warning-25'}>Boop</button>;
};
