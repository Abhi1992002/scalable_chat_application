"use server";

import { currentUser } from "@clerk/nextjs";
import { db } from "../lib/db";

export const getUserDetails = async (userId: string) => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "You are not authorised" };
    }

    const detail = await db.user.findUnique({
      where: {
        id: userId[0],
      },
    });

    return { detail: detail };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};
