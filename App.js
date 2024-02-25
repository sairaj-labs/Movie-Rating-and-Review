import React, { useState, useEffect } from 'react';
import './index.css'; // Import the CSS file

function MovieSearch() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submittedReviews, setSubmittedReviews] = useState([]);

  useEffect(() => {
    if (query.trim() !== '') {
      fetchMovies(query);
    }
  }, [query]);

  useEffect(() => {
    // Define the ResizeObserverCallback
    const observerCallback = (entries) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
        // You can place additional resize handling logic here if needed
      });
    };

    // Create a new instance of ResizeObserver with the callback
    const resizeObserver = new ResizeObserver(observerCallback);

    // Observe relevant elements here, e.g., movie list, details, etc.
    // Make sure to replace 'elementId' with the actual ID of the element you want to observe
    const movieListElement = document.querySelector('.movie-list');
    if (movieListElement) {
      resizeObserver.observe(movieListElement);
    }

    // Cleanup function
    return () => {
      resizeObserver.disconnect();
    };
  }, []); // Run this effect only once on component mount


  const fetchMovies = async (searchQuery) => {
    try {
      const response = await fetch(`http://www.omdbapi.com/?apikey=3de83405&s=${searchQuery}`);
      const data = await response.json();
      setMovies(data.Search);
      setSelectedMovie(null); // Reset selected movie when searching for new movies
      setReview(''); // Clear review when searching for new movies
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setMovies([]); // Clear the movie list when a movie is selected
    setReview(''); // Clear review when a movie is selected
  };

  const handleRatingChange = (event) => {
    setRating(parseInt(event.target.value));
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleReviewSubmit = () => {
    // Handle review submission (you can implement saving to a backend or local storage)
    if (review.trim() !== '') {
      const newReview = {
        movieTitle: selectedMovie.Title,
        review: review,
      };

      setSubmittedReviews([...submittedReviews, newReview]);
      setReview(''); // Clear the review input after submission
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? 'star filled' : 'star'}
          onClick={() => setRating(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div>
      <video className="background-video" autoPlay loop muted>
    <source src="/pexels_videos_1851190 (2160p).mp4" type="video/mp4" />
    {/* Add additional source elements for other video formats */}
    Your browser does not support the video tag.
  </video>
      <div className="container">
        <img
          src="https://media.istockphoto.com/id/985459232/photo/3d-rendering-of-a-video-reel-with-video-film-stretching-around-a-big-bucket-full-of-popcorn.jpg?s=2048x2048&w=is&k=20&c=UzRteFx4sjOBV5JlQgjWKw6wnJnDaom6ElSXuipBeQo="
          alt="Logo"
          className="logo"
        />
        <span className="header">THE MOVIE MANIA</span>
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search for a movie..."
          className="search-input"
        />
        <div className="movie-list">
          {movies &&
            movies.map((movie, index) => (
              <div key={index} className="movie" onClick={() => handleMovieClick(movie)}>
                <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
                <p className="movie-title">{movie.Title}</p>
              </div>
            ))}
        </div>
        {selectedMovie && (
          <div className="movie-details">
            <h2 className="movie-title">{selectedMovie.Title}</h2>
            <img src={selectedMovie.Poster} alt={selectedMovie.Title} className="movie-poster" />
            <p className="movie-plot">{selectedMovie.Plot}</p>
            <p className="movie-info">Year: {selectedMovie.Year}</p>
            <p className="movie-info">Type: {selectedMovie.Type}</p>
            <p className="your-rating">Your Rating: {rating}</p>
            <div className="rating">{renderStars()}</div>
          </div>
        )}
        {selectedMovie && (
  <div className="review-section">
    <h3>Write a Review</h3>
    <p>Your Rating: {rating}</p> {/* Display the selected rating */}
    <textarea
      value={review}
      onChange={handleReviewChange}
      placeholder="Write your review here..."
      className="review-input"
    />
    <button onClick={handleReviewSubmit} className="submit-button">
      Submit Review
    </button>
  </div>
)}

        {selectedMovie && (
  <div className="submitted-reviews">
    <h3>Submitted Reviews</h3>
    <ul>
      {submittedReviews
        .filter((review) => review.movieTitle === selectedMovie.Title)
        .map((review, index) => (
          <li key={index}>
            <strong>{review.movieTitle}:</strong> {review.review}
          </li>
        ))}
    </ul>
  </div>
)}
      </div>
    </div>
  );
}

export default MovieSearch;
