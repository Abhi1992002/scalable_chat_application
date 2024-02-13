"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { FriendsAutopilotList } from "./friends-autopilot-list";
import { getAllUsername } from "../../actions/getAllUsernames";
import { User } from "db";
import { toast } from "react-hot-toast";
type FriendFormProps = {};

export const FriendForm = ({}: FriendFormProps) => {
  const [value, setValue] = useState("");
  const [usernames, setUsernames] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const getUsername = useCallback(async () => {
    // getting usernmae list from the backend
    const data = await getAllUsername(value);
    if (data.userList) {
      setUsernames(data.userList);
      setLoading(false);
    }
    if (data.error) {
      toast.error(data.error);
    }
  }, [value]);

  useEffect(() => {
    const id = setTimeout(() => {
      getUsername();
    }, 1000);

    return () => clearTimeout(id);
  }, [value]);

  const handleInputBlur = () => {
    setTimeout(() => {
      setOpen(false);
    }, 165);
  };

  return (
    <div className="w-full relative">
      <Input
        type="text"
        placeholder="Search with username"
        value={value}
        onBlur={handleInputBlur}
        onFocus={() => {
          if (value) {
            setOpen(true);
          }
        }}
        className="placeholder:text-black/40 border border-black/40"
        onChange={(e) => {
          setOpen(true);
          setLoading(true);
          setValue(e.target.value);
        }}
      />
      {value && open && <FriendsAutopilotList users={usernames} />}
    </div>
  );
};
