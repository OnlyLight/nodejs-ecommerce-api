"use strict";

const amqp = require("amqplib");

produceOrderedMessage = async () => {
  const connection = await amqp.connect("amqp://guest:guest@localhost");
  if (!connection) throw new Error("Couldn't connect to RabbitMQ");

  const channel = await connection.createChannel();
  if (!channel) throw new Error("Couldn't create channel");

  const queueName = "ordered-queue-message";
  await channel.assertQueue(queueName, { durable: false });

  for (let index = 0; index < 10; index++) {
    const message = `ordered-queue-message::${index}`;
    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true, // Make sure the message is not lost in case of RabbitMQ restart
    });
  }

  setTimeout(() => {
    connection.close();
  }, 1000);
};

produceOrderedMessage().catch((error) => {
  console.error("Error occurred:", error);
});
