"use client";

import { SyntheticEvent } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  id: string;
};

export default function SmoothScrollLink({ href, children, id }: Props) {
  const [path, hash] = href.split("#");

  const handleClick = (event: SyntheticEvent) => {
    if (
      window.location.pathname.replaceAll("/", "") === path.replaceAll("/", "")
    ) {
      event.preventDefault();

      const target = document.getElementById(hash);
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
    <>
      <input
        className="tab hidden"
        type="radio"
        name="tabs"
        role="tab"
        aria-label={`tab-${id}`}
      />
      <a id={id} href={href} onClick={handleClick}>
        {children}
      </a>
    </>
  );
}
