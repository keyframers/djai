import React, { type HTMLAttributes } from "react";

import classNames from "classnames";

import styles from "./ContentBox.module.css";

interface ContentBoxProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function ContentBox({ className, ...props }: ContentBoxProps) {
  return <div className={classNames(styles.box, className)} {...props} />;
}
