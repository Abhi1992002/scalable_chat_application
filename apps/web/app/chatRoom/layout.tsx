"use client";
import React, { useEffect } from "react";
import { Sidebar } from "../../components/chat/sidebar";
import { MobileSidebar } from "../../components/chat/mobile-sidebar";
import { SocketProvider } from "../../context/socketProvider";
import { getAllMessages } from "../../actions/getAllMessages";
import { toast } from "react-hot-toast";
import { useRecoilState, useSetRecoilState } from "recoil";
import { chatsState } from "../../store/chat-store";
import { useUser } from "@clerk/nextjs";
import { formatTime } from "../../lib/time";
type ChatLayoutProps = {
  children: React.ReactNode;
};

const ChatLayout = ({ children }: ChatLayoutProps) => {
  const [chats, setChats] = useRecoilState(chatsState);
  const { user } = useUser();
  useEffect(() => {
    if (user) {
      getAllMessages()
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.messages) {
            const messages = data.messages;
            messages.forEach((message) => {
              const currentTime = new Date();
              const currentTimeInMilliseconds = currentTime.getTime();
              const messageCreatedAtInMilliseconds =
                message.createdAt.getTime();

              const differenceInMilliseconds = Math.abs(
                currentTimeInMilliseconds - messageCreatedAtInMilliseconds
              );
              const differenceInSeconds = Math.floor(
                differenceInMilliseconds / 1000
              );

              const time = formatTime(differenceInSeconds);
              if (user.id === message.recieverId) {
                setChats((prevChats) => ({
                  ...prevChats,
                  [message.senderId]: [
                    ...(prevChats[message.senderId] || []),
                    {
                      id: message.id,
                      message: message.text,
                      sender: message.sender,
                      reciever: message.reciever,
                      recieverId: message.recieverId!,
                      senderId: message.senderId,
                      isEdited: message.isEdited!,
                      isDeleted: message.isDeleted!,
                      createdAt: time,
                    },
                  ],
                }));
              }
              if (user.id === message.senderId) {
                setChats((prevChats) => ({
                  ...prevChats,
                  [message.recieverId!]: [
                    ...(prevChats[message.recieverId!] || []),
                    {
                      id: message.id,
                      message: message.text,
                      sender: message.sender,
                      reciever: message.reciever,
                      recieverId: message.recieverId!,
                      senderId: message.senderId,
                      isEdited: message.isEdited!,
                      isDeleted: message.isDeleted!,
                      createdAt: time,
                    },
                  ],
                }));
              }
            });
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  }, [user]);
  return (
    <div className="flex h-screen w-screen overflow-hidden text-black bg-white">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="block md:hidden absolute top-2 left-2">
        <MobileSidebar />
      </div>
      <SocketProvider>
        <div className="w-full md:w-[calc(100vw-400px)]">{children}</div>
      </SocketProvider>
    </div>
  );
};

export default ChatLayout;
