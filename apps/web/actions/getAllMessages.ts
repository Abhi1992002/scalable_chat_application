"use server";

import { currentUser } from "@clerk/nextjs";
import { db } from "../lib/db";

export const getAllMessages = async () => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "You are not authorised" };
    }

    const messages = await db.message.findMany({
      where: {
        OR: [
          {
            senderId: user.id,
            isDeleted: false,
          },
          {
            recieverId: user.id,
            isDeleted: false,
          },
        ],
      },
    });

    return { messages: messages };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};
