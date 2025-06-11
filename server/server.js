import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({ message: 'Hello from Codex' });
});

app.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Optional delay to prevent rate limit errors
    await new Promise(resolve => setTimeout(resolve, 1500));

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    res.status(200).send({
      bot: response.choices[0].message.content
    });
  } catch (err) {
    console.error('OpenAI API Error:', err);

    if (err.status === 429) {
      return res.status(429).send({
        err: 'Too many requests – please slow down.'
      });
    }

    res.status(500).send({ err: err.message || err });
  }
});

app.listen(5000, () => console.log('✅ Server running at http://localhost:5000'));
