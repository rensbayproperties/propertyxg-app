import clsx from "clsx";
import React from "react";

const Section = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={clsx("py-10", className)}>{children}</div>
    );
};

export default Section;
