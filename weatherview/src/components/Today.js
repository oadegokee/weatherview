import React from "react";
import "../styles/Today.css";


const today = ({ weatherData, degreeType, units }) => {
    if(weatherData != null) {
        const { dt, main, sys, weather, wind} = weatherData;
        const {feels_like, humidity, temp, temp_max, temp_min} = main;
        const {sunrise, sunset} = sys;
        const {speed, gust} = wind;
        const { icon, description }= weather[0];

        // Convert dt to date
        const date = new Date(dt * 1000); 

        // Format the date
        const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });

        // Format the time
        const formatTime = (timestamp) => {
      
            const date = new Date(timestamp * 1000); 

            // Get hours and minutes
            let hours = date.getHours();
            let minutes = date.getMinutes().toString().padStart(2, "0");

            // Determine AM or PM
            const ampm = hours >= 12 ? "PM" : "AM";

            // Convert hours to 12-hour format
            hours = hours % 12 || 12;

            // Return formatted time
            return `${hours}:${minutes} ${ampm}`;
        };
        
        return (
            <div className="today-container">
               
                 <div className="weather-details">

                    <div className="main-weather-info">
                        <p className="current-weather">{Math.round(temp) + degreeType}</p>
                        <p className="current-date">{formattedDate}</p>
                        <div className="high-low-info">
                            <p>H: {Math.round(temp_max) + degreeType}</p>
                            <p>L: {Math.round(temp_min) + degreeType}</p>
                        </div>
                    </div>
                     <div className="current-weather-info">
                        <div className="current-weather-container">
                            <p>Feel Like</p>
                            <p>{Math.round(feels_like) + degreeType}</p>
                        </div>
                                
            
                        <div className="current-weather-container">
                            <p>Sunrise: {formatTime(sunrise)}</p>
                            <p>Sunset: {formatTime(sunset)}</p>
                        </div>
    
                        <div className="current-weather-container">
                            <p>Wind Speed</p>
                            <p>{Math.round(speed)}
                                {units === "metric" ? " m/s" : " mph"}
                            </p>
                        </div>

                        <div className="current-weather-container">
                            <p className="">Wind Gust</p>
                            <p className="">{Math.round(gust)}
                                {units === "metric" ? " m/s" : " mph"}
                            </p>
                        </div>
            
                        <div className="current-weather-container">
                            <p>Humidity</p>
                            <p>{humidity}%</p>
                        </div>
                                
                        <div className="current-weather-container">
                            <p>Pressure</p>
                            <p>
                                {units === "metric"
                                    ? `${weatherData.main.pressure} hPa`
                                    : `${(weatherData.main.pressure * 0.02953).toFixed(2)} inHg`
                                }
                            </p>
                        </div>
                        
                        
                    </div>
                 </div>

                 <div className="weather-icon">
                  
                    <img
                        src={`http://openweathermap.org/img/wn/${icon}@4x.png`}
                        alt={description}
                    />
                    <p>{description}</p>
				</div>
            </div>
           
        )
    }
   
   
};

export default today;
