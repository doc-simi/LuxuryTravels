class AirportsView {
  _data;
  _resultHeader = document.querySelector('.booking__result--header');
  _renderTo = document.querySelector('.booking__result--content');
  _selected = document.querySelector('.flight__form--departureCode');

  render(data) {
    this._data = data;

    this._clear();
    const markup = this._generateMarkup();
    this._renderTo.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkup() {
    const markup = this._data
      .map(airport => {
        return `<li class="booking__result--item">
                <div class="booking__airport">
                  <div class="booking__airport--text">
                    <p class="booking__airport--name">
                      ${airport.name}
                    </p>
                    <p class="booking__airport--code">${airport.code}</p>
                  </div>
                  <div class="booking__airport--button">
                    <button class="booking__airport--btn btn">
                      select
                    </button>
                  </div>
                </div>
              </li>`;
      })
      .join('');
    return `<ul class="booking__result--list">${markup}</ul>`;
  }

  renderHeader(country) {
    this._clearHeader();
    const markup = `<h3 class="booking__result--heading heading heading--3">Airport search result for ${country}</h3>`;
    this._resultHeader.insertAdjacentHTML('afterbegin', markup);
  }

  renderEmpty() {
    this._clear();
    this._resultHeader.innerHTML = '';
    this._selected.innerHTML = '';
  }

  renderError(message) {
    this._clear();
    this._renderTo.innerHTML = `<i>${message}</i>`;
  }

  renderSelectedAirport(data) {
    this._selected.textContent = data.name;
    this._selected.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  addHandlerSelect(handler) {
    this._renderTo.addEventListener('click', function (e) {
      if (!e.target.classList.contains('booking__airport--btn')) return;

      const el = e.target
        .closest('.booking__airport')
        .querySelector('.booking__airport--code');
      handler(el.textContent);
    });
  }

  reset() {
    this.renderEmpty();
  }

  scroll() {
    this._renderTo.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  _clear() {
    this._renderTo.innerHTML = '';
  }

  _clearHeader() {
    this._resultHeader.innerHTML = '';
  }
}

export default new AirportsView();
