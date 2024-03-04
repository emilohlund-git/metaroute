"use client";

import { useEffect } from "react";

export default function ScrollToAnchor({ offset = 100 }) {
  useEffect(() => {
    const hash = localStorage.getItem("scrollTo");
    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: "smooth",
        });
      }

      localStorage.removeItem("scrollTo");
    }
  }, [offset]);

  return null;
}
