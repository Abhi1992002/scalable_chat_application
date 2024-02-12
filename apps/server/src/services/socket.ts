import { Server } from "socket.io";
import Redis from "ioRedis";
import { db } from "./prisma";
import { produceMessage } from "./kafka";

const pub = new Redis({
  host: "redis-38a93c07-abhimanyu1992002-e008.a.aivencloud.com",
  port: 20784,
  username: "default",
  password: "AVNS_4fUYSrrktqY2qHf9RyT",
});
const sub = new Redis({
  host: "redis-38a93c07-abhimanyu1992002-e008.a.aivencloud.com",
  port: 20784,
  username: "default",
  password: "AVNS_4fUYSrrktqY2qHf9RyT",
});

const redis = new Redis({
  host: "redis-38a93c07-abhimanyu1992002-e008.a.aivencloud.com",
  port: 20784,
  username: "default",
  password: "AVNS_4fUYSrrktqY2qHf9RyT",
});

class SocketServices {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  public async initListners() {
    const io = this.io;
    console.log("Initializing Socket Listners....");

    io.on("connect", async (socket) => {
      console.log(`New Socket Connected`, socket.id);

      redis.hgetall("user-joined", (err, onlineUsers) => {
        if (!err && onlineUsers) {
          socket.emit("initial-state", onlineUsers);
        }
      });

      socket.on("storeUserId", async (userId: string) => {
        const userIdExist = await redis.get(userId);
        const socketIdExist = await redis.hget("socketIdToUserId", socket.id);

        if (userIdExist) {
          await redis.del(userId);
          console.log("userIdExist");
        }
        if (socketIdExist) {
          await redis.hdel("socketIdToUserId", socket.id);
          console.log("socketIdExist");
        }
        await redis.set(userId, socket.id);
        await redis.hset("socketIdToUserId", socket.id, userId);
        console.log(
          "set the user id with socket id in redis",
          userId,
          " : userid",
          socket.id,
          " : socketId"
        );
      });

      socket.on(
        "event:message",
        async ({
          message,
          reciever,
          sender,
          recieverId,
          senderId,
          createdAt,
          id,
        }: {
          id: string;
          message: string;
          reciever: string;
          sender: string;
          recieverId: string;
          senderId: string;
          createdAt: Date;
        }) => {
          await pub.publish(
            "MESSAGES",
            JSON.stringify({
              id,
              message,
              reciever,
              sender,
              recieverId,
              senderId,
              createdAt,
            })
          );
        }
      );

      socket.on("join", async (userId: string) => {
        await redis.hset("user-joined", userId, "true");
        io.emit("user-joined", userId);
      });

      socket.on("disconnect", async () => {
        const userId = await redis.hget("socketIdToUserId", socket.id);
        if (userId) {
          await redis.del(userId);
          await redis.hdel("socketIdToUserId", socket.id);
          await redis.hdel("user-joined", userId);
          io.emit("unjoined", userId);
        }
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        const value = JSON.parse(message);
        const socketId = await redis.get(value.recieverId);
        if (socketId) {
          io.to(socketId).emit("message", message);
        }
        await produceMessage(message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketServices;
