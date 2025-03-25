"use strict";

const amqp = require("amqplib");

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    if (!connection) throw new Error("Couldn't connect to RabbitMQ");

    const channel = await connection.createChannel();
    if (!channel) throw new Error("Couldn't create channel");

    const notificationExchange = "notificationEx"; // direct
    const notiQueue = "notificationQueueProcess"; // assertQueue
    const notificationExchangeDLX = "notificationExDLX"; // dlx
    const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

    // durable: remain message when restart service
    // create Exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    // create Queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, // exclusive: allow multi connect the same time
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    console.log(
      `Queue ${notiQueue} created with ${queueResult.messageCount} messages`
    );

    // bind queue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    const msg = "new product";

    // use Buffer to send faster than text original
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: 10000,
    });

    setTimeout(() => {
      channel.close();
      connection.close();
      console.log("Connection closed");
    }, 500);
  } catch (error) {}
};

runProducer()
  .then((rs) => console.log(`Producer ${rs}`))
  .catch((err) => console.error(err));
