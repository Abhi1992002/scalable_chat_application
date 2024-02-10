"use server";

import { currentUser } from "@clerk/nextjs";
import { db } from "../lib/db";

export const addFriend = async (userId: string) => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "You are not authorised" };
    }

    await db.friends.create({
      data: {
        friendId: userId,
        userId: user.id,
      },
    });

    return { success: "friend successfullt added" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};
