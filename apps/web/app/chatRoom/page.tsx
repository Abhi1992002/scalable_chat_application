import React from "react";

import { FriendForm } from "../../components/chat/friend-form";
import { FriendsList } from "../../components/chat/friendList";

type ChatRoomProps = {};

const ChatRoom = ({}: ChatRoomProps) => {
  return (
    <div className="w-full h-screen bg-black text-white flex items-center justify-center">
      <p className="text-4xl text-white/60">
        Please Choose one of your friends to Chat
      </p>
    </div>
  );
};

export default ChatRoom;
