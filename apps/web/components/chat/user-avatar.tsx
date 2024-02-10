import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type UserAvatarProps = {
  userImg: string;
};

export const UserAvatar = ({ userImg }: UserAvatarProps) => {
  return (
    <>
      <Avatar className="w-8 h-8">
        <AvatarImage src={userImg} />
        <AvatarFallback>User</AvatarFallback>
      </Avatar>
    </>
  );
};
