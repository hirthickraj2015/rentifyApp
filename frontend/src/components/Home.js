import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';

function Home() {
    const [location, setLocation] = useState('');
    const [type, setType] = useState('all');
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate(`/search?location=${location}&type=${type}`);
    };

    return (
        <div className="home-background">
            <div className="background-filter"></div>
            <div>
                <div className="brand-container">
                    <h1 className="brand-name">Rentify</h1>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
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
                <p className="slogan">Where Renting Becomes Simple</p>
            </div>
        </div>
    );
}

export default Home;
