import { useState } from "react";
import { getWeather } from "../api/weatherApi";

const useLandingPage = () => {
  const [weatherIconURL, setWeatherIconURL] = useState("http://openweathermap.org/img/wn/01d@2x.png");
  const success = (position) => {
    const lat = position.coords.latitude || 37.5642135;
    const lon = position.coords.longitude || 127.0016985;
    try {
      getWeather(lat, lon, setWeatherIconURL);
    } catch (error) {
      console.log("error :>> ", error);
      alert("날씨정보를 가져올 수 없습니다.");
    }
  };
  const fail = () => {
    try {
      getWeather(37.5642135, 127.0016985, setWeatherIconURL);
    } catch (error) {
      console.log("error :>> ", error);
      alert("날씨정보를 가져올 수 없습니다.");
    }
  };
  return { success, fail, weatherIconURL };
};

export default useLandingPage;
