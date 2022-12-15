import { render } from "react-dom"
import "./index.css"
import { useState, useEffect } from "react";
import { defaultWeatherData } from "./data/defaulltData";

// https://openweathermap.org/





export default function Weather() {

    const apiKey = "014cab97ef25e0042a32c8f3eca831b7";
    const baseUrl = "https://api.openweathermap.org/data/2.5/";

    const [coordinates, setCoordinates] = useState(defaultWeatherData.coord);
    const [weatherData, setWeatherData] = useState(defaultWeatherData);



    useEffect(() => {
      navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        setCoordinates({ lat: latitude, lon: longitude });
      });
    }, []); 

    useEffect(() => {
      let apiUrl = `${baseUrl}weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${"imperial"}`;
      console.log(apiUrl);
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          setWeatherData(data);
                console.log(data);

        });
    }, [coordinates]); 

    return (
      <div className="Weather">
        <h1 className="">Weather Central</h1>

        <div className="weather-datetime">
          <p className="weather-time">6:07 AM</p>
          <div className="">
            <p className="weather-date">6 Dec</p>
            <p className="weather-day">Thursday</p>
          </div>
        </div>

        <p className="weather-location">{weatherData.name}</p>
        {/* <div className="flex">
          <p className="">{coordinates.lat.toFixed(3)}</p>
          <p className="">{coordinates.lon.toFixed(3)}</p>
        </div> */}

        <p className="weather-temp">{weatherData.main.temp}</p>

        <div className="flex weather-temp-range">
          <p className="">L: {weatherData.main.temp_min}</p>
          <p className="">H: {weatherData.main.temp_max}</p>
        </div>

        <p className="weather-temp-feels">
          Feels Like: {weatherData.main.feels_like}
        </p>
        
        <div className="flex weather-stats">
          <p className="">Pressure: {weatherData.main.pressure}</p>
          <p className="">Humidity: {weatherData.main.humidity}</p>
          <p className="">
            <i className="fa-solid fa-wind"></i> {weatherData.wind.speed}
          </p>
        </div>
      </div>
    );
}