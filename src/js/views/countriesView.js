class CountriesView {
  _data;
  _searchQuery = document.querySelector('.flight__query');
  _renderTo = document.querySelector('.flight__query--results');
  _selectedCountry;
  _countryImg = document.querySelector('.flight__query--img');

  render(data) {
    this._data = data;

    this._clear();
    const markup = this._generateMarkup();
    this._renderTo.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup() {
    return this._data
      .map(item => {
        return `<li class="flight__query--item" data-country="${item.country}" data-code="${item.code}">${item.country} (${item.code})</li>`;
      })
      .join('');
  }

  _removeImg() {
    this._countryImg.classList.remove('flight__query--img-active');
  }

  _addImg() {
    this._countryImg.classList.add('flight__query--img-active');
  }

  selected(country, img, alt) {
    this._searchQuery.value = country;
    this._removeImg();
    this._clear();

    this._countryImg.src = img;
    this._countryImg.alt = alt ?? `Country flag of ${country}`;
    // setTimeout(this._addImg, 100);
    this._addImg();
  }

  renderEmpty() {
    this._clear();
    this._removeImg();
  }

  reset() {
    this.renderEmpty();
  }

  renderError(message) {
    this._clear();
    const markup = `<li class="flight__query--item"><i>${message}</i></li>`;
    this._renderTo.insertAdjacentHTML('afterbegin', markup);
  }

  getQuery() {
    return this._searchQuery.value;
  }

  addHandlerSearch(handler) {
    this._searchQuery.addEventListener('input', handler);
  }

  addHandlerSelect(handler) {
    this._renderTo.addEventListener('click', handler);
  }

  _clear() {
    this._renderTo.innerHTML = '';
  }
}

export default new CountriesView();
