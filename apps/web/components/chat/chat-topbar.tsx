import React from "react";
import { UserAvatar } from "./user-avatar";
import { useRecoilValue } from "recoil";
import { onlineState } from "../../store/online-store";
import { ChatSearch } from "./chat-search";
import { TopbarDropDown } from "./topbar-dropdown";

type ChatTopbarProps = {
  userImg: string;
  username: string;
  userId: string;
};

export const ChatTopbar = ({ userImg, username, userId }: ChatTopbarProps) => {
  const online = useRecoilValue(onlineState);
  return (
    <div className="w-full h-full flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {userImg && <UserAvatar userImg={userImg} />}
        <div className="flex-1">
          <p className=" font-bold">{username}</p>
          <p className="text-sm font-medium text-black/60">
            {online[userId] ? (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" /> online
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" /> offline
              </div>
            )}
          </p>
        </div>
      </div>
      <div className="w-[250px]">
        <ChatSearch />
      </div>
      <div className="mr-4">
        <TopbarDropDown friendId={userId} />
      </div>
    </div>
  );
};
