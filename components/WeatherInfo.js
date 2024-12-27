import { WeatherDisplay } from './WeatherDisplay';
import { fetchCoordinates, fetchWeatherData } from '../lib/queries';
import { getUnits } from '../lib/states'
import { getDataSliceWithUnit } from '../lib/utils'

export class WeatherInfo extends WeatherDisplay {
  constructor() {
    super();
  }

  displayWeather(data) {
    const current = getDataSliceWithUnit(data, 'current', 'temperature_2m');

    this.container.innerHTML = `
      <h2>Current Weather</h2>
      <p>Temperature: ${current}</p>
    `;
  }

  async getWeatherForCity(city) {
    const { temperature } = getUnits();

    fetchCoordinates(city)
      .then((coords) => fetchWeatherData({ latitude: coords.lat, longitude: coords.lon, temperature_unit: temperature, current: 'temperature_2m' }))
      .then((data) => this.displayWeather(data))
      .catch((error) =>
        this.handleError(error, "Failed to fetch weather data."),
      );
  }

}