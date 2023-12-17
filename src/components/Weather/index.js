import { Component } from "react";

import { Audio } from "react-loader-spinner";

import NewWeather from "../NewWeather";
import "./index.css";
const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const englandCities = [
  { name: "London", population: 8982000 },
  { name: "Birmingham", population: 1141000 },
  { name: "Manchester", population: 547600 },
  { name: "Glasgow", population: 626400 },
  { name: "Liverpool", population: 498042 },
  { name: "Newcastle", population: 155700 },
  { name: "Sheffield", population: 582506 },
  { name: "Bristol", population: 463400 },
  { name: "Leeds", population: 789194 },
  { name: "Nottingham", population: 331000 },
];

class Weather extends Component {
  state = {
    primeDeals: [],
    apiStatus: apiStatusConstants.initial,
    city: "London",
    searchCity: "",
  };

  componentDidMount() {
    this.getPrimeDeals();
  }

  getPrimeDeals = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    });

    const { city } = this.state;

    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=70788039cb8e3f1ac5addc8d86db5aba`;
    const options = {
      method: "GET",
    };
    const response = await fetch(apiUrl, options);
    if (response.ok === true) {
      const fetchedData = await response.json();

      this.setState({
        primeDeals: fetchedData,
        apiStatus: apiStatusConstants.success,
      });
    }
    if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      });
    }
  };

  onCityChange = (event) => {
    this.setState({ city: event.target.value }, this.getPrimeDeals);
  };

  onSearchCity = (event) => {
    this.setState({ searchCity: event.target.value });
  };

  render() {
    const { primeDeals, apiStatus, searchCity } = this.state;

    const country = englandCities.filter((each) =>
      each.name.toLowerCase().includes(searchCity.toLowerCase())
    );

    // console.log(country, city);
    const citySelection = (
      <select
        onChange={this.onCityChange}
        id="cityOfEng"
        className="countryOption"
      >
        {country.map((each) => (
          <option key={each.population} value={each.name}>
            {each.name}
          </option>
        ))}
      </select>
    );

    const newWeatherMapping = primeDeals.map((each) => (
      <div key={each.country}>
        <NewWeather lat={each.lat} lon={each.lon} />
      </div>
    ));

    const loader = (
      <Audio
        height="80"
        width="80"
        radius="9"
        color="green"
        ariaLabel="loading"
        wrapperStyle
        wrapperClass
      />
    );
    const succesView = (
      <div className="successViewContainer">{newWeatherMapping}</div>
    );
    console.log("Weather", apiStatus);
    let finalView = "";
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        finalView = loader;
        break;
      case apiStatusConstants.success:
        finalView = succesView;
        break;

      default:
        finalView = "";
        break;
    }

    return (
      <div className="mainContainer">
        <div className="inputContainer">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            onChange={this.onSearchCity}
            value={searchCity}
            placeholder="Search City name here"
          />
        </div>{" "}
        <div className="labelContainer">
          <label htmlFor="cityOfEng">City of England</label>
          {citySelection}
        </div>
        <div></div>
        {finalView}
      </div>
    );
  }
}

export default Weather;
