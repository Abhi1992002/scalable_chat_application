import React from "react";
import { ChatPage } from "../../../components/chat/chat-page";

type ChatRoomProps = {
  params: {
    chatId: string;
  };
};

const ChatRoom = ({ params }: ChatRoomProps) => {
  return (
    <div className="w-full h-full bg-black p-4">
      <ChatPage chatId={params.chatId} />
    </div>
  );
};

export default ChatRoom;
