"use strict";

const amqp = require("amqplib");

consumerOrderedMessage = async () => {
  const connection = await amqp.connect("amqp://guest:guest@localhost");
  if (!connection) throw new Error("Couldn't connect to RabbitMQ");

  const channel = await connection.createChannel();
  if (!channel) throw new Error("Couldn't create channel");
  x;
  const queueName = "ordered-queue-message";
  await channel.assertQueue(queueName, { durable: false });

  // set prefetch 1 to ensure that only one message is sent at a time
  channel.prefetch(1);

  channel.consume(queueName, (msg) => {
    setTimeout(() => {
      console.log(`[x] Received: ${msg.content.toString()}`);
      channel.ack(msg);
    }, Math.random() * 1000);
  });
};

consumerOrderedMessage().catch((error) => {
  console.error("Error occurred:", error);
});
