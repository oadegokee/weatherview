import React from "react";
import "../styles/Today.css";


const today = ({ weatherData }) => {
    if(weatherData != null) {
        // Destructure weather data from the props
        const { dt, main, sys, visibility, weather, wind} = weatherData;
        const {feels_like, humidity, pressure, temp, temp_max, temp_min} = main;
        const {sunrise, sunset} = sys;
        const {speed, deg} = wind;
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
                        <p className="current-weather">{temp}</p>
                        <p className="current-date">{formattedDate}</p>
                        <div className="high-low-info">
                            <p className="currrent-high">H: {temp_max}</p>
                            <p className="current-low">L: {temp_min}</p>
                        </div>
                    </div>
                     <div className="current-weather-info">
                        <div className="current-weather-container">
                            <p className="feels-like-label">Feel Like</p>
                            <p className="feels-like-value">{feels_like}</p>
                        </div>
                                
            
                        <div className="current-weather-container">
                            <p className="riseTime">Sunrise: {formatTime(sunrise)}</p>
                            <p className="setTime">Sunset: {formatTime(sunset)}</p>
                        </div>
    
                        <div className="current-weather-container">
                            <p className="windLabel">Wind Status</p>
                            <p className="windStatus">{speed}</p>
                        </div>
            
                        <div className="current-weather-container">
                            <p className="humidLabel">Humidity</p>
                            <p className="humidity">{humidity}</p>
                        </div>
                                
                        <div className="current-weather-container">
                            <p className="pLabel">Pressure</p>
                            <p className="pressure">{pressure}</p>
                        </div>
                        
                        <div className="current-weather-container">
                            <p className="visLabel">Visibility</p>
                            <p className="visibility">{visibility}</p>
                        </div>
                    </div>
                 </div>

                 <div className="weather-icon">
                    <img
                        src={`http://openweathermap.org/img/wn/${icon}@4x.png`}
                        alt={description}
                    />
				</div>
            </div>
           
        )
    }
   
   
};

export default today;
