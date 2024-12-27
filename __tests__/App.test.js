import { getByText, getByPlaceholderText, getByRole, queryByText, within, waitFor, fireEvent, prettyDOM } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { Window, CustomElementRegistry } from 'happy-dom'
import html from '../index.html?raw';
import { renderDom } from '../app';
import { afterEach, beforeEach, describe } from 'vitest';
import store from '../lib/states';
import { queryClient } from '../lib/queries';

const useSearch = async (city = 'Stockholm') => {
  const input = getByPlaceholderText(document.body, 'Enter city name');
  const button = getByText(document.body, 'Search');
  await userEvent.clear(input);
  await userEvent.type(input, city);
  await userEvent.click(button);
};
const clickFavoriteCity = async (city = 'Stockholm') => {
  const button = getByText(document.getElementById('favoriteCities'), city);
  await userEvent.click(button);
}
const clickFavoriteCityRemove = async (city = 'Stockholm') => {
  const favoriteCity = getByText(document.getElementById('favoriteCities'), city);
  const removeBtn = getByText(favoriteCity, '❌')
  await userEvent.click(removeBtn);
}
const clickPresetCity = async (city = 'New York') => {
  await userEvent.click(getByRole(document.querySelector('.preset-buttons'), 'button', { name: city }));
}
const selectTemperatureUnit = async () => {
  const modal = getByText(document.getElementById('settingsModal'), 'Settings');
  await userEvent.click(document.getElementById('settingsBtn'));
  expect(modal).toBeVisible();
  const unitsSelect = document.getElementById('units')
  await userEvent.selectOptions(unitsSelect, ['imperial']);
  await userEvent.click(document.getElementById('saveSettingsBtn'));

}


describe('App', () => {
  beforeEach(() => {
    window = new Window();
    document = window.document;
    customElements = new CustomElementRegistry(window);
    document.write(html);
    queryClient.mount()

    renderDom()
  })
  afterEach(() => {
    store.setState(store.getInitialState());

    try {
      queryClient.clear();

    } catch (e) {

    }
    queryClient.unmount()

  })
  it('renders title', () => {
    expect(getByText(document.body, 'Weather Dashboard'));
  })

  describe('when using search', () => {

    it('updates current weather', async () => {
      const comp = document.querySelector('weather-info');

      expect(comp.container.textContent).toEqual('')

      await useSearch('Stockholm');

      expect(comp.container.textContent).toMatch('Current Weather')
    })

    it('adds to favorite cities', async () => {
      const comp = document.querySelector('#favoriteCities');

      expect(comp.textContent).toEqual('')

      await useSearch('Stockholm');
      await useSearch('Shanghai');

      expect(comp.textContent).toMatch(/Stockholm.*Shanghai/)
    })
    it('updates historical weather data', async () => {
      const comp = document.querySelector('historical-weather');

      expect(comp.container.textContent).toEqual('')

      await useSearch('Stockholm');

      expect(comp.container.textContent).toMatch('Historical Weather Data')
    })
    it('updates weather forcast', async () => {
      const comp = document.querySelector('weather-forecast');

      expect(comp.container.textContent).toEqual('')

      await useSearch('Stockholm');

      expect(comp.container.textContent).toMatch('Day 1: Max Temp: 11 °C')
    })
    it('updates humidity display', async () => {
      const comp = document.querySelector('humidity-display');

      expect(comp.container.textContent).toEqual('')

      await useSearch('Stockholm');

      expect(comp.container.textContent).toMatch('Hour 1: Relative Humidity: 49 %')
    })
  })

  describe('favoriute cities', () => {
    beforeEach(async () => {
      await useSearch('Stockholm');
      await clickPresetCity('New York');
    })

    describe('when clicking on favorite cities', () => {
      it('updates current weather', async () => {
        const comp = document.querySelector('weather-info');

        expect(comp.container.textContent).toMatch('Temperature: 1 °C')

        await clickFavoriteCity('Stockholm');

        expect(comp.container.textContent).toMatch('Current Weather')
      })
      it('updates historical weather data', async () => {
        const comp = document.querySelector('historical-weather');

        expect(comp.container.textContent).toMatch('Max Temp: 1 °C')

        await clickFavoriteCity('Stockholm');

        expect(comp.container.textContent).toMatch('Max Temp: 11 °C')
      })
      it('updates weather forcast', async () => {
        const comp = document.querySelector('weather-forecast');

        expect(comp.container.textContent).toMatch('Max Temp: 1 °C')

        await clickFavoriteCity('Stockholm');

        expect(comp.container.textContent).toMatch('Max Temp: 11 °C')
      })
      it('')
    })
    describe('when clicking on delete button', () => {
      it('removes the city', async () => {
        const container = document.getElementById('favoriteCities');

        await clickFavoriteCityRemove('New York');
        expect(queryByText(container, 'New York')).not.toBeInTheDocument();
        expect(getByText(container, 'Stockholm')).toBeInTheDocument();

        await clickFavoriteCityRemove('Stockholm');
        expect(queryByText(container, 'Stockholm')).not.toBeInTheDocument();

      })
    })
  });

  describe('when clicking on preset buttons', () => {
    it('updates current weather', async () => {
      const comp = document.querySelector('weather-info');

      expect(comp.container.textContent).toEqual('')

      await clickPresetCity('New York');

      expect(comp.container.textContent).toMatch('Temperature: 1 °C')
    })
    it('updates historical weather data', async () => {
      const comp = document.querySelector('historical-weather');

      expect(comp.container.textContent).toEqual('')

      await clickPresetCity('New York');

      expect(comp.container.textContent).toMatch('Max Temp: 1 °C')
    })
    it('updates weather forcast', async () => {
      const comp = document.querySelector('weather-forecast');

      expect(comp.container.textContent).toEqual('')

      await clickPresetCity('New York');

      expect(comp.container.textContent).toMatch('Max Temp: 1 °C')
    })
  })

  describe('settings button', () => {
    it('opens dialogue when clicked', async () => {
      const modal = getByText(document.getElementById('settingsModal'), 'Settings');
      expect(modal).not.toBeVisible();
      await userEvent.click(document.getElementById('settingsBtn'));
      expect(modal).toBeVisible();
    })
    describe('temperature unit', () => {
      it('when saved, refreshes interface temperature units', async () => {
        const comp = document.querySelector('weather-info');

        await clickPresetCity('New York');
        await selectTemperatureUnit();

        expect(comp.container.textContent).toMatch('Temperature: 1 °F')
      })
      it('after saved, updating the interface will keep using the new unit', async () => {
        const comp = document.querySelector('weather-info');

        await clickPresetCity('London');
        await selectTemperatureUnit();
        await clickPresetCity('New York');

        expect(comp.container.textContent).toMatch('Temperature: 1 °F')

      })
    })
  })

})