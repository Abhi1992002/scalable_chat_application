import React from "react";
import { FriendForm } from "./friend-form";
import { FriendsList } from "./friendList";

type SidebarProps = {};

export const Sidebar = ({}: SidebarProps) => {
  return (
    <div className="bg-black w-[400px] h-full  flex items-center justify-center">
      <div className="w-[95%] h-[95%] p-4 border border-white/40 rounded-xl">
        <FriendForm />
        <FriendsList />
      </div>
    </div>
  );
};
