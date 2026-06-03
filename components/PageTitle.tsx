import React from "react";

type Props = {
  title: string;
  subtitle: string;
};

function PageTitle(props: Props) {
  return (
    <div className="flex flex-col text-center p-2 bg-card-alt rounded-lg">
      <h2 className="section-heading text-secondary">{props.title}</h2>
      <p className="text-sm text-secondary opacity-60">{props.subtitle}</p>
    </div>
  );
}

export default PageTitle;
