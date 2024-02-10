"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Socket, io } from "socket.io-client";
import { chatsState } from "../store/chat-store";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (
    msg: string,
    reciever: string,
    sender: string,
    recieverId: string
  ) => any;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`State is undefined`);

  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const setChatDetail = useSetRecoilState(chatsState);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg, reciever, sender, recieverId) => {
      socket?.emit("event:message", {
        message: msg,
        reciever: reciever,
        sender: sender,
        recieverId: recieverId,
      });
    },
    [socket]
  );

  const onMessageRec = useCallback((msg: string) => {
    const { message, reciever, sender } = JSON.parse(msg);
    setChatDetail((chats) => ({ ...chats }));
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("message", onMessageRec);
    setSocket(_socket);
    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageRec);
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
