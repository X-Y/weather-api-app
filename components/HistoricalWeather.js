import { WeatherDisplay } from './WeatherDisplay';
import { fetchCoordinates, fetchWeatherData } from '../lib/queries';
import { getUnits } from '../lib/states'
import { getDataSliceWithUnit } from '../lib/utils'

export class HistoricalWeather extends WeatherDisplay {
  constructor() {
    super();
  }

  displayHistoricalData(data) {
    const historicalDataDiv = this.container;
    historicalDataDiv.innerHTML = "<h3>Historical Weather Data</h3>";

    // Only take the 7 first entries to avoid cluttering the interface
    const daily_temperature_2m_max = getDataSliceWithUnit(data, 'daily', 'temperature_2m_max').slice(0, 7);
    const daily_temperature_2m_min = getDataSliceWithUnit(data, 'daily', 'temperature_2m_min');

    daily_temperature_2m_max.forEach((tempMax, index) => {
      const div = document.createElement("div");
      const tempMin = daily_temperature_2m_min[index];
      div.textContent = `Day ${index + 1}: Max Temp: ${tempMax}, Min Temp: ${tempMin}`;
      historicalDataDiv.appendChild(div);
    });
  }

  async getWeatherForCity(city) {
    const { temperature } = getUnits();

    fetchCoordinates(city)
      .then((coords) => fetchWeatherData({ latitude: coords.lat, longitude: coords.lon, temperature_unit: temperature, daily: ['temperature_2m_max', 'temperature_2m_min'], past_days: 10 }))
      .then((data) => {
        this.displayHistoricalData(data);
      })
      .catch((error) =>
        this.handleError(error, "Error fetching historical data."),
      );
  }

}