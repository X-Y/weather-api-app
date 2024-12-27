import { WeatherForecast } from './components/WeatherForecast';
import { WeatherInfo } from './components/WeatherInfo';
import { HistoricalWeather } from './components/HistoricalWeather';
import { HumidityDisplay } from './components/HumidityDisplay';
import { FavoriteCities } from './components/FavoriteCities';
import { Settings } from './components/Settings';
import { SearchBar } from './components/SearchBar';
import { CityButtons } from './components/CityButtons';

export function renderDom() {
  FavoriteCities.init();
  Settings.init();
  SearchBar.init();
  CityButtons.init();

  // Initialize Web Components
  window.customElements.define("weather-info", WeatherInfo);
  window.customElements.define("weather-forecast", WeatherForecast);
  window.customElements.define("historical-weather", HistoricalWeather);
  window.customElements.define("humidity-display", HumidityDisplay);
}

document.addEventListener("DOMContentLoaded", function () {
  renderDom();
});


function displayError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
}

function displayLoading() {
  const loadingDiv = document.createElement("div");
  loadingDiv.textContent = "Loading...";
  document.body.appendChild(loadingDiv);
}

export default {};