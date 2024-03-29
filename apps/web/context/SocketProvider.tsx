"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Socket, io } from "socket.io-client";
import { chatsState } from "../store/chat-store";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { onlineState } from "../store/online-store";
interface SocketProviderProps {
  children?: React.ReactNode;
}
import { v4 as uuidv4 } from "uuid";
import { typingState } from "../store/typing-store";
interface ISocketContext {
  sendMessage: (
    msg: string,
    reciever: string,
    sender: string,
    recieverId: string,
    createdAt?: Date | string
  ) => any;
  onFocus: () => void;
  onblur: () => void;
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
  const setOnlineState = useSetRecoilState(onlineState);
  const setTypingState = useSetRecoilState(typingState);
  const { user } = useUser();

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg, reciever, sender, recieverId) => {
      const id = uuidv4();
      if (user?.id) {
        socket?.emit("event:message", {
          id: id,
          message: msg,
          reciever: reciever,
          sender: sender,
          recieverId: recieverId,
          senderId: user?.id,
          createdAt: new Date(),
        });

        setChatDetail((prevChats) => ({
          ...prevChats,
          [recieverId]: [
            ...(prevChats[recieverId] || []),
            {
              id,
              message: msg,
              sender,
              reciever,
              senderId: user?.id,
              recieverId,
              createdAt: "Just now",
              isDeleted: false,
              isEdited: false,
            },
          ],
        }));
      } else {
        toast.error("Please refresh the page");
      }
    },
    [socket]
  );

  const onMessageRec = useCallback((msg: string) => {
    const { message, reciever, sender, senderId, recieverId, id } =
      JSON.parse(msg);
    setChatDetail((prevChats) => ({
      ...prevChats,
      [senderId]: [
        ...(prevChats[senderId] || []),
        {
          id,
          message,
          sender,
          reciever,
          senderId,
          recieverId,
          createdAt: "Just now",
        },
      ],
    }));
  }, []);

  const onFocus = () => {
    console.log("1.) focused by me");
    socket?.emit("typing", user?.id);
  };

  const onblur = () => {
    console.log("5.) blurred by me");
    socket?.emit("not-typing", user?.id);
  };

  useEffect(() => {
    if (user?.id) {
      const _socket = io("http://localhost:8000");

      _socket.on("event:typing", (userId: string) => {
        console.log("6.) focused");
        setTypingState((prevTyping) => ({
          ...prevTyping,
          [userId]: true,
        }));
      });
      _socket.on("event:not-typing", (userId: string) => {
        console.log("7.) blurred");
        setTypingState((prevTyping) => ({
          ...prevTyping,
          [userId]: false,
        }));
      });

      _socket.on("user-joined", (userId: string) => {
        setOnlineState((prevOnlineUsers) => ({
          ...prevOnlineUsers,
          [userId]: true,
        }));
      });
      _socket.on("unjoined", (userId: string) => {
        setOnlineState((prevOnlineUsers) => ({
          ...prevOnlineUsers,
          [userId]: false,
        }));
      });
      _socket.on("initial-state", (data: Record<string, string>) => {
        for (const userId in data) {
          setOnlineState((prevOnlineUsers) => ({
            ...prevOnlineUsers,
            [userId]: true,
          }));
        }
      });
      _socket.on("message", onMessageRec);
      _socket.on("connect", () => {
        _socket.emit("join", user.id);
        _socket.emit("storeUserId", user?.id);
      });

      setSocket(_socket);

      return () => {
        _socket.disconnect();
        _socket.off("message", onMessageRec);
        _socket.off("user-joined");
        _socket.off("unjoined");
        _socket.off("event:typing");
        setSocket(undefined);
      };
    }
  }, [user?.id]);

  return (
    <SocketContext.Provider value={{ sendMessage, onFocus, onblur }}>
      {children}
    </SocketContext.Provider>
  );
};
