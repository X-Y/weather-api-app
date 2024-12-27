import store from '../lib/states';

export class Settings {
  static init() {
    const settingsButton = document.getElementById("settingsBtn");
    const saveSettingsButton = document.getElementById("saveSettingsBtn");
    const closeModal = document.querySelector(".close");

    settingsButton.addEventListener("click", Settings.openSettings);
    saveSettingsButton.addEventListener("click", Settings.saveSettings);
    closeModal.addEventListener("click", Settings.closeSettings);

    store.subscribe((state) => state.modalOpen, Settings.showHideSettings)

  }
  static openSettings() {
    store.setState({ modalOpen: true });
  }

  static closeSettings() {
    store.setState({ modalOpen: false });
  }

  static showHideSettings(modalOpen) {
    const modal = document.getElementById("settingsModal");
    modal.toggleAttribute('hidden', !modalOpen);

    // Reset dropdown value when modal is opened, to reflect state values
    const unit = store.getState().unit;
    document.getElementById("units").value = unit;
  }

  static saveSettings() {
    const unit = document.getElementById("units").value;
    store.setState({ unit });
    Settings.closeSettings();
  }

}