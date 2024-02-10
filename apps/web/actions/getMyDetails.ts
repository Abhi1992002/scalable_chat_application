"use server";

import { currentUser } from "@clerk/nextjs";
import { db } from "../lib/db";

export const getMyDetails = async () => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "You are not authorised" };
    }

    const detail = await db.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        friends: true,
      },
    });

    console.log(detail);

    return { detail: detail };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
};
