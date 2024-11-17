import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import Today from "../components/Today";
import "../styles/Home.css";

const Home = () => {

    // State to store weather data
    const [weatherData, setWeatherData] = useState(null);

    // State to store the query
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false); // State to track loading status


    const apiKey = "2b68c5aecd9c2cdfc4368a50bcc2e815";

    // const apiKey = "0";

    const getWeatherData = async (lat, long) => {
        // console.log(lat);
        // console.log(long);
        setLoading(true)
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`;

        try {
            const response = await axios.get(url);
            console.log(response.data);
            setWeatherData(response.data);
           
        } catch (error) {
            console.error(error);
            
        } finally {
            setLoading(false); 
        }
    };

    const getForecastData = async (lat, long) => {
       
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
                console.log("City or zip code not found");
                return null;
            }
        } catch (error) {
            console.log (error);
            return null;
        }
    };

    const handleSearch = async () => {
        if(!query.trim()) return alert("Please enter a city name or zipcode");
        setLoading(true);
        const coords = await getCoordinates(query);

        if(coords) {
            const {lat, lon} = coords;
            await getWeatherData(lat, lon);
        }

        setLoading(false); 
    }

    // get the current weather
    useEffect(() => {
        const getWeatherForCurrentLocation = async () => {
          try {
            setLoading(true); 
            const { lat, lon } = await getCurrentLocation();
            await getWeatherData(lat, lon);
          } catch (error) {
            console.error("Failed to fetch weather data:", error);
          } finally {
            setLoading(false); 
          }
        };
      
        getWeatherForCurrentLocation();
      }, []);
      

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
        
                        <div className="tempUnit">
                            <button className="celcius">°C</button>
                            <button className="fah">°F</button>
                        </div>
                    </div>
            
        
                    <Today weatherData={weatherData} /> 
    
            </>
            )}
            
        </div>
    )

};

export default Home;
