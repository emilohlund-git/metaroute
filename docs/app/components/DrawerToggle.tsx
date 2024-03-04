"use client";

import { FaHamburger } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useAppDispatch, useAppSelector } from "../store";
import { setOpen } from "../store/slices/drawerSlice";

export default function DrawerToggle() {
  const drawerState = useAppSelector((state) => state.drawer);
  const dispatch = useAppDispatch();

  const toggleDrawer = () => {
    dispatch(setOpen(!drawerState));
  };

  return (
    <label className="swap swap-rotate text-lg">
      <input type="checkbox" onChange={toggleDrawer} />
      <span className="swap-off">
        <RxCross2 />
      </span>
      <span className="swap-on">
        <FaHamburger />
      </span>
    </label>
  );
}
