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

    const latestMessagesPromises = friendIds.map((friend) => {
      return db.message.findFirst({
        where: {
          OR: [
            {
              senderId: user.id,
              recieverId: friend.friendId,
            },
            {
              senderId: friend.friendId,
              recieverId: user.id,
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });
    const latestMessages = await Promise.all(latestMessagesPromises);
    const list = await Promise.all(friendDetailsPromises);

    const friendListWithLatestMessage = list.map((friend, index) => {
      return {
        friend: friend,
        latestMessage: latestMessages[index],
      };
    });

    console.log(friendListWithLatestMessage);

    return { list: friendListWithLatestMessage };
  } catch (error) {
    return { error: "Something went wrong" };
  }
};
