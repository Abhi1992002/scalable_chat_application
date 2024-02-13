import React, { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { IoMdSend } from "react-icons/io";
import { useSocket } from "../../context/socketProvider";

type ChatInputProps = {
  reciever: string;
  sender: string;
  recieverId: string;
};

export const ChatInput = ({ reciever, sender, recieverId }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { sendMessage, onFocus, onblur } = useSocket();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault();
        setMessage("");
        sendMessage(message, reciever, sender, recieverId);
      }
    }
  };

  return (
    <div className="flex items-center h-full w-full">
      <div className="flex w-full gap-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => onFocus()}
          onBlur={() => onblur()}
          onKeyDown={(e) => handleKeyDown(e)}
          className="border border-neutral-300 placeholder:text-black/40 bg-white min-h-[100px] placeholder:font-semibold "
          placeholder="Enter to send. Shift + Enter to add new line"
        />
      </div>
    </div>
  );
};
