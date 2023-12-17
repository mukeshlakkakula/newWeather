import { Component } from "react";

import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class NewWeather extends Component {
  state = {
    primeDeals: {},
    newCity: this.props,
    apiStatus: apiStatusConstants.initial,
  };

  componentDidMount() {
    this.getPrimeDeals();
  }

  getPrimeDeals = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    });
    const { newCity } = this.state;
    const { lat, lon } = newCity;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=70788039cb8e3f1ac5addc8d86db5aba`;
    const options = {
      method: "GET",
    };
    const response = await fetch(apiUrl, options);
    if (response.ok === true) {
      const fetchedData = await response.json();

      this.setState({
        primeDeals: fetchedData,
        apiStatus: apiStatusConstants.success,
        main: fetchedData.weather[0].main,
        weather: fetchedData.weather[0].description,
        icon: fetchedData.weather[0].icon,
      });
    }
    if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      });
    }
  };

  render() {
    const { primeDeals, apiStatus, newCity, weather, icon, main } = this.state;
    // const { each } = this.props;

    // console.log("eachProp", each);

    // console.log("newWeather", primeDeals);
    console.log("new", weather, newCity, apiStatus);

    console.log("pm", primeDeals);
    const successView = (
      <div className="weatherContainer">
        <h1>{primeDeals.name}</h1>
        <p>
          <span>weather : </span> {weather}
        </p>
        {icon !== undefined ? (
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt="icon"
          />
        ) : (
          ""
        )}{" "}
        <p>{main}</p>
      </div>
    );

    return <div>{successView}</div>;
  }
}

export default NewWeather;
