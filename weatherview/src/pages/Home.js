import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import Today from "../components/Today";
import Hourly from '../components/Hourly';
import "../styles/Home.css";

const Home = () => {

    // State to store weather data
    const [weatherData, setWeatherData] = useState(null);

    // State to store the hourly forecast data
    const [forecastData, setForecastData] = useState(null);

    // State to store the query
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false); // State to track loading status
    const [units, setUnits] = useState("metric"); // State to track loading status
    const [degreeType, setDegreeType] = useState("°C")
    const [noResultsErrorMessage, setNoResultsErrorMessage] = useState();


    const apiKey = process.env.REACT_APP_API_KEY;

    const getWeatherData = async (lat, long, unit = units) => {
        // console.log(lat);
        // console.log(long);
        setLoading(true)
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=${unit}`;

        try {
            const response = await axios.get(url);
            setWeatherData(response.data);
           
        } catch (error) {
            console.error(error);
            
        } finally {
            setLoading(false); 
        }
    };

    const getForecastData = async (lat, long, unit = units) => {
       const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}&units=${unit}&cnt=15`;

       try {
        const response = await axios.get(url);
        setForecastData(response.data);
       
        } catch (error) {
            console.error(error);
            
        } 
    }

    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {

          // if location is enabled
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ lat: latitude, lon: longitude });
              },
              (error) => {
                console.error("Error fetching location:", error);
                reject(error);
                setLoading(false); // Set loading to false if there's an error
              }
            );
          } else {
            reject(new Error("Please enable location"));
          }
        });
      };
      

    const getCoordinates = async (query) => {
        let url = ``;
        if(isNaN(query)) {
            // city name url
            url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}`;
            // console.log(url);
        }
        else {
            // zip code url
            url = `http://api.openweathermap.org/geo/1.0/zip?zip=${query}&appid=${apiKey}`;
            // console.log(url);
        }

        try {
            const response = await axios.get(url);
            // console.log(response.data);
            if (response.data != null) {
                let lat = 0;
                let lon = 0;

                if(isNaN(query)) {
                    lat = response.data[0].lat;
                    lon = response.data[0].lon;
                } else {
                    lat = response.data.lat;
                    lon = response.data.lon;
                }
                
                // console.log(lat);
                return {lat, lon};
            } else {
                setNoResultsErrorMessage("No results found for \"" + query + "\", please try again");
                return null;
            }
        } catch (error) {
            console.log (error);
            setNoResultsErrorMessage("No results found for \"" + query + "\", please try again");
            return null;
        }
    };

    const handleSearch = async (value = query) => {
        if(!value.trim()) return alert("Please enter a city name or zipcode");
        setLoading(true);
        const coords = await getCoordinates(value);

        if(coords) {
            const {lat, lon} = coords;
            await getWeatherData(lat, lon);
            await getForecastData(lat, lon);
        }

        setLoading(false); 
    }

    const handleUnitChange = (newUnit) => {
        if (newUnit != null) {
            setUnits(newUnit);
            setDegreeType(newUnit === "metric" ? "°C" : "°F");
    
            // Refetch weather data
            if (weatherData) {
                const { lat, lon } = weatherData.coord; 
                getWeatherData(lat, lon, newUnit);
                getForecastData(lat, lon, newUnit);
            }
        }
    }

    // Hide and show error message
    const showErrorMessage = () => {

        setTimeout(() => {
            setNoResultsErrorMessage(null);
        }, 5000); // hide after 5 seconds
    };

 
    // get the current weather
    useEffect(() => {
        const getWeatherForCurrentLocation = async () => {
          try {
            setLoading(true); 
            const { lat, lon } = await getCurrentLocation();
            await getWeatherData(lat, lon);
            await getForecastData(lat, lon);
          } catch (error) {
            console.error("Failed to fetch weather data:", error);
          } finally {
            setLoading(false); 
          }
        };
      
        getWeatherForCurrentLocation();
      }, []);

   
    useEffect(() => {
        // Show the error message
        if (noResultsErrorMessage) {
            showErrorMessage();
        }
    }, [noResultsErrorMessage]);


    return (
        <div className='container'>
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div> 
                </div>
            )}
        
            <Navbar
                query={query}
                setQuery={setQuery}
                handleSearch={handleSearch}
            />

          
            
            {weatherData != null && (
                <>
                    <div className='top-container'>
                        <div className="loc">
                            <i className="material-icons">place</i>
                            <h2 className="location">{weatherData.name}</h2>
                        </div>

                        {noResultsErrorMessage != null && (
                            <div className='error-message-container'>
                                <p className='error-message'>{noResultsErrorMessage}</p>
                            </div>
                        
                        )}
        
                        <div className="tempUnit">
                            <button
                                className={`unit-btn ${units === "metric" ? "active" : ""}`}
                                onClick={() => handleUnitChange("metric")}
                            >°C
                            </button>
                            <button
                                className={`unit-btn ${units === "imperial" ? "active" : ""}`}
                                onClick={() => handleUnitChange("imperial")}
                            >°F
                            </button>
                        </div>

                    </div>
            
        
                    <Today weatherData={weatherData} degreeType={degreeType} units={units}/> 
                    <Hourly forecastData={forecastData} degreeType={degreeType}/>
    
            </>
            )}
            
        </div>
    )

};

export default Home;
