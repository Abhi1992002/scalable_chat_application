import { Kafka, Producer } from "kafkajs";
import fs from "fs";
import path from "path";
import { db } from "./prisma";
const kafka = new Kafka({
  brokers: ["kafka-193df19c-abhimanyu1992002-e008.a.aivencloud.com:20797"],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
  },
  sasl: {
    username: "avnadmin",
    password: "AVNS_skUY65YWf8OqjU3STwR",
    mechanism: "plain",
  },
});

let producer: Producer | null = null;
export async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(message: string) {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "MESSAGES",
  });
  return true;
}

export async function startMessageConsumer() {
  const consumer = kafka.consumer({ groupId: "default" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES" });
  console.log("Kafka consuming server started...");

  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      try {
        const value = JSON.parse(message.value.toString());
        console.log("--------- start to saving messages in db ------------");
        console.log(value);
        await db.message.create({
          data: {
            id: value.id,
            text: value.message,
            sender: value.sender,
            reciever: value.reciever,
            senderId: value.senderId,
            recieverId: value.recieverId,
            createdAt: value.createdAt,
          },
        });
        console.log("--------- message saving complete ------------");
      } catch (error) {
        console.log(error);
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 60 * 1000);
      }
    },
  });
}

export default kafka;
