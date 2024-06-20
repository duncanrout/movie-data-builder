import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [rating, setRating] = useState('');
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState('popular-movies');

  const fetchMovies = async (category) => {
    try {
      const response = await fetch(`http://localhost:5000/${category}`);
      const data = await response.json();
      setMovies(data);
      setCurrentMovieIndex(0);  // Reset index when category changes
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    fetchMovies(currentCategory);
  }, [currentCategory]);

  const handleSubmit = async () => {
    const { title, release_date } = movies[currentMovieIndex];
    const year = release_date.split('-')[0];
    try {
      const response = await fetch('http://localhost:5000/write-to-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, year, rating }),
      });
      const data = await response.text();
      alert(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit rating');
    }
  };

  if (!movies.length) {
    return <div>Loading...</div>;
  }

  const currentMovie = movies[currentMovieIndex];

  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <div className="column">
          <ul>
            {['Now Playing', 'Popular', 'Top Rated', 'Upcoming'].map((list, index) => (
              <li key={index} onClick={() => setCurrentCategory(list.toLowerCase().replace(' ', '-') + '-movies')}>
                <button className="category-button">{list}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="column">
          <img
            className="currentImage"
            src={`https://image.tmdb.org/t/p/w200${currentMovie.poster_path}`}
            alt={currentMovie.title}
          />
        </div>
        <div className="column">
          <div className="movieDetails">
            <h2>{currentMovie.title}</h2>
            <p>Year: {currentMovie.release_date.split('-')[0]}</p>
            <p>
              Genre: {currentMovie.genres.map((genre, index) => (
                <span
                  key={index}
                  className="genre"
                  style={{ backgroundColor: currentMovie.genreColors[index] }}
                >
                  {genre}
                </span>
              ))}
            </p>
            <input
              type="text"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="_ . _ _"
            />
            <div className="navigation">
              <button
                onClick={() =>
                  setCurrentMovieIndex((currentMovieIndex - 1 + movies.length) % movies.length)
                }
              >
                &lt;
              </button>
              <button onClick={handleSubmit}>Submit</button>
              <button
                onClick={() => setCurrentMovieIndex((currentMovieIndex + 1) % movies.length)}
              >
                &gt;
              </button>
              <button onClick={() => setCurrentMovieIndex((currentMovieIndex + 1) % movies.length)}>
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
