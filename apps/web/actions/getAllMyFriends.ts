"use server";

import { currentUser } from "@clerk/nextjs";
import { db } from "../lib/db";

export const getAllMyFriends = async () => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "You are not authorised" };
    }

    const friendIds = await db.friends.findMany({
      where: {
        userId: user.id,
      },
    });

    const friendDetailsPromises = friendIds.map((friend) => {
      return db.user.findUnique({
        where: {
          id: friend.friendId,
        },
      });
    });

    const list = await Promise.all(friendDetailsPromises);
    return { list: list };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};
