import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fetch from 'node-fetch';

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.TMDB_API_KEY;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/write-to-csv', (req, res) => {
  const { title, year, rating } = req.body;

  if (!title || !year) {
    return res.status(400).send('Title and Year are required');
  }

  const formattedRating = rating ? `${parseInt(rating.part1 || 0)}.${parseInt(rating.part2 || 0)}${parseInt(rating.part3 || 0)}` : '';
  const dataToWrite = `${title},${year},${formattedRating}\n`;

  const filePath = path.join(__dirname, 'data.csv');

  fs.appendFile(filePath, dataToWrite, (err) => {
    if (err) {
      console.error('Error writing to CSV file:', err);
      return res.status(500).send('Failed to write to CSV');
    }
    res.send('Data successfully written to CSV');
  });
});

app.get('/download-csv', (req, res) => {
  const filePath = path.join(__dirname, 'data.csv');
  res.download(filePath);
});

app.get('/popular-movies', async (req, res) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).send('Failed to fetch popular movies');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});