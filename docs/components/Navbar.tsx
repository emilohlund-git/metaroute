import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  return (
    <div className="navbar bg-base-content text-base-300 fixed z-20 px-6">
      <div className="navbar-start">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl font-extrabold">MetaRoute</a>
        </div>
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <Link href="https://github.com/emilohlund-git/metaroute" target="_blank">
            <FaGithub className="text-xl" />
          </Link>
        </button>
      </div>
    </div>
  );
}
