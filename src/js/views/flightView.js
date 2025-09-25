import './static/S__flightView';
import { convertTime, formatToWeekday } from '../helpers';
import travelIcon from 'url:../../media/travel.png';

// ===============================================
// TO BE CONTINUED

class FlightViews {
  _data;
  _form = document.querySelector('.flight__form');
  _btn = document.querySelector('.flight__form--btn');
  _roundTrip = document.querySelector('#round-trip');
  _oneWay = document.querySelector('#one-way');
  _arrivalDate = document.querySelector('.flight__arrivalDate');
  _tripType = document.querySelectorAll('input[name="tripType"]');
  _booking_token;
  _selectFlightBtn;

  _formData;
  _resultHeader = document.querySelector('.booking__result--header');
  _renderTo = document.querySelector('.booking__result--content');

  constructor() {
    this._disableSubmit();
    this.generateForm();
    this._toggleArrivalOption();
  }

  render(data) {
    this._data = data;
    const bestFlights = this._createBestFlightContainer();
    const otherFlights = this._createOtherFlightContainer();
    const nav = this._generateNav();

    this._clear();
    this._renderHeader();
    this._renderTo.insertAdjacentHTML('afterbegin', nav);
    this._renderTo.insertAdjacentElement('beforeend', bestFlights);
    this._renderTo.insertAdjacentElement('beforeend', otherFlights);
    this._toggleTabs();
    this._resultDropdown();
  }

  // Structure of Flights
  // NAV
  // Body > Best Flights, Other Flights
  // Item
  //    Summary
  //    Main body > flight, layover
  _renderHeader() {
    const location = this._data.airports[0];
    const markup = `<div class="booking__result--header-departure">
                  <img
                    src="${location.departure[0].thumbnail}"
                    alt=""
                    class="booking__result--header-img"
                  />
                  <span>${location.departure[0].city}, ${location.departure[0].country}</span>
                </div>
                <img
                  src="${travelIcon}"
                  alt=""
                  class="booking__result--header-travelIcon"
                />
                <div class="booking__result--header-arrival">
                  <img
                    src="${location.arrival[0].thumbnail}"
                    alt=""
                    class="booking__result--header-img"
                  />
                  <span>${location.arrival[0].city}, ${location.arrival[0].country}</span>
                </div>`;
    this._clearHeader();
    this._resultHeader.insertAdjacentHTML('afterbegin', markup);
  }

  _createFlightItem(flight) {
    const container = document.createElement('div');
    container.className = 'booking__result--flight';

    // Summary
    const markupSummary = this._generateFlightSummary(flight);
    container.insertAdjacentHTML('afterbegin', markupSummary);

    const markupBody = this._generateMain(flight);
    container.insertAdjacentHTML('beforeend', markupBody);

    return container;
  }

  _createBestFlightContainer() {
    const div = document.createElement('div');
    div.id = 'best__flights';
    div.className = 'booking__result--flights active';
    const bestFlights = this._data.best_flights;
    if (!bestFlights) {
      const noFlights = document.createElement('div');
      noFlights.className = 'booking__result--no-flight';
      noFlights.innerHTML =
        '<i>No flights here. Kindky check "Other Flights"<i/>';

      div.insertAdjacentElement('afterbegin', noFlights);
      return div;
    }
    bestFlights.forEach(item => {
      div.insertAdjacentElement('beforeend', this._createFlightItem(item));
    });

    return div;
  }

  _createOtherFlightContainer() {
    const div = document.createElement('div');
    div.id = 'other__flights';
    div.className = 'booking__result--flights';
    const otherFlights = this._data.other_flights;
    otherFlights.forEach(item => {
      div.insertAdjacentElement('beforeend', this._createFlightItem(item));
    });

    return div;
  }

  // Generating the summary card a flight entry
  _generateFlightSummary(flight) {
    // prettier-ignore
    const markup = `<i
              class="booking__result--dropdown fa-solid fa-chevron-down"
            ></i>
            <div class="booking__result--summary active">
              <div class="booking__result--img-box">
                <img
                  src="${flight.airline_logo}"
                  alt="Airline logo"
                  class="booking__result--img"
                />
              </div>
              <div class="booking__result--summary-airlines">
                ${[...new Set (flight.flights.map(i => i.airline))].join('; ')}
              </div>
              <div class="booking__result--summary-time-code">
                <h3 class="booking__result--summary-time">${formatToWeekday(flight.flights[0].departure_airport.time).time}</h3>
                <h5 class="booking__result--summary-code">${flight.flights[0].departure_airport.id}</h5>
              </div>
              <div class="booking__result--summary-flight-details">
                <h3 class="heading booking__result--summary-date">
                  ${formatToWeekday(flight.flights[0].departure_airport.time).date}
                </h3>
                <p class="booking__result--summary-duration">
                  ${convertTime(flight.total_duration)}
                </p>
                <img
                  src="${travelIcon}"
                  alt="travel icon"
                  class="booking__result--summary-travelIcon"
                />
                <p class="booking__result--summary-stop">${flight.layovers && flight.layovers.length > 0
                      ? `${flight.layovers.length} ${flight.layovers.length === 1 ? "stop" : "stops"}`
                      : "Nonstop"
                  }</p>
              </div>
              <div class="booking__result--summary-time-code">
                <h3 class="booking__result--summary-time">${formatToWeekday(flight.flights.at(-1).arrival_airport.time).time}</h3>
                <h5 class="booking__result--summary-code">${flight.flights.at(-1).arrival_airport.id}</h5>
              </div>
              <h4 class="heading booking__result--summary-price">
                ${flight.price ? `$ ${flight.price}` : 'Price Unavailable'}
              </h4>
              
            </div>`
    return markup;
  }

  _generateFlightInfo(flight) {
    // prettier-ignore
    const markup = `<div class="booking__result--main-details">
                <div class="booking__result--img-box">
                  <img
                    src="${flight.airline_logo}"
                    alt=""
                    class="booking__result--img"/>
                </div>
                <div class="booking__result--main-icons-box">
                  <i class="fa-regular fa-circle"></i>
                  <i class="fa-solid fa-ellipsis-vertical"></i>
                  <i class="fa-regular fa-circle-dot"></i>
                </div>
                <div class="booking__result--main-info">
                  <div class="booking__result--main-departure">
                    ${formatToWeekday(flight.departure_airport.time).time} &middot; ${flight.departure_airport.name} (${flight.departure_airport.id})
                  </div>
                  <div class="booking__result--main-travel-time">
                    Travel time: ${convertTime(flight.duration)} ${flight.overnight ? '&middot; Overnight <i class="fa-solid fa-triangle-exclamation color--red"></i>' : ''}
                  </div>
                  <div class="booking__result--main-arrival">
                    ${formatToWeekday(flight.arrival_airport.time).time} &middot; ${flight.arrival_airport.name} (${flight.arrival_airport.id})
                  </div>
                  <div class="booking__result--main-flight-details">
                    ${flight.airline} &middot; ${flight.airplane} &middot; ${flight.flight_number}
                  </div>
                </div>
              </div>`
    return markup;
  }

  _generateFlightLayover(layover) {
    // prettier-ignore
    const markup = `<div class="booking__result--main-layover">
                      ${convertTime(layover.duration)} layover &middot; ${layover.name} (${layover.id}) ${layover.overnight ? '&middot; Overnight layover <i class="fa-solid fa-triangle-exclamation color--red"></i>' : ''}
                    </div>`
    return markup;
  }

  _generateMainHeader(flight) {
    return `<div class="booking__result--main-header">
              <div class="booking__result--img-box">
                <img
                  src="${flight.airline_logo}"
                  alt="Airline logo"
                  class="booking__result--img"
                />
              </div>
              <h3 class="heading booking__result--main-date">
                ${
                  formatToWeekday(flight.flights[0].departure_airport.time).date
                }
              </h3>
              <button value=${
                flight.booking_token
              } class="btn-2 booking__result--main-btn">
                Select Flight
              </button>
              <h4 class="heading booking__result--main-price">
                ${flight.price ? `$ ${flight.price}` : 'Price Unavailable'}
              </h4>
            </div>`;
  }

  _generateMain(flight) {
    const flights = flight.flights;
    const layovers = flight.layovers;
    const mainHeader = this._generateMainHeader(flight);
    const mainBody = flights
      .map(
        (el, i) =>
          this._generateFlightInfo(el) +
          (layovers?.[i] ? this._generateFlightLayover(layovers[i]) : '')
      )
      .join('');
    const main = mainHeader + mainBody;

    return `<div class="booking__result--main">${main}</div>`;
  }

  _generateNav() {
    return `<nav class="booking__result--nav">
              <ul class="booking__result--nav-list">
                <li class="booking__result--nav-item nav__bestFlights">
                  <a href="#best__flights" class="booking__result--nav-link active"
                    >Best Flight(s)</a
                  >
                </li>
                <li class="booking__result--nav-item nav__otherFlights">
                  <a
                    href="#other__flights"
                    class="booking__result--nav-link"
                    >Other Flight(s)</a
                  >
                </li>
              </ul>
            </nav>`;
  }

  reset() {
    this._clear();
    this._clearHeader();
    this._form.reset();
    this._disableSubmit();
  }

  renderSpinner() {
    const markup = `<div class="booking__result--spinner">
                <div class="loader"></div>
              </div>`;
    this._clear();
    this._clearHeader();
    this._renderTo.insertAdjacentHTML('afterbegin', markup);
  }

  addLoadingButton() {
    const btn = this._selectFlightBtn;
    btn.disabled = true;
    btn.classList.add('active');
    btn.textContent = 'loading...';
  }

  removeLoadingButton(url) {
    const btn = this._selectFlightBtn;
    btn.disabled = false;
    btn.dataset.url = url;
    btn.classList.remove('active');
    btn.textContent = 'book now';
  }

  _resultDropdown() {
    const icon = document.querySelectorAll('.booking__result--dropdown');
    icon.forEach(el =>
      el.addEventListener('click', function (e) {
        // const conatiner
        const item = e.target.closest('.booking__result--flight');
        const summary = item.querySelector('.booking__result--summary');
        const main = item.querySelector('.booking__result--main');
        el.classList.toggle('active');
        if (el.classList.contains('active')) {
          summary.style.animation = 'fadeDown .2s';
          summary.classList.remove('active');
          main.classList.add('active');
          main.style.animation = 'fadeIn .3s .2s backwards';
        } else {
          main.style.animation = 'fadeDown .2s';
          main.classList.remove('active');
          summary.classList.add('active');
          summary.style.animation = 'fadeIn .3s .2s backwards';
        }
      })
    );
  }

  _toggleTabs() {
    const bestFlights = document.querySelector('#best__flights');
    const otherFlights = document.querySelector('#other__flights');
    const navbar = document.querySelector('.booking__result--nav');
    const navBestFlight = navbar.querySelector('a[href="#best__flights"]');
    const navOtherFlight = navbar.querySelector('a[href="#other__flights"]');
    navbar.addEventListener('click', function (e) {
      e.preventDefault();

      if (e.target.closest('.nav__bestFlights')) {
        otherFlights.classList.remove('active');
        navOtherFlight.classList.remove('active');
        bestFlights.classList.add('active');
        navBestFlight.classList.add('active');
        bestFlights.style.animation = 'fadeIn 1s .2s backwards';
      }
      if (e.target.closest('.nav__otherFlights')) {
        bestFlights.classList.remove('active');
        navBestFlight.classList.remove('active');
        otherFlights.classList.add('active');
        navOtherFlight.classList.add('active');
        otherFlights.style.animation = 'fadeIn 1s .2s backwards';
      }
    });
  }

  _disableSubmit() {
    this._btn.disabled = true;
    this._roundTrip.checked = true;
  }

  _toggleArrivalOption() {
    const arrivalDate = this._arrivalDate;
    this._tripType.forEach(i =>
      i.addEventListener('change', function (e) {
        if (e.target.value == 2) arrivalDate.disabled = true;
        if (e.target.value == 1) arrivalDate.disabled = false;
      })
    );
  }

  _clear() {
    this._renderTo.innerHTML = '';
  }

  _clearHeader() {
    this._resultHeader.innerHTML = '';
  }

  renderError(error) {
    this._clear();
    this._clearHeader();

    if (error.airports) {
      this._renderTo.innerHTML += `<div><i>No flight found for this trip: ${error.airports[0].departure[0].airport.name}, ${error.airports[0].departure[0].city}, ${error.airports[0].departure[0].country} to ${error.airports[0].arrival[0].airport.name}, ${error.airports[0].arrival[0].city}, ${error.airports[0].arrival[0].country}</i></div>`;
    } else {
      this._renderTo.innerHTML = `<i>There is no flight for this search. Kindly look at your request and make neccesary adjustments. <strong>${error.error}</strong></i>`;
    }
  }

  generateForm() {
    const form = new FormData(this._form);
    const formObject = Object.fromEntries(form.entries());
    if (this._arrivalDate.disabled) {
      this._formData = {
        departure_id: this._form.querySelector('.flight__form--departureCode')
          .textContent,
        outbound_date: formObject.departureDate,
        travel_class: formObject.class,
        adults: formObject.passenger,
        type: formObject.tripType,
      };
    } else {
      this._formData = {
        departure_id: this._form.querySelector('.flight__form--departureCode')
          .textContent,
        outbound_date: formObject.departureDate,
        return_date: formObject.arrivalDate,
        travel_class: formObject.class,
        adults: formObject.passenger,
        type: formObject.tripType,
      };
    }
    // this._formData = formObject;
    return this._formData;
  }

  validateForm() {
    const formData = this.generateForm();
    const list = Array.from(Object.values(formData));
    const state = list.some(item => !item);
    // const state = Array.from(formData).map(item => item);

    if (state) {
      this._btn.disabled = true;
      return;
    }
    this._btn.disabled = false;
  }

  addHandlerFormClick(handler) {
    this._form.addEventListener('change', this.validateForm.bind(this));
    this._form.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  addHandlerFlights(handler) {
    this._renderTo.addEventListener('click', e => {
      e.preventDefault();
      const flight = e.target.closest('.booking__result--flight');
      if (!flight) return;
      this._selectFlightBtn = e.target.closest('.booking__result--main-btn');
      if (!this._selectFlightBtn) return; // click wasn't on a button, ignore

      if (!this._selectFlightBtn.dataset.url) {
        const booking_token = this._selectFlightBtn.value;
        handler(booking_token);
      } else {
        window.open(this._selectFlightBtn.dataset.url, '_blank');
      }
    });
  }

  getBookingToken() {
    return this._booking_token;
  }
}

export default new FlightViews();
