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
    const [time, setTime] = useState(new Date());

  function getWeatherData() {
    let apiUrl = `${baseUrl}weather?lat=${coordinates.lat}&lon=${
      coordinates.lon
    }&appid=${apiKey}&units=${"imperial"}`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data);
      });
  }

    useEffect(() => {
      const interval = setInterval(() => {
        setTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      const interval = setInterval(() => {
        getWeatherData();
      }, 10000);
      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        setCoordinates({ lat: latitude, lon: longitude });
      });
    }, []); 

    useEffect(() => {
      getWeatherData();
    }, [coordinates]); 

    return (
      <div className="Weather">
        <div
          className="weather-bg"
          style={{ backgroundImage: "url(../src/assets/sunset.jpg)" }}
        ></div>
        <div className="weather-header">
          <a href="/">
            <p className="weather-title">WeatherCentral</p>
          </a>
        </div>

        <div className="weather-datetime">
          <p className="weather-time">
            {time.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
          <div className="weather-date">
            <p className="">
              {time.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })}
            </p>
            <p className="weather-day">
              {time.toLocaleDateString("en-US", { weekday: "long" })}
            </p>
          </div>
        </div>

        <div className="weather-main">
          <a
            href={`https://www.google.com/maps/@${coordinates.lat},${coordinates.lon}`}
            target="_blank"
          >
            <p className="weather-location">{weatherData.name}</p>
          </a>
          <p className="weather-temp">
            {weatherData.main.temp.toFixed(0)}&deg;
          </p>
          <p className="weather-status">{weatherData.weather[0].main}</p>
          <div className="flex weather-temp-range">
            <p className="">L:{weatherData.main.temp_min.toFixed(0)}&deg;</p>
            <p className="">H:{weatherData.main.temp_max.toFixed(0)}&deg;</p>
          </div>
        </div>
      </div>
    );
}



/* <div className="flex">
<p className="">{coordinates.lat.toFixed(3)}</p>
<p className="">{coordinates.lon.toFixed(3)}</p>
</div> */

/* <p className="weather-temp-feels">
Feels Like: {weatherData.main.feels_like.toFixed(0)}&deg;
</p> */

/* <div className="flex weather-stats">
<p className="">Pressure: {weatherData.main.pressure}</p>
<p className="">Humidity: {weatherData.main.humidity}</p>
<p className="">
  <i className="fa-solid fa-wind"></i> {weatherData.wind.speed}
</p>
</div> */
