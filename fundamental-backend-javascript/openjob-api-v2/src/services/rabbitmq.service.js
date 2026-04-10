const amqp = require("amqplib");

const sendMessage = async (queue, message) => {
  try {
    const host = process.env.RABBITMQ_HOST || "localhost";
    const port = process.env.RABBITMQ_PORT || 5672;
    const user = process.env.RABBITMQ_USER || "guest";
    const pass = process.env.RABBITMQ_PASSWORD || "guest";
    const url = `amqp://${user}:${pass}@${host}:${port}`;

    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("RabbitMQ Error:", error);
  }
};

module.exports = { sendMessage };
