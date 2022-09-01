import React, { FC } from "react";
import classNames from "classnames";
import styles from "./button.module.css";

type ButtonProps = {
  primary?: boolean;
  size?: "small" | "large";
  label?: string;
  className?: string;
};

export const Button: FC<ButtonProps> = ({
  label,
  primary,
  size,
  className,
}) => {
  return (
    <button
      className={classNames(
        styles.button,
        {
          [styles.primary]: primary,
          [styles.small]: size === "small",
        },
        className
      )}
    >
      {label}
    </button>
  );
};
