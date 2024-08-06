## How to run

```bash
npm install
```

```bash
npm start
```

## How to test

Example requests:

    GET localhost:3000/api/my_queue
    GET localhost:3000/api/my_queue?timeout=2000
    GET localhost:3000/api/my_queue?timeout=20000

    POST localhost:3000/api/my_queue body: { "message": "Message 1" }

## Unit tests

```bash
npm test
```
