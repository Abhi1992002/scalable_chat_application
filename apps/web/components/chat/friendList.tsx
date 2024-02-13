"use client";
import React, { useEffect, useState } from "react";
import { getAllMyFriends } from "../../actions/getAllMyFriends";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import { UserAvatar } from "./user-avatar";
import { formatTime } from "../../lib/time";
import { useRecoilState, useRecoilValue } from "recoil";
import { onlineState } from "../../store/online-store";
import { friendState } from "../../store/friend-store";
import { typingState } from "../../store/typing-store";

type FriendsListProps = {};

export const FriendsList = ({}: FriendsListProps) => {
  const [lists, setList] = useRecoilState(friendState);
  const router = useRouter();
  const chatId = usePathname().split("/")[2];
  const online = useRecoilValue(onlineState);
  const typing = useRecoilValue(typingState);

  const currentTime = new Date();
  useEffect(() => {
    getAllMyFriends().then((data) => {
      if (data.list) {
        setList(data.list);
      }
    });
  }, []);

  const openChat = (id: string) => {
    router.push(`/chatRoom/${id}`);
  };

  return (
    <div className="flex flex-col">
      {lists?.map((list) => (
        <div
          key={list?.friend?.id}
          className={cn(
            "bg-transparent w-full p-4 pt-6 hover:bg-black/10  hover:cursor-pointer border-b",
            chatId === list?.friend?.id && "bg-black/10"
          )}
          role="button"
          onClick={() => openChat(list?.friend?.id!)}
        >
          <div className="flex items-center gap-4">
            {list?.friend?.profileImage && (
              <UserAvatar userImg={list?.friend.profileImage} />
            )}
            <div className="flex-1">
              <p className="text-lg font-bold">@{list?.friend?.username}</p>
              <p className="text-sm font-medium text-black/60">
                {online[list.friend?.id!] ? (
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
            {list.latestMessage?.createdAt && (
              <p className="text-sm font-medium text-black/60">
                {formatTime(
                  Math.floor(
                    currentTime.getTime() -
                      list.latestMessage?.createdAt.getTime()
                  ) / 1000
                )}
              </p>
            )}
          </div>
          <div className="flex items-center mt-4">
            {typing[list.friend?.id!] ? (
              <p>typing...</p>
            ) : list.latestMessage ? (
              <p className="text-sm font-medium text-black/60">
                {list.latestMessage?.text.slice(0, 70)}

                {list.latestMessage.text.length >= 70 && <span>...</span>}
              </p>
            ) : (
              <p className="text-sm font-medium text-black/60">
                Start your coverstion with
                <span className="text-black"> @{list.friend?.username}</span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
