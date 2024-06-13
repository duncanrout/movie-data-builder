const express = require('express');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

app.use(express.json());

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
