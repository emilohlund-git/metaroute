"use client";

import { SyntheticEvent } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
};

export default function SmoothScrollLink({ href, children }: Props) {
  const [path, hash] = href.split("#");

  const handleClick = (event: SyntheticEvent) => {
    if (window.location.pathname === path) {
      event.preventDefault();

      const target = document.getElementById(href.split("#")[1]);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100, // adjust the offset here
          behavior: "smooth",
        });

        history?.pushState(null, "", href);
      }
    } else {
      localStorage.setItem("scrollTo", hash);
    }
  };

  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  );
}
