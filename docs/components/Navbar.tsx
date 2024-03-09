"use client";

import Link from "next/link";
import { FaGithub, FaHamburger } from "react-icons/fa";
import DocsVersionDropdown from "./DocsVersionDropdown";
import { useDrawer } from "@/context/DrawerProvider";
import { RxCross2 } from "react-icons/rx";
import { DocsSearch } from "./DocsSearch";
import { useRouter } from "next/navigation";

type Props = {
  versions: {
    name: string;
    url: string;
  }[];
  setActiveTab: {
    (id: string): void;
  };
};

export default function Navbar({ versions, setActiveTab }: Props) {
  const router = useRouter();
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
          <span
            onClick={() => router.push("/")}
            className="btn btn-ghost cursor-default text-xl font-extrabold items-center"
          >
            <img className="w-5" src="/favicon-32x32.png" alt="" />
            MetaRoute
          </span>
          <DocsVersionDropdown versions={versions} />
          <div className="badge badge-error badge-outline mt-[1px] truncate">
            Under development
          </div>
          <DocsSearch setActiveTab={setActiveTab} />
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
