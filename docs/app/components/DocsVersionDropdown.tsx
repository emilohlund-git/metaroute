"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DocsVersionDropdown() {
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState("v1");
  const [url, setUrl] = useState("");

  useEffect(() => {
    setLoading(true);

    fetch(
      "https://api.github.com/repos/emilohlund-git/metaroute/releases/latest"
    )
      .then((response) => response.json())
      .then((data) => {
        setVersion(data.tag_name);
        setUrl(data.html_url);
        setLoading(false);
      });
  }, []);

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <div className="badge badge-outline cursor-pointer select-none">
        {loading ? (
          <span className="loading loading-spinner w-3"></span>
        ) : (
          version
        )}
      </div>
    </Link>
  );
}
