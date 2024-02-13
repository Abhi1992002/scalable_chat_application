"use client";
import React, { useEffect, useState } from "react";
import { ChatTopbar } from "./chat-topbar";
import { getUserDetails } from "../../actions/getUserDetails";
import { toast } from "react-hot-toast";
import { User } from "db";
import { ChatInput } from "./chat-input";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useRecoilValue } from "recoil";
import { chatsState } from "../../store/chat-store";
import { ChatDisplay } from "./chats-display";
import { useRouter } from "next/navigation";
type ChatPageProps = {
  chatId: string;
};

export const ChatPage = ({ chatId }: ChatPageProps) => {
  const [userDetail, setUserDetail] = useState<User>();
  const chats = useRecoilValue(chatsState);
  const { me } = useCurrentUser();
  const router = useRouter();
  useEffect(() => {
    getUserDetails(chatId).then((data) => {
      if (data.error) {
        toast.error(data.error);
        router.push("/chatRoom");
      }
      if (data.detail) {
        setUserDetail(data.detail);
      }
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Topbar */}
      <div className="w-full p-[14.5px] bg-[#F0F0F0] border-b border-black/20">
        {userDetail?.profileImage && userDetail.username && (
          <ChatTopbar
            userId={userDetail.id}
            userImg={userDetail?.profileImage}
            username={userDetail.username}
          />
        )}
      </div>
      {/* desiplay */}
      <div className="w-full flex-1 h-[100px] bg-[#F0F0F0] relative">
        {chats && chats[chatId] && <ChatDisplay chats={chats[chatId]!} />}
      </div>
      {/* input */}
      <div className="w-full p-6 bg-[#F0F0F0]">
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
