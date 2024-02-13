"use server";

import { currentUser } from "@clerk/nextjs";
import { db } from "../lib/db";

export const removeFriend = async (friendId: string) => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "You are not authorised" };
    }

    await db.friends.deleteMany({
      where: {
        OR: [
          {
            userId: user.id,
            friendId: friendId,
          },
          {
            friendId: user.id,
            userId: friendId,
          },
        ],
      },
    });

    await db.message.deleteMany({
      where: {
        OR: [
          {
            senderId: user.id,
            recieverId: friendId,
          },
          {
            recieverId: user.id,
            senderId: friendId,
          },
        ],
      },
    });

    return { success: "success" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};
