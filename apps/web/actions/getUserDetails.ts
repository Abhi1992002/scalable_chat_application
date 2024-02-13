"use server";

import { currentUser } from "@clerk/nextjs";
import { db } from "../lib/db";

export const getUserDetails = async (friendId: string) => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "You are not authorised" };
    }

    const me = await db.user.findUnique({
      where: { id: user.id },
      include: { friends: true },
    });

    const isFriend = me?.friends.some(
      (friend) => friend.friendId === friendId[0]
    );

    if (!isFriend) {
      return { error: "Can't Chat with him because he is not your friend" };
    }

    const detail = await db.user.findUnique({
      where: {
        id: friendId[0],
      },
    });

    return { detail: detail };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};
