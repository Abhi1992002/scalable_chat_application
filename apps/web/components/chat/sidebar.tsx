import React from "react";
import { FriendForm } from "./friend-form";
import { FriendsList } from "./friendList";

type SidebarProps = {};

export const Sidebar = ({}: SidebarProps) => {
  return (
    <div className="bg-[#F4F8F9] w-[400px] h-full  flex items-center justify-center ">
      <div className="w-full h-full  border border-black/20 shadow-xl shadow-black/40">
        <div className="p-4 border-b border-black/20">
          <FriendForm />
        </div>
        <div>
          <FriendsList />
        </div>
      </div>
    </div>
  );
};
