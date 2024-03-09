"use client";

import React from "react";
import data from "../docs.json";

type Props = {
  activeTab: string;
  setActiveTab: (id: string) => void;
};

export default function Sidebar({ activeTab, setActiveTab }: Props) {
  // Transform the JSON keys into an array of sections
  const sections = Object.keys(data).map((key) => ({
    id: key,
    ...data[key as keyof typeof data],
  }));

  return (
    <div className="menu text-lg rounded-box mt-16">
      {sections.reverse().map((section) => (
        <li
          key={section.id}
          onClick={() => {
            setActiveTab(section.title.replaceAll(" ", ""));
          }}
        >
          <a
            className={`${
              activeTab === section.title.replaceAll(" ", "") && "active"
            }`}
          >
            {section.title}
          </a>
        </li>
      ))}
    </div>
  );
}
