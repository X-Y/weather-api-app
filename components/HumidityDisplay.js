import { WeatherDisplay } from './WeatherDisplay';
import { fetchCoordinates, fetchWeatherData } from '../lib/queries';
import { getUnits } from '../lib/states'
import { getDataSliceWithUnit } from '../lib/utils'

export class HumidityDisplay extends WeatherDisplay {
  constructor() {
    super();
    const list = document.createElement('ul');
    list.classList.add('container');
    list.innerHTML = this.container.innerHTML;
    this.shadowRoot.replaceChild(list, this.container);
  }

  displayWeather(data) {
    const forecastList = this.container;
    forecastList.innerHTML = "<h3>Hourly Humidity</h3>";

    // Take 24 entries for a full day
    const relative_humidity_2m = getDataSliceWithUnit(data, 'hourly', 'relative_humidity_2m').slice(0, 24);

    relative_humidity_2m.forEach((humidity, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Hour ${index + 1}: Relative Humidity: ${humidity}`;
      forecastList.appendChild(listItem);
    });
  }

  async getWeatherForCity(city) {
    const { temperature } = getUnits();

    fetchCoordinates(city)
      .then((coords) => fetchWeatherData({ latitude: coords.lat, longitude: coords.lon, temperature_unit: temperature, hourly: ['relative_humidity_2m'] }))
      .then((data) => this.displayWeather(data))
      .catch((error) =>
        this.handleError(error, "Failed to fetch forecast."),
      );
  }

}
