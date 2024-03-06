"use client";

import { useState } from "react";

export function MetaRoutePreview() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center absolute">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-info"></div>
        </div>
      )}
      <iframe
        onLoad={() => setIsLoading(false)}
        className="relative"
        src="https://stackblitz.com/edit/vitejs-vite-nqqhgl?embed=1&file=src%2Fmain.ts&theme=dark"
        style={{
          width: "90%",
          height: "90vh",
          border: 0,
          borderRadius: "4px",
          overflow: "hidden",
        }}
        title="MetaRoute"
        allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
        sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
      ></iframe>
    </>
  );
}
