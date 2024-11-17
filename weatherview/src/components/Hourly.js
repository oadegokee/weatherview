import React from "react";
import "../styles/Hourly.css";

const Hourly = ({ forecastData, degreeType }) => {
    return (
        <div className="forecast-info">
            <p>Tri-Hourly Forecast</p>

            <div className="forecast-item-container">
                {forecastData && forecastData.list.map((item, index) => {
                        const { dt_txt, main, weather } = item;
                        const temp = main.temp;
                        const weatherIcon = weather[0].icon; 

                        // Function to format time
                        const formatTime = (dt_txt) => {
                            const date = new Date(dt_txt);
                            const form = {
                                hour: 'numeric',
                                hour12: true,
                            };
                            return date.toLocaleString('en-US', form);
                        };

                        return (
                            <div key={index} className="forecast-item">
                                <p>{formatTime(dt_txt)}</p>
                                <img
                                    src={`http://openweathermap.org/img/wn/${weatherIcon}.png`}
                                    alt={weather[0].description}
                                />
                                <p>{Math.round(temp)}{degreeType}</p>
                               
                                
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Hourly;
