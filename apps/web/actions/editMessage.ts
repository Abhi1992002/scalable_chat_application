"use server";

import { currentUser } from "@clerk/nextjs";
import { db } from "../lib/db";

export const updateMessage = async ({
  chatId,
  text,
}: {
  chatId: string;
  text: string;
}) => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "You are not authorised" };
    }

    await db.message.updateMany({
      where: {
        id: chatId,
      },
      data: {
        text: text,
        isEdited: true,
      },
    });

    return { success: "message Updated successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};
