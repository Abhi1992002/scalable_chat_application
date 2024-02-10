"use client";
import React, { useEffect, useState } from "react";
import { getAllMyFriends } from "../../actions/getAllMyFriends";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../../lib/utils";

type FriendsListProps = {};

type listType = ({
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  profileImage: string | null;
} | null)[];

export const FriendsList = ({}: FriendsListProps) => {
  const [lists, setList] = useState<listType>();
  const router = useRouter();
  const chatId = usePathname().split("/")[2];

  useEffect(() => {
    getAllMyFriends().then((data) => {
      if (data.list) {
        setList(data.list);
      }
    });
    console.log(chatId);
  }, []);

  const openChat = (id: string) => {
    router.push(`/chatRoom/${id}`);
  };

  return (
    <div className="flex flex-col mt-4 space-y-2">
      {lists?.map((list) => (
        <div
          key={list?.id}
          className={cn(
            "bg-transparent w-full p-4 hover:bg-white/20 rounded-xl hover:cursor-pointer border-b border-white/40",
            chatId === list?.id && "bg-white/40"
          )}
          role="button"
          onClick={() => openChat(list?.id!)}
        >
          <p key={list?.id}>{list?.username}</p>{" "}
        </div>
      ))}
    </div>
  );
};
