import store from '../lib/states';

export class CityButtons {
  static init() {
    const cityButtons = document.querySelectorAll(".city-btn");

    cityButtons.forEach((button) => {
      button.addEventListener("click", () => {
        store.getState().chooseCity(button.dataset.city)
      });
    });

  }
}