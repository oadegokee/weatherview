import React from 'react';
import "../styles/Navbar.css";

const Navbar = ({query, setQuery, handleSearch}) => {
  

    return (
        <div className='nav'>
            <div>
                <h2 className='app-name'>WeatherView</h2>
            </div>
          

            <div className='search-input-container'>
                <input 
                    type="search" 
                    placeholder="Enter city or zip code" 
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch(query);
                        }
                    }}
                />
            </div>

        </div>
    );
};

export default Navbar;