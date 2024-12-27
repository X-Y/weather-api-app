import { createStore } from 'zustand/vanilla';
import { subscribeWithSelector } from 'zustand/middleware'

// Central state store
const store = createStore(subscribeWithSelector((set) => ({
  city: '',
  unit: 'metric',
  favoriteCities: [],
  modalOpen: false,

  chooseCity: (city) => set((state) => {
    const favoriteCitiesSet = new Set(state.favoriteCities);
    favoriteCitiesSet.add(city)
    return {
      favoriteCities: Array.from(favoriteCitiesSet),
      city
    }
  }),

  removeFavoriteCity: (city) => set((state) => ({
    favoriteCities: state.favoriteCities.filter(one => one !== city)
  }))
})))

export const getUnits = () => {
  const { unit } = store.getState();
  return unit === 'imperial' ? {
    temperature: 'fahrenheit',
  } : {
    temperature: 'celsius',
  }
}

export default store;