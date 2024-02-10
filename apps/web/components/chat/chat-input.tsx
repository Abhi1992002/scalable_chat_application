import React, { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IoMdSend } from "react-icons/io";
import { useSocket } from "../../context/SocketProvider";

type ChatInputProps = {
  reciever: string;
  sender: string;
  recieverId: string;
};

export const ChatInput = ({ reciever, sender, recieverId }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const { sendMessage } = useSocket();
  return (
    <div className="flex items-center h-full w-full">
      <div className="flex w-full gap-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-white/40 placeholder:text-white/40"
          placeholder="Write your message here"
        />
        <Button
          variant={"secondary"}
          onClick={() => {
            sendMessage(message, reciever, sender, recieverId);
          }}
        >
          <IoMdSend />
        </Button>
      </div>
    </div>
  );
};
