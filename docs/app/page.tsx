import Link from "next/link";
import "./globals.css";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: "url(splash-art.png)",
      }}
    >
      <div className="hero-overlay bg-opacity-10"></div>
      <div className="hero-content text-center text-neutral-content -mt-20">
        <div className="max-w-md">
          <img
            className="select-none"
            src="/metaroute-logo.png"
            alt="Next.js Logo"
            width={360}
          />

          <div className="flex gap-x-4 justify-center">
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
          </div>
        </div>
      </div>
    </div>
  );
}
