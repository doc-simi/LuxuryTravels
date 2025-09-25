class ModalWindow {
  _modalWindow = document.querySelector('.bookings');
  _closeBtn = document.querySelector('.bookings__close');
  _nav = document.querySelector('.bookings__nav');
  _flight = document.querySelector('#flight__tab');
  _hotel = document.querySelector('#hotel__tab');
  _reviews = document.querySelector('#reviews__tab');
  _gallery = document.querySelector('#gallery__tab');
  _activeLink = document.querySelector('.flight__tab');
  _allTabs = document.querySelectorAll('.bookings__tab');

  constructor() {
    this._defaultActiveTab();
    this.addHandler();
  }

  openWindow() {
    this._modalWindow.style.display = 'flex';
  }

  closeWindow() {
    this._modalWindow.style.display = 'none';
  }

  _defaultActiveTab() {
    this._clearActive();
    this._allTabs.forEach(el => el.classList.remove('active'));
    this._flight.classList.add('active');
    this._activeLink.classList.add('active');
  }

  _clearActive() {
    const list = this._nav.querySelectorAll('li');
    list.forEach(el => el.classList.remove('active'));
  }

  _activateTab(tab) {
    this._clearActive();
    const toActivate = document.getElementById(tab.dataset.id);

    this._allTabs.forEach(el => el.classList.remove('active'));
    tab.classList.add('active');
    toActivate.classList.add('active');
    toActivate.style.animation = 'fadeIn .8s backwards';
    tab.style.animation = 'fadeIn .8s backwards';
  }

  addHandler() {
    this._nav.addEventListener('click', e => {
      e.preventDefault();
      const link = e.target.closest('.bookings__nav-item');
      this._activateTab(link);
    });
  }

  addHandlerBtn(handler) {
    this._closeBtn.addEventListener('click', () => {
      this._defaultActiveTab();
      document.querySelector('body').classList.remove('active');
      handler();
    });
  }
}

export default new ModalWindow();
