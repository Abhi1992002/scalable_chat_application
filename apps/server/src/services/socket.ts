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

  public initListners() {
    const io = this.io;

    console.log("Initializing Socket Listners....");

    io.on("connect", async (socket) => {
      console.log(`New Socket Connected`, socket.id);
      socket.on(
        "event:message",
        async ({
          message,
          reciever,
          sender,
        }: {
          message: string;
          reciever: string;
          sender: string;
        }) => {
          console.log("get message in socket");
          await pub.publish(
            "MESSAGES",
            JSON.stringify({ message, reciever, sender })
          );
          console.log("message published");
        }
      );
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("got message from subscribe");
        const value = JSON.parse(message);
        console.log(value);
        io.to(value.recieverId).emit("message", message);
        await produceMessage(message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketServices;
