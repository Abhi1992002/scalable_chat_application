"use server";

import { currentUser } from "@clerk/nextjs";
import { db } from "../lib/db";

export const getAllUsername = async (searchQuery: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return { error: "You are Unauthorised" };
    }

    const userList = await db.user.findMany({
      where: {
        NOT: {
          id: user.id,
        },
        username: {
          contains: searchQuery,
        },
      },
    });

    return { userList: userList };
  } catch (error) {
    return { error: "Something went wrong" };
  }
};
