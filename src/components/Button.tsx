import React from "react";
import classNames from "classnames";
import styles from "./Button.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button className={classNames(styles.button, className)} {...props}>
      {children}
    </button>
  );
}
