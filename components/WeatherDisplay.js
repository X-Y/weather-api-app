import store from '../lib/states';
import Logger from '../lib/Logger';

import style from './WeatherDisplay.css?raw';

export class WeatherDisplay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML =
      `
    <style>
      ${style}
    </style>
    <div class="container"></div>
    `;

    store.subscribe((state) => [state.city, state.unit], ([city]) => city && this.getWeatherForCity(city))
  }

  get container() {
    return this.shadowRoot.querySelector(".container")
  }

  displayLoading() {
    this.container.innerHTML = "Loading...";
  }

  handleError(e, message) {
    Logger.error(e);
    this.displayError(message);
  }
  displayError(message) {
    this.container.innerHTML =
      `<p class="error">${message}</p>`;
  }

  // Must be overriden by decendent classes
  async getWeatherForCity(city) {
    throw 'Not implemented'
  }
}




