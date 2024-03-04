"use client";

import Link from "next/link";
import { FaGithub, FaHamburger } from "react-icons/fa";
import DocsVersionDropdown from "./DocsVersionDropdown";
import { useDrawer } from "@/context/DrawerProvider";
import { RxCross2 } from "react-icons/rx";

type Props = {
  versions: {
    name: string;
    url: string;
  }[];
};

export default function Navbar({ versions }: Props) {
  const { isDrawerOpen, setDrawerOpen } = useDrawer();
  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="navbar bg-gradient-to-r from-primary-content to-neutral-800 text-base-300 fixed z-20 px-6">
      <div className="navbar-start">
        <div className="flex-1 flex items-center gap-x-2">
          <label className="swap swap-rotate text-lg">
            <input type="checkbox" onChange={toggleDrawer} />
            <span className="swap-off">
              <RxCross2 />
            </span>
            <span className="swap-on">
              <FaHamburger />
            </span>
          </label>
          <a className="btn btn-ghost cursor-default text-xl font-extrabold">
            MetaRoute
          </a>
          <DocsVersionDropdown versions={versions} />
          <div className="badge badge-error badge-outline mt-[1px]">
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
