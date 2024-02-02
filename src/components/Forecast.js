import "./forecast.css";
function Forecast({ item, degreeCel, degreeConvertor }) {
  return (
    <div className="forecast-card">
      <h4>Date : {item?.dt_txt.split(" ")[0]}</h4>
      <img
        src={`https://openweathermap.org/img/wn/${item?.weather[0]?.icon}@2x.png`}
        alt="Weather_image"
      />
      <h5 style={{ textTransform: "capitalize" }}>
        {item?.weather[0]?.description}
      </h5>
      <h5>
        Temperature : {degreeConvertor(item?.main?.temp)}{" "}
        {degreeCel ? "°F" : "°C"}
      </h5>
      <h5>Humidity : {item?.main?.humidity} %</h5>
    </div>
  );
}

export default Forecast;
