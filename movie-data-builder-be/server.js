import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

app.use(express.json());

const TMDB_API_KEY = '5a4213bbf7d0bf2d3e1346fd62be9ff0';

app.get('/popular-movies', async (req, res) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
    const data = await response.json();
    res.json(data.results.slice(0, 10)); // Return the top 10 movies
  } catch (error) {
    res.status(500).send('Error fetching popular movies');
  }
});

const csvWriter = createObjectCsvWriter({
  path: 'data.csv',
  header: [
    { id: 'name', title: 'Name' },
    { id: 'email', title: 'Email' }
  ]
});

app.post('/write-to-csv', (req, res) => {
  const { name, email } = req.body;
  csvWriter.writeRecords([{ name, email }])
    .then(() => {
      res.status(200).send('Data written to CSV file successfully.');
    })
    .catch(error => {
      res.status(500).send('Error writing to CSV file.');
    });
});

app.get('/download-csv', (req, res) => {
  const filePath = path.join(__dirname, 'data.csv');
  res.download(filePath, 'data.csv', (err) => {
    if (err) {
      res.status(500).send('Error downloading the file.');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
