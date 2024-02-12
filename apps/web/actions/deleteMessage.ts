"use server";

import { currentUser } from "@clerk/nextjs";
import { db } from "../lib/db";

export const deleteMessage = async (chatId: string) => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "You are not authorised" };
    }

    await db.message.delete({
      where: {
        id: chatId,
      },
    });

    return { success: "message deleted successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};
