import React from "react";
import { Sidebar } from "../../components/chat/sidebar";
import { MobileSidebar } from "../../components/chat/mobile-sidebar";

type ChatLayoutProps = {
  children: React.ReactNode;
};

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden text-white">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="block md:hidden absolute top-2 left-2">
        <MobileSidebar />
      </div>

      <div className="w-full md:w-[calc(100vw-400px)]">{children}</div>
    </div>
  );
};

export default ChatLayout;
