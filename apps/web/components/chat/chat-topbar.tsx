import React from "react";
import { UserAvatar } from "./user-avatar";

type ChatTopbarProps = {
  userImg: string;
  username: string;
};

export const ChatTopbar = ({ userImg, username }: ChatTopbarProps) => {
  return (
    <div className="w-full h-full flex items-center">
      <div className="flex items-center space-x-4">
        <UserAvatar userImg={userImg} />
        <p>{username}</p>
      </div>
    </div>
  );
};
