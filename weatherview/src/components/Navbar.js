import React, { useState, useEffect } from 'react';
import "../styles/Navbar.css";
import axios from 'axios';
import { Autocomplete, TextField } from "@mui/material";
import useDebounce from "../hooks/useDebounce";

const Navbar = ({ query, setQuery, handleSearch }) => {
  const [suggestions, setSuggestions] = useState([]);
  const apiKey = process.env.REACT_APP_GEO_API_KEY;

  const debounceValue = useDebounce(query, 500); // 500ms debounce delay

  const getSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    // Determine search type (city or postcode)
    const type = isNaN(input) ? "city" : "postcode";

    try {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&type=${type}&limit=10&apiKey=${apiKey}`;
      const response = await axios.get(url);

      const suggestionsData = response.data.features.map((feature) => {
      
        if (isNaN(input)) {
            // For city
            return {
                label: feature.properties.city,
                value: feature.properties.city,
            };
        } else {
            // For postcode
            return {
                label: feature.properties.postcode, 
                value: feature.properties.postcode,
            };
        }
      });

       // Remove duplicates
       const uniqueSuggestions = [
        ...new Map(suggestionsData.map((item) => [item.label, item])).values()
      ];

      setSuggestions(uniqueSuggestions); // Update Autocomplete options
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (debounceValue) {
      
      getSuggestions(debounceValue);
    } else {
      // If the query is empty, clear the suggestions
      setSuggestions([]);
    }
  }, [debounceValue]); // This effect runs when debounced value changes

  return (
    <div className="nav">

      <div className='nav-item'>
        <h2 className="app-name">WeatherView</h2>
      </div>

      <div className="search-input-container">

        <Autocomplete
          freeSolo // Allow custom input
          options={suggestions}
          getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
          onInputChange={(event, value) => {
            setQuery(value) // Update query state
          }}
          onChange={(event, value) => {
            if (value) {
              handleSearch(value.label); // Trigger search on option select
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Enter city or zip code"
              variant="outlined"
              size="small"
              className="search-input"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch(query); // Trigger search on Enter key
                }
              }}
            />
          )}
        />
      </div>

      <div className='nav-item'></div>
    </div>
  );
};

export default Navbar;
