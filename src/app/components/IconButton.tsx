import * as React from "react";

type Props = {
  // refer to the documentation for options
  // https://github.com/thomas-lowry/figma-plugin-ds#icon
  iconName: string;
  onClick: any; // TODO update
  disabled?: boolean;
  className?: string;
};

export const IconButton = ({
  iconName,
  onClick,
  disabled,
  className,
  ...otherProps
}: Props) => {
  if (disabled) {
    return (
      <div className="icon-button-disabled">
        <div
          className={`icon icon--grey ${iconName} ${
            className != null ? className : ""
          }`}
        ></div>
      </div>
    );
  }

  return (
    <div className="icon-button" onClick={onClick} {...otherProps}>
      <div
        className={`icon ${iconName} ${className != null ? className : ""}`}
      ></div>
    </div>
  );
};
