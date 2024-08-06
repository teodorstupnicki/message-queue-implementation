import express, { Request, Response } from 'express';
import { MessageModel } from './models/MessageModel';
import { MessageQueue } from './models/MessageQueue';

const app = express();
const PORT = 3000;

app.use(express.json());

const messageQueues: MessageQueue<MessageModel>[] = [];

app.post('/api/:queueName', async (req: Request, res: Response) => {
  const queueName = req.params.queueName;
  const message: MessageModel = req.body;
  if (!message ||!message.message) {
    res.status(400).send({ error: 'No message is provided' });
    return;
  }

  let queue = messageQueues.find((q) => q.name === queueName);
  if (!queue) {
    messageQueues.push(queue = new MessageQueue(queueName));
  }
  queue.sendMessage(message);
  res.status(200).send(JSON.stringify(queue));
});

app.get('/api/:queueName', async (req: Request, res: Response) => {
  const queueName = req.params.queueName;
  let timeoutDuration = req.query.timeout ? req.query.timeout as string : '10000';
  try {
    let queue = messageQueues.find((q) => q.name === queueName);
    if (!queue || queue === undefined) {
      res.status(404).send("Queue not found");
      return;
    }
    const message = await queue!.consumeMessage(timeoutDuration);
    if (message === null) {
      res.status(204).send();
    } else {
      res.status(200).send({ message });
    }
  } catch (error) {
    res.status(500).send({ error: 'Failed to dequeue message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;