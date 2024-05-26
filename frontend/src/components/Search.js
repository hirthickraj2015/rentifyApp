import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import RentPostCard from './RentPostCard';
import './styles/Search.css';
const PAGE_SIZE = 16;

// Custom hook to extract query parameters
const useQuery = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

function Search() {
  const query = useQuery();
  const [location, setLocation] = useState('');
  const [type, setType] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const initialLocation = query.get('location');
  const initialType = query.get('type');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const requestBody = {
          location: initialLocation || '',
          type: initialType || 'all',
          searchQuery: searchQuery || '',
        };
        const response = await axios.post(
          'http://localhost:4000/products',
          requestBody
        );
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [initialLocation, initialType, searchQuery]);

  // eslint-disable-next-line no-unused-vars
  const handleSearchInputChange = (event) => {
    const inputValue = event.target.value;
    setSearchQuery(inputValue);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const requestBody = {
        location: location || '',
        type: type || 'all',
        searchQuery: searchQuery || '',
      };
      const response = await axios.post(
        'http://localhost:4000/products',
        requestBody
      );
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(results.length / PAGE_SIZE);
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate start and end indices for pagination
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const displayedResults = results.slice(startIndex, endIndex);

  return (
    <div>
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              // Call handleSearchInputChange function when input changes
            }}
          />

          <select
            className="filter-dropdown"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="office">Office</option>
            <option value="house">House</option>
            <option value="land">Land</option>
          </select>
          <button className="search-button" onClick={handleSearch}>
            <img src={require(`../assets/Search.png`)} alt="Search icon" />
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="search-results-grid">
        {displayedResults.length === 0 ? (
          <div>No results found</div>
        ) : (
          <div className="search-results-grid">
            {displayedResults.map((post) => (
              <RentPostCard
                key={post.productID}
                post={post}
                productID={post.productID}
              />
            ))}
          </div>
        )}
      </div>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <div className="page-numbers">
          <span className={currentPage === 1 ? 'current-page' : ''}>Page {currentPage}</span>
          {currentPage > 1 && (
            <span className={currentPage === currentPage - 1 ? 'current-page' : ''}>
              Previous Page {currentPage - 1}
            </span>
          )}
          <span className={currentPage === currentPage + 1 ? 'current-page' : ''}>
            Next Page {currentPage + 1}
          </span>
        </div>
        <button
          disabled={endIndex >= results.length}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Search;
