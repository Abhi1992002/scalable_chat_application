"use client";
import React, { useEffect, useState } from "react";
import { ChatTopbar } from "./chat-topbar";
import { getUserDetails } from "../../actions/getUserDetails";
import { toast } from "react-hot-toast";
import { User } from "db";
import { ChatInput } from "./chat-input";
import { useCurrentUser } from "../../hooks/useCurrentUser";
type ChatPageProps = {
  chatId: string;
};

export const ChatPage = ({ chatId }: ChatPageProps) => {
  const [userDetail, setUserDetail] = useState<User>();

  const { me } = useCurrentUser();
  useEffect(() => {
    getUserDetails(chatId).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.detail) {
        setUserDetail(data.detail);
      }
    });
  }, []);
  return (
    <div className="w-full h-full flex flex-col">
      {/* Topbar */}
      <div className="w-full h-[60px] border-b border-white/40">
        {userDetail?.profileImage && userDetail.username && (
          <ChatTopbar
            userImg={userDetail?.profileImage}
            username={userDetail.username}
          />
        )}
      </div>
      {/* desiplay */}
      <div className="w-full flex-1 "></div>
      {/* input */}
      <div className="w-full p-6 border-t border-white/40">
        {userDetail?.username && me?.username && (
          <ChatInput
            reciever={userDetail?.username}
            sender={me?.username}
            recieverId={userDetail.id}
          />
        )}
      </div>
    </div>
  );
};
