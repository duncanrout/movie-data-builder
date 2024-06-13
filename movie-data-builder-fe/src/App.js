import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/write-to-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await response.text();
      alert(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit form');
    }
  };

  const handleDownload = () => {
    fetch('http://localhost:5000/download-csv')
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch(error => {
        console.error('Error downloading the file:', error);
        alert('Failed to download the file');
      });
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">Submit</button>
      </form>
      <button onClick={handleDownload}>Export</button>
    </div>
  );
}

export default App;
