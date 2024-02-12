import React from "react";

import { ChatMessage } from "../../store/chat-store";
import { useUser } from "@clerk/nextjs";
import { ChatDropDown } from "./chat-dropdown";

type ChatMessageProps = {
  chats: ChatMessage[];
};

export const ChatMessageBox = ({ chats }: ChatMessageProps) => {
  const { user } = useUser();

  return (
    <div className="h-full pt-4 space-y-4 flex flex-col">
      {user?.id &&
        chats.map((chat, i) =>
          chat.senderId === user?.id ? (
            <Message
              key={i}
              model={{
                id: chat.id,
                message: chat.message,
                sentTime: "just now",
                sender: chat.sender,
                direction: "outgoing",
                time: chat.createdAt,
                edited: chat.isEdited,
                deleted: chat.isDeleted,
              }}
            />
          ) : (
            <Message
              key={i}
              model={{
                id: chat.id,
                message: chat.message,
                sentTime: "just now",
                sender: chat.sender,
                direction: "incoming",
                time: chat.createdAt,
                edited: chat.isEdited,
                deleted: chat.isDeleted,
              }}
            />
          )
        )}
    </div>
  );
};

function Message({
  model,
}: {
  model: {
    message: string;
    sentTime: string;
    sender: string;
    direction: "outgoing" | "incoming";
    time: string;
    edited?: boolean;
    deleted?: boolean;
    id: string;
  };
}) {
  if (model.direction === "outgoing") {
    return (
      <div className="self-end flex flex-col ">
        <div className="px-1 self-end pb-1">
          <p className="text-sm  font-semibold text-black/55">@me</p>
        </div>
        <div className="bg-[#CCE1E4] rounded-xl border border-black/20 relative">
          {model.edited && (
            <div className="w-full bg-black/60 px-2 py-1 rounded-lg rounded-b-none ">
              <p className="text-xs font-medium text-white ">edited</p>
            </div>
          )}
          <p className="text-base p-4 font-medium text-black/80 max-w-[400px]">
            {model.message}
          </p>
          {!model.deleted && (
            <div className="absolute top-0 left-[-20px]">
              <ChatDropDown text={model.message} chatId={model.id} />
            </div>
          )}
        </div>
        <div className="self-end pt-1">
          <p className="text-xs italic font-semibold text-black/55">
            {model.time}
          </p>
        </div>
      </div>
    );
  }
  if (model.direction === "incoming") {
    return (
      <div className="self-start">
        <div className="px-1 pb-1">
          <p className="text-sm  font-semibold text-black/55">
            @{model.sender}
          </p>
        </div>
        <div className="bg-[#F4F8F9]  rounded-xl border border-black/20  relative">
          {model.edited && (
            <div className="w-full bg-black/60 px-2 py-1 rounded-lg rounded-b-none ">
              <p className="text-xs font-medium text-white ">edited</p>
            </div>
          )}
          <p className="text-base p-4 font-medium text-black/80 max-w-[400px]">
            {model.message}
          </p>
          {!model.deleted && (
            <div className="absolute top-0 right-[-20px]">
              <ChatDropDown text={model.message} chatId={model.id} />
            </div>
          )}
        </div>
        <div className="flex justify-start  pt-1 gap-4">
          <p className="text-xs italic font-semibold text-black/55">
            {model.time}
          </p>
        </div>
      </div>
    );
  }
}
