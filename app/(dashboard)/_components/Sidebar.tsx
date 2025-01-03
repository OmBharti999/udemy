import React from "react";
import { Logo } from "./Logo";
import { SidebarRoutes } from "./SidebarRoutes";

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="">
        <SidebarRoutes />
      </div>
    </div>
  );
};