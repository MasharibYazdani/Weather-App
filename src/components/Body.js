import { useEffect, useState } from "react";
import "./body.css";
import { API_KEY } from "../utils/constant";
import Forecast from "./Forecast";

function Body() {
  const [search, setSearch] = useState("");
  const [cityData, setCityData] = useState("");
  const [fullData, setFullData] = useState("");
  const [degreeCel, setDegreeCel] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWeather("New Delhi");
  }, []);

  const handleSearch = () => {
    if (search) {
      fetchWeather(search);
    }
    setError("");
  };

  const fetchWeather = async (city) => {
    try {
      const data = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      const dataJson = await data.json();

      if (dataJson?.message === "city not found") {
        setError(dataJson?.message);
      } else {
        setFullData(dataJson);
      }

      // Create a Set for unique dates in the next 6 days (including today)
      const uniqueDates = new Set();

      // Filter the data for the next 6 days and keep only unique dates
      const filteredData = dataJson.list.filter((item) => {
        const itemDate = item.dt_txt.split(" ")[0];

        if (uniqueDates.has(itemDate)) {
          return false; // Skip duplicate dates
        }

        uniqueDates.add(itemDate);
        return true;
      });

      setCityData(filteredData);
      setSearch("");
      setError("");
    } catch (error) {
      console.log("some error occured" + error);
    }
  };

  const handleDegree = () => {
    setDegreeCel(!degreeCel);
  };

  const degreeConvertor = (degree) => {
    if (degreeCel === false) {
      return degree;
    } else {
      return ((9 / 5) * degree + 32).toFixed(2);
    }
  };

  return (
    <>
      {cityData && fullData && (
        <div className="container">
          <div className="heading">
            <h1>Weather App</h1>
          </div>
          <div className="input">
            <input
              placeholder="Eg: Delhi, Mumbai "
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            ></input>
            <button onClick={handleSearch}> Search</button>
          </div>

          {error ? (
            <div className="error">
              City Not Found! Please Enter Correct City Name.
            </div>
          ) : (
            ""
          )}

          <div className="city-name">
            <h1>
              {fullData?.city?.name}, {fullData?.city?.country}{" "}
            </h1>
          </div>

          <div className="today-report">
            <div className="report-details">
              <h3>Date : {cityData[0]?.dt_txt.split(" ")[0]}</h3>
              <h4>
                Min Temperature : {degreeConvertor(cityData[0]?.main?.temp_min)}{" "}
                {degreeCel ? "°F" : "°C"}
              </h4>
              <h4>
                Max Temperature : {degreeConvertor(cityData[0]?.main?.temp_max)}{" "}
                {degreeCel ? "°F" : "°C"}
              </h4>
              <h4>Humidity : {cityData[0]?.main?.humidity} %</h4>
              <h4>Wind speed : {cityData[0]?.wind?.speed} m/s</h4>
              <h4>Wind Direction : {cityData[0]?.wind?.deg} degree</h4>
            </div>

            <div className="report-temp">
              <button onClick={handleDegree}>
                {degreeCel ? "Degree °C" : "Degree °F"}
              </button>
              <h1>
                {degreeConvertor(cityData[0]?.main?.temp)}{" "}
                {degreeCel ? "°F" : "°C"}
              </h1>
            </div>

            <div className="report-icon">
              <img
                src={`https://openweathermap.org/img/wn/${cityData[0]?.weather[0]?.icon}@4x.png`}
                alt="Weather_image"
              />
              <h4>{cityData[0]?.weather[0]?.description}</h4>
            </div>
          </div>

          <div className="forcast-hading">
            <h2>Five-Day Forecast</h2>
          </div>

          <div className="forecast-details">
            {cityData
              .map((item) => (
                <Forecast
                  key={item.dt}
                  item={item}
                  degreeConvertor={degreeConvertor}
                  degreeCel={degreeCel}
                />
              ))
              .slice(1, 6)}
          </div>
        </div>
      )}
    </>
  );
}

export default Body;
