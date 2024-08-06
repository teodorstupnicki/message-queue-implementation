import request from 'supertest';
import app from '../app';
import { Server } from 'http';
import { AddressInfo } from 'net';

let server: Server;
let baseURL: string;

beforeAll((done) => {
  server = app.listen((err: Error) => {
    if (err) return done(err);
    baseURL = `http://localhost:3000`;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

describe('POST /api/:queueName', () => {
  it('should send a message to the queue', async () => {
    const response = await request(app)
      .post('/api/test_queue')
      .send({ message: 'Test message' });
    expect(response.status).toBe(200);
  });

  it('should return 400 if no message is provided', async () => {
    const response = await request(app)
      .post('/api/test_queue')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'No message is provided' });
  });
});

describe('GET /api/:queueName', () => {
  it('should consume a message if the queue is not empty', async () => {
    await request(app)
      .post('/api/test_queue')
      .send({ message: 'Test message' });
    const response = await request(app).get('/api/test_queue');
    expect(response.status).toBe(200);
  });

  it('should return a timeout message if no message is available, with default timeout', async () => {
    const response = await request(app).get('/api/test_queue');
    const response2 = await request(app).get('/api/test_queue');
    expect(response2.status).toBe(204);
  }, 20000);

  it('should return a timeout message if no message is available, with custom timeout', async () => {
    const response2 = await request(app).get('/api/test_queue?timeout=1000');
    expect(response2.status).toBe(204);
  });
});