
const defaultWeatherData = {
  coord: {
    lon: -118.1476,
    lat: 33.761,
  },
  weather: [
    {
      id: 800,
      main: "Clear",
      description: "clear sky",
      icon: "01n",
    },
  ],
  base: "stations",
  main: {
    temp: 75,
    feels_like: 75,
    temp_min: 70,
    temp_max: 80,
    pressure: 1020,
    humidity: 71,
  },
  visibility: 10000,
  wind: {
    speed: 0,
    deg: 0,
  },
  clouds: {
    all: 0,
  },
  dt: 1671111859,
  sys: {
    type: 1,
    id: 4699,
    country: "US",
    sunrise: 1671115813,
    sunset: 1671151533,
  },
  timezone: -28800,
  id: 5367929,
  name: "Long Beach",
  cod: 200,
};


export {defaultWeatherData};