import Link from "next/link";
import "./globals.css";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center">
        <img
          className="select-none"
          src="/metaroute-logo.png"
          alt="Next.js Logo"
          width={360}
        />

        <div className="flex gap-x-4">
          <Link href="docs">
            <button className="btn btn-outline btn-secondary">
              Documentation
            </button>
          </Link>
          <Link
            href="https://github.com/emilohlund-git/metaroute"
            target="_blank"
          >
            <button className="btn btn-outline btn-accent">
              <FaGithub className="text-xl" />
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
