import React from "react";
import { MoonLoader } from "react-spinners";
import { ChatMessage } from "../../store/chat-store";
import { Separator } from "../ui/separator";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { cn } from "../../lib/utils";

type ChatSearchListProps = {
  loading: boolean;
  chats: ChatMessage[];
  open: boolean;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export const ChatSearchList = ({
  loading,
  chats,
  setValue,
  open,
}: ChatSearchListProps) => {
  const onClickChat = (chatId: string) => {
    setValue("");
    const chatElement = document.getElementById(chatId);

    chatElement?.scrollIntoView({ behavior: "smooth", block: "center" });

    chatElement?.classList.add("focused-chat");

    setTimeout(() => {
      chatElement?.classList.remove("focused-chat");
    }, 1000);
  };
  return (
    <>
      <div
        className={cn(
          "w-full  border border-black/10 rounded-lg mt-2 bg-white text-black flex items-center justify-center flex-col absolute z-[100]",
          !open && "hidden "
        )}
      >
        {loading ? (
          <MoonLoader color="#000000" size={16} />
        ) : chats.length === 0 ? (
          <p className="text-sm font-medium p-8">No such Chat exist</p>
        ) : (
          chats.map((chat) => (
            <>
              <div
                onClick={() => onClickChat(chat.id)}
                role="button"
                key={chat.id}
                className="w-full flex items-center justify-between hover:cursor-pointer hover:bg-indigo-50  p-2"
              >
                <p
                  key={chat.id}
                  className="truncate w-[70%] font-medium text-sm"
                >
                  {chat.message}{" "}
                </p>
                <p key={chat.id} className="text-black/60  font-medium text-sm">
                  {chat.createdAt}{" "}
                </p>
                <FaArrowRightFromBracket className="text-black/60 h-4 w-4" />
              </div>
              <Separator className="text-black last:hidden" />
            </>
          ))
        )}
      </div>
    </>
  );
};
