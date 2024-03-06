"use client";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { MetaRoutePreview } from "./MetaRoutePreview";
import { useState } from "react";

export function MetaRouteHero() {
  const [showingPreview, setShowingPreview] = useState(true);

  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: "url(splash-art.png)",
      }}
    >
      {showingPreview ? (
        <>
          <div className="hero-overlay bg-opacity-0 backdrop-blur-md"></div>
          <div className="hero-content text-center items-center text-neutral-content -mt-20">
            <div className="w-full flex flex-col items-center">
              <img
                className="select-none"
                src="/metaroute-logo.png"
                alt="Next.js Logo"
                width={360}
              />

              <div className="flex flex-col gap-x-4 justify-center">
                <div className="flex items-center justify-center gap-x-4">
                  <Link href="docs">
                    <button className="btn btn-outline btn-success">
                      Documentation
                    </button>
                  </Link>
                  <Link
                    href="https://github.com/emilohlund-git/metaroute"
                    target="_blank"
                  >
                    <button className="btn btn-outline btn-info">
                      <FaGithub className="text-xl" />
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowingPreview(!showingPreview)}
                    className="btn btn-outline btn-accent"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className={`w-full z-20 flex items-center justify-center transition-all ${
              showingPreview ? "top-0" : "-top-96"
            }`}
          >
            <MetaRoutePreview />
          </div>
          <button
            onClick={() => setShowingPreview(!showingPreview)}
            className="btn btn-accent absolute bottom-2 left-2 z-40"
          >
            Hide preview
          </button>
        </>
      )}
      <div className="mb-16"></div>
    </div>
  );
}
