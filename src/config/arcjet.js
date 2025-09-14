import arcjet, {
  shield,
  detectBot,
  slidingWindow,
} from '@arcjet/node';
import { isSpoofedBot } from '@arcjet/inspect';
import express from 'express';

const app = express();
const port = 3000;

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE'],
    }),
    slidingWindow({ interval: 60, limit: 10, max: 5, mode: 'LIVE' }),
  ],
});

app.get('/', async (req, res) => {
  const decision = await aj.protect(req, { requested: 5 });
  console.log('Arcjet decision', decision);

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Too Many Requests' }));
    } else if (decision.reason.isBot()) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No bots allowed' }));
    } else {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Forbidden' }));
    }
  } else if (decision.ip.isHosting()) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Forbidden' }));
  } else if (decision.results.some(isSpoofedBot)) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Forbidden' }));
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello World' }));
  }
});
export default aj;
