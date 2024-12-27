import store from '../lib/states';

export class FavoriteCities {
  static init() {
    store.subscribe((state) => state.favoriteCities, this.updateFavoriteCities)
  }

  static updateFavoriteCities() {
    const favoriteCitiesList = document.getElementById("favoriteCities");
    favoriteCitiesList.innerHTML = "";
    const favoriteCities = store.getState().favoriteCities;
    favoriteCities.forEach((city) => {
      const listItem = document.createElement("li");
      listItem.textContent = city;
      listItem.addEventListener("click", () => {
        store.setState({ city })
      });

      // a remove button to remove an item from favorites list
      const removeButton = document.createElement("button");
      removeButton.classList.add('remove-button')
      removeButton.textContent = '❌';
      removeButton.addEventListener("click", (e) => {
        store.getState().removeFavoriteCity(city);
        e.stopImmediatePropagation();
      }, { useCapture: true });

      listItem.appendChild(removeButton);
      favoriteCitiesList.appendChild(listItem);
    });
  }
}