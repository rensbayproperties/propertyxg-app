import clsx from "clsx";
import React from "react";

const Container = ({
  children,
  className,
  size = "lg",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    xs: "max-w-xl",
    sm: "max-w-screen-md",
    md: "max-w-screen-lg",
    lg: "max-w-screen-xl",
  };

  return (
    <div className={clsx("container mx-auto", sizeClasses[size], className)}>
      {children}
    </div>
  );
};

export default Container;
