"use client";
import { User } from "db";
import React, { useState } from "react";
import { MoonLoader } from "react-spinners";
import { Button } from "../ui/button";
import { IoMdAdd } from "react-icons/io";
import { addFriend } from "../../actions/addFriend";
import { toast } from "react-hot-toast";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { FaCheck } from "react-icons/fa";

type FriendsAutopilotListProps = {
  users: User[];
};

export const FriendsAutopilotList = ({ users }: FriendsAutopilotListProps) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const { me } = useCurrentUser();

  const onAddFriend = async (userId: string) => {
    setButtonLoading(true);
    const data = await addFriend(userId);
    if (data.error) {
      toast.error(data.error);
      setButtonLoading(false);
    }
    if (data.success) {
      toast.success(data.success);
      setButtonLoading(false);
    }
  };

  return (
    <div className="w-full p-4 border border-black/40 rounded-lg mt-2 bg-white text-black flex items-center justify-center flex-col absolute z-[100] space-y-2">
      {users.length === 0 ? (
        <p>No such username exist</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="w-full flex items-center justify-between"
          >
            <p key={user.id}>@{user.username}</p>
            {buttonLoading ? (
              <MoonLoader color="#000000" size={14} />
            ) : me?.friends.some((friend) => friend.friendId === user.id) ? (
              <FaCheck className="text-green-500" />
            ) : (
              <Button key={user.id} onClick={() => onAddFriend(user.id)}>
                <IoMdAdd />
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  );
};
