"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { IoIosArrowDown } from "react-icons/io";
import { Button } from "../ui/button";
import { removeFriend } from "../../actions/removeFriend";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { friendState } from "../../store/friend-store";
type TopbarDropDownProps = {
  friendId: string;
};

export const TopbarDropDown = ({ friendId }: TopbarDropDownProps) => {
  const router = useRouter();
  const setFriendList = useSetRecoilState(friendState);
  const onRemoveFriend = () => {
    router.push("/chatRoom");

    removeFriend(friendId)
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
          setFriendList((prevList) => {
            const newList = prevList.filter(
              (list) => list.friend?.id !== friendId
            );
            return newList;
          });
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IoIosArrowDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-8">
            <DropdownMenuItem>
              <DialogTrigger>Remove Friend</DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Confirm action?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently remove your
              message with your friend
            </DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <Button
              variant={"destructive"}
              className="w-fit"
              onClick={() => onRemoveFriend()}
            >
              Remove
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};
