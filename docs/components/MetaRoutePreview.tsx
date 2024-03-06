"use client";

export function MetaRoutePreview() {
  return (
    <iframe
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
    >
    </iframe>
  );
}
