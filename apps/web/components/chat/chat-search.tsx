import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { ChatSearchList } from "./chat-seach-list";
import { usePathname } from "next/navigation";
import { useRecoilValue } from "recoil";
import { ChatMessage, chatsState } from "../../store/chat-store";

type ChatSearchProps = {};

export const ChatSearch = ({}: ChatSearchProps) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const id = usePathname().split("/")[2];
  const chatState = useRecoilValue(chatsState);
  const [chats, setChats] = useState<ChatMessage[]>();
  const [open, setOpen] = useState(false);

  const searchChats = () => {
    setLoading(false);
    const allChats = chatState[id!];
    const searchedChats = allChats?.filter((chats) =>
      chats.message.includes(value)
    );
    setChats(searchedChats?.slice(0, 6));
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setOpen(false);
    }, 165); // Adjust this delay as needed
  };

  return (
    <>
      <div className="w-full relative right-5">
        <Input
          type="text"
          onBlur={handleInputBlur}
          onFocus={() => {
            if (value) {
              setOpen(true);
            }
          }}
          placeholder="Search Chats"
          value={value}
          className="placeholder:text-black/40 border border-black/40"
          onChange={(e) => {
            setOpen(true);
            setLoading(true);
            setValue(e.target.value);
            searchChats();
          }}
        />
        {value && chats && (
          <ChatSearchList
            setValue={setValue}
            open={open}
            chats={chats}
            loading={loading}
          />
        )}
      </div>
    </>
  );
};
