import "./index.css";
import { useState, useEffect } from "react";
import { defaultWeatherData } from "../data/defaulltData";


import eveningBg from "../../assets/bg/evening.jpg";
import morningBg from "../../assets/bg/morning.jpg";
import nightBg from "../../assets/bg/night.jpg";
import rainyNightBg from "../../assets/bg/rainyNight.jpg";


interface WeatherData {
  [key: string]: any[];
}

export default function Weather() {
  const apiKey = "014cab97ef25e0042a32c8f3eca831b7";
  const baseUrl = "https://api.openweathermap.org/data/2.5/";

  const [coordinates, setCoordinates] = useState(defaultWeatherData.coord);
  const [currentWeatherData, setCurrentWeatherData] =
    useState<any>(defaultWeatherData);
  const [weatherData, setWeatherData] = useState<WeatherData>({});
  const [detailed, setDetailed] = useState(false);
  const [time, setTime] = useState(new Date());
  const [currentBg, setCurrentBg] = useState(eveningBg);




function changeBackground() {
      const hours = time.getHours();
      if (hours >= 6 && hours < 12) {
        setCurrentBg(morningBg);
      } else if (hours >= 12 && hours < 18) {
        setCurrentBg(eveningBg);
      } else if (hours >= 18 || hours < 6) {
        setCurrentBg(nightBg);
      }
}


  function getWeatherData() {
    let apiUrl = `${baseUrl}weather?lat=${coordinates.lat}&lon=${
      coordinates.lon
    }&appid=${apiKey}&units=${"imperial"}`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setCurrentWeatherData(data);
      });

    let apiUrl2 = `${baseUrl}forecast?lat=${coordinates.lat}&lon=${
      coordinates.lon
    }&appid=${apiKey}&units=${"imperial"}`;
    fetch(apiUrl2)
      .then((res) => res.json())
      .then((data) => {
        const groupedData = data.list.reduce((acc: any, curr: any) => {
          const day = curr.dt_txt.split(" ")[0];
          if (!acc[day]) {
            acc[day] = [];
          }
          acc[day].push(curr);
          return acc;
        }, {});

        const entries = Object.entries(groupedData);
        const limitedEntries = entries.slice(0, 5);
        const limitedObj: any = Object.fromEntries(limitedEntries);
        setWeatherData(limitedObj);
      });
  }

  function renderDate(dateStr: any) {
    const date = new Date(dateStr);
    const formattedDate = `${date.toLocaleString("default", {
      weekday: "short",
    })} ${date.getDate()}`;
    return formattedDate;
  }

  function renderHour(dateStr: any) {
    const date = new Date(dateStr);
    const hours = date.toLocaleString("en-US", {
      hour: "numeric",
      hour12: true,
    });

    return (
        <p>{hours}</p>
    );
  }

  function renderDailyAverage(dayData: any) {
    const count = dayData.length;
    const totalTemp = dayData.reduce(
      (sum: any, data: any) => sum + data.main.temp,
      0
    );
    const totalMaxTemp = dayData.reduce(
      (sum: any, data: any) => sum + data.main.temp_max,
      0
    );
    const totalMinTemp = dayData.reduce(
      (sum: any, data: any) => sum + data.main.temp_min,
      0
    );

    let averageData = {
      avgTemp: count > 0 ? (totalTemp / count).toFixed(0) : 0,
      avgMaxTemp: count > 0 ? (totalMaxTemp / count).toFixed(2) : 0,
      avgMinTemp: count > 0 ? (totalMinTemp / count).toFixed(2) : 0,
    };

    return (
      <div className="">
        <p>{averageData.avgTemp}&deg;</p>
        {/* <p>{averageData.avgMaxTemp}</p>
      <p>{averageData.avgMinTemp}</p> */}
      </div>
    );
  }

  function toggleDetailed() {
    setDetailed((prevVal) => !prevVal);
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
    changeBackground();
  }, []);

  useEffect(() => {
    getWeatherData();
  }, [coordinates]);

  return (
    <div className="Weather">
      <div className="weather-bg" style={{ backgroundImage: `url(${currentBg})`, backgroundSize: "cover" }}></div>

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
          <p className="weather-location">{currentWeatherData.name}</p>
        </a>
        <p className="weather-temp">
          {currentWeatherData.main.temp.toFixed(0)}&deg;
        </p>
        <p className="weather-status">{currentWeatherData.weather[0].main}</p>
        <div className="flex weather-temp-range">
          <p className="">
            L:{currentWeatherData.main.temp_min.toFixed(0)}&deg;
          </p>
          <p className="">
            H:{currentWeatherData.main.temp_max.toFixed(0)}&deg;
          </p>
        </div>

        <div className="forecast" onClick={toggleDetailed}>
          {Object.entries(weatherData).map(([key, value]) => {
            return (
              <div className="forecast-day" key={key}>
                <p className="day-name">{renderDate(key)}</p>

                <div className="">
                  {detailed ? (
                    <>
                      {value.map((hour: any) => {
                        return (
                          <div className="hour-row" key={hour.dt_txt}>
                            {renderHour(hour.dt_txt)}
                            <p className="">{hour.main.temp.toFixed(0)}&deg;</p>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <div className="avg-row">{renderDailyAverage(value)}</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
