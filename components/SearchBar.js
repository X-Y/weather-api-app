import store from '../lib/states';

export class SearchBar {
  static init() {
    const searchButton = document.getElementById("searchBtn");

    searchButton.addEventListener("click", SearchBar.handleSearch);
  }
  static handleSearch() {
    const cityInput = document.getElementById("cityInput").value;
    if (cityInput) {
      store.getState().chooseCity(cityInput)
    }
  }


}