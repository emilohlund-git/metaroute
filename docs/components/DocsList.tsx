import React from "react";

type Props = {
  items: string[];
};

const DocsList = ({ items }: Props) => {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

export default DocsList;
