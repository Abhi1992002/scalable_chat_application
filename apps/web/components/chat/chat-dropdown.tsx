"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { deleteMessage } from "../../actions/deleteMessage";
import { toast } from "react-hot-toast";
import { useSetRecoilState } from "recoil";
import { ChatState, chatsState } from "../../store/chat-store";
import { Textarea } from "../ui/textarea";
import { updateMessage } from "../../actions/editMessage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useSocket } from "../../context/socketProvider";
import { useUser } from "@clerk/nextjs";
type ChatDropDownProps = {
  chatId: string;
  text: string;
  reciever: string;
  sender: string;
  recieverId: string;
};

export const ChatDropDown = ({
  text,
  chatId,
  reciever,
  recieverId,
  sender,
}: ChatDropDownProps) => {
  const setChatState = useSetRecoilState(chatsState);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(text);
  const { sendMessage } = useSocket();
  const { user } = useUser();
  const onDeleteMessage = () => {
    setChatState((prevState) => {
      const newState: ChatState = {};
      for (const userId in prevState!) {
        if (Object.prototype.hasOwnProperty.call(prevState!, userId)) {
          newState[userId] = prevState[userId]!.map((message) => {
            if (message.id === chatId) {
              // If the message ID matches, update the message content
              return {
                ...message,
                message: "--- This message is deleted ---",
                isDeleted: true,
              };
            }
            // Otherwise, keep the message unchanged
            return message;
          });
        }
      }
      return newState;
    });

    deleteMessage(chatId)
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault();
        setOpen(false);
        setChatState((prevState) => {
          const newState: ChatState = {};
          for (const userId in prevState!) {
            if (Object.prototype.hasOwnProperty.call(prevState!, userId)) {
              newState[userId] = prevState[userId]!.map((messageDetail) => {
                if (messageDetail.id === chatId) {
                  // If the message ID matches, update the message content
                  return { ...messageDetail, message: message, isEdited: true };
                }
                // Otherwise, keep the message unchanged
                return messageDetail;
              });
            }
          }
          return newState;
        });
        updateMessage({ text: message, chatId: chatId })
          .then((data) => {
            if (data.error) {
              toast.error(data.error);
            }
            if (data.success) {
              toast.success(data.success);
            }
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    }
  };

  const onResendMessage = () => {
    if (user) {
      sendMessage(message, reciever, user.username!, recieverId);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <BsThreeDotsVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent side={"bottom"}>
            <DropdownMenuItem asChild>
              <DialogTrigger className="w-full">
                <p>Edit</p>
              </DialogTrigger>
            </DropdownMenuItem>
            {chatId && (
              <DropdownMenuItem onClick={() => onDeleteMessage()}>
                Delete
              </DropdownMenuItem>
            )}
            {user?.id !== recieverId && (
              <DropdownMenuItem onClick={() => onResendMessage()}>
                Resend
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <p className="mb-4">
                Enter to send. Shift + Enter to add new line
              </p>
            </DialogTitle>
            <DialogDescription>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
                className="border border-neutral-300 placeholder:text-black/40 bg-white min-h-[100px] placeholder:font-semibold "
                placeholder="Enter to send. Shift + Enter to add new line"
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
