import React from "react";

type ChatRoomProps = {};

const ChatRoom = ({}: ChatRoomProps) => {
  return (
    <div className="w-full h-screen bg-[#F0F0F0] text-black flex items-center justify-center">
      <p className="text-4xl text-black/60">
        Please Choose one of your friends to Chat
      </p>
    </div>
  );
};

export default ChatRoom;
