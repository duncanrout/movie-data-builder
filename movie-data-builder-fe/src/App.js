import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [rating, setRating] = useState({ part1: '', part2: '', part3: '' });

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    const currentMovie = movies[currentMovieIndex];
    const ratingValue = rating.part1 && rating.part2 && rating.part3 
      ? `${rating.part1}.${rating.part2}${rating.part3}` 
      : '';
    const dataToWrite = {
      title: currentMovie.title,
      year: currentMovie.release_date.split('-')[0],
      rating: ratingValue,
    };
    try {
      const response = await fetch('http://localhost:5000/write-to-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToWrite),
      });
      const data = await response.text();
      alert(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit rating');
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

  const handleSkip = () => {
    setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/popular-movies');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRating((prevRating) => ({
      ...prevRating,
      [name]: value,
    }));
  };

  if (movies.length === 0) {
    return <div>Loading...</div>;
  }

  const currentMovie = movies[currentMovieIndex];

  return (
    <div className="App">
      <nav>
        <ol>
          <li><a href="#list1">List 1</a></li>
          <li><a href="#list2">List 2</a></li>
          <li><a href="#list3">List 3</a></li>
          <li><a href="#list4">List 4</a></li>
        </ol>
      </nav>
      <div className="main-content">
        <div className="image-container">
          <img
            src={`https://image.tmdb.org/t/p/w300${currentMovie.poster_path}`}
            alt={currentMovie.title}
            className="current-image"
          />
        </div>
        <div className="details-container">
          <h2>{currentMovie.title}</h2>
          <p>{currentMovie.release_date.split('-')[0]}</p>
          <p>{currentMovie.genre_ids.join(', ')}</p> {/* Adjust this based on genre mapping */}
          <form onSubmit={handleRatingSubmit}>
            <div className="rating-input">
              <input
                type="text"
                name="part1"
                value={rating.part1}
                onChange={handleRatingChange}
                maxLength="1"
                placeholder="_"
              />
              .
              <input
                type="text"
                name="part2"
                value={rating.part2}
                onChange={handleRatingChange}
                maxLength="1"
                placeholder="_"
              />
              <input
                type="text"
                name="part3"
                value={rating.part3}
                onChange={handleRatingChange}
                maxLength="1"
                placeholder="_"
              />
            </div>
            <div className="navigation-buttons">
              <button type="button" onClick={() => setCurrentMovieIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length)}>
                &lt;
              </button>
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length)}>
                &gt;
              </button>
            </div>
          </form>
          <button className="skip-button" onClick={handleSkip}>Skip</button>
        </div>
      </div>
      <button onClick={handleDownload}>Export</button>
    </div>
  );
}

export default App;
