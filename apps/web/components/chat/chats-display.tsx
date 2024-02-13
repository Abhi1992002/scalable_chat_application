"use client";
import React, { useEffect, useRef } from "react";
import { ChatMessage } from "../../store/chat-store";
import { ChatMessageBox } from "./chat-message";

type ChatDisplayProps = {
  chats: ChatMessage[];
};

export const ChatDisplay = ({ chats }: ChatDisplayProps) => {
  const scrollableContainerRef = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTo({
        top: scrollableContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chats]);

  return (
    <div
      className="h-full overflow-auto scrollable-container py-4 "
      ref={scrollableContainerRef}
    >
      <ChatMessageBox chats={chats} />
    </div>
  );
};
