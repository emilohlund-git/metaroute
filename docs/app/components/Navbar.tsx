import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import DocsVersionDropdown from "./DocsVersionDropdown";
import DrawerToggle from "./DrawerToggle";

export default function Navbar() {
  return (
    <div className="navbar bg-gradient-to-r from-primary-content to-neutral-800 text-base-300 fixed z-20 px-6">
      <div className="navbar-start">
        <div className="flex-1 flex items-center gap-x-2">
          <DrawerToggle />
          <a className="btn btn-ghost cursor-default text-xl font-extrabold">
            MetaRoute
          </a>
          <DocsVersionDropdown />
          <div className="badge badge-error badge-outline">
            Under development
          </div>
        </div>
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <Link
            href="https://github.com/emilohlund-git/metaroute"
            target="_blank"
          >
            <FaGithub className="text-xl" />
          </Link>
        </button>
      </div>
    </div>
  );
}
