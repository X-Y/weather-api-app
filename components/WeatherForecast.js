import { WeatherDisplay } from './WeatherDisplay';
import { fetchCoordinates, fetchWeatherData } from '../lib/queries';
import { getUnits } from '../lib/states'
import { getDataSliceWithUnit } from '../lib/utils'

export class WeatherForecast extends WeatherDisplay {
  constructor() {
    super();
    const list = document.createElement('ul');
    list.classList.add('container');
    list.innerHTML = this.container.innerHTML;
    this.shadowRoot.replaceChild(list, this.container);
  }

  displayWeather(data) {
    const forecastList = this.container;
    forecastList.innerHTML = "<h3>Weather Forecast</h3>";

    const daily_temperature_2m_max = getDataSliceWithUnit(data, 'daily', 'temperature_2m_max');
    const daily_temperature_2m_min = getDataSliceWithUnit(data, 'daily', 'temperature_2m_min');

    daily_temperature_2m_max.forEach((tempMax, index) => {
      const listItem = document.createElement("li");
      const tempMin = daily_temperature_2m_min[index];
      listItem.textContent = `Day ${index + 1}: Max Temp: ${tempMax}, Min Temp: ${tempMin}`;
      forecastList.appendChild(listItem);
    });
  }

  async getWeatherForCity(city) {
    const { temperature } = getUnits();

    fetchCoordinates(city)
      .then((coords) => fetchWeatherData({ latitude: coords.lat, longitude: coords.lon, temperature_unit: temperature, daily: ['temperature_2m_max', 'temperature_2m_min'] }))
      .then((data) => this.displayWeather(data))
      .catch((error) =>
        this.handleError(error, "Failed to fetch forecast."),
      );
  }

}
