import * as model from './model.js';
import slider from './views/sliderView';
import countries from './views/countriesView';
import searchAirportView from './views/searchAirportView.js';
import flightView from './views/flightView.js';
import modalWindow from './views/static/modalWindow.js';
import reviewsView from './views/reviewsView.js';
import galleryView from './views/galleryView.js';

if (module.hot) {
  module.hot.accept();
}

// 1.) Page Loads
// - get user's location:- Model
// - get user's country reverse geocoding:- Model
// - store data in Local Storage
// - get user's country code and fetch all flights
// - store flights in local storage

// reviewsView();

const controlCountrySearch = function () {
  try {
    const query = countries.getQuery();
    // Guard clause
    if (query.length < 2) {
      countries.renderEmpty();
      searchAirportView.renderEmpty();
      flightView.validateForm();
      return;
    }

    if (query.length >= 2) {
      const data = model.countriesState.find(query);
      countries.render(data);
    }
  } catch (error) {
    countries.renderError(error.message);
  }
};

const controlSelectCountry = async function (e) {
  const countryFlag = await model.findFlag(e.target.dataset.code);
  countries.selected(
    e.target.dataset.country,
    countryFlag.png,
    countryFlag.alt
  );
  const results = model.searchAirport(e.target.dataset.code);
  searchAirportView.renderHeader(e.target.dataset.country);
  if (results < 1)
    return searchAirportView.renderError('No airports found for this country');
  searchAirportView.render(results);
  searchAirportView.scroll();
};

const controlSelectAirport = function (code) {
  model.selectAirport(code);
  searchAirportView.renderSelectedAirport(model.airportState.selected);

  flightView.validateForm();
};

const controlUpdateFlightRequest = function () {
  // 1. Get form data from views
  const formData = flightView.generateForm();
  formData.arrival_id = model.activeDestination.code;

  model.updateFormState(formData);
  controlSearchFlights();
};

const controlSearchFlights = async function () {
  try {
    flightView.renderSpinner();
    // console.log(model.formState);
    const data = await model.searchFlights(model.formState);

    if (data.error) return flightView.renderError(data);

    flightView.render(data);
  } catch (error) {
    console.error(error);
  }
};

// controlSearchFlights();

const controlSelectFlight = async function (token) {
  try {
    flightView.addLoadingButton();
    const data = await model.searchFlights({
      ...model.formState,
      booking_token: token,
    });

    const url = data.search_metadata.google_flights_url;
    flightView.removeLoadingButton(url);
  } catch (error) {
    console.error(error);
  }
};

const controlRenderReviews = function () {
  const reviews = model.fetchReviews();
  reviewsView.render(reviews);
};

const controlFetchImages = async function () {
  try {
    // 1. Generate images using location as query. This should be gotten from model as active location.
    const data = await model.fetchImages(model.activeDestination.name);
    //2. render result to gallery
    galleryView.render(data);
  } catch (error) {
    console.error(error);
  }
};

const controlModalWindow = function () {
  modalWindow.closeWindow();
  slider.setSlideStatus(false);
  slider.startSliding();
  galleryView.reset();
};

const controlOpenModalWindow = function (code, name) {
  model.activeDestination.code = code;
  model.activeDestination.name = name;
  modalWindow.openWindow();
  slider.setSlideStatus(true);
  slider.stopSliding();
  if (model.formState.arrival_id !== model.activeDestination.code) {
    flightView.reset();
    searchAirportView.reset();
    countries.reset();
  }
};

const controlLoadSlideImages = function () {
  const images = model.fetchSlides();
  slider.render(images);
};

controlLoadSlideImages();
//============================================
// Handlers
countries.addHandlerSearch(controlCountrySearch);
countries.addHandlerSelect(controlSelectCountry);
searchAirportView.addHandlerSelect(controlSelectAirport);
flightView.addHandlerFormClick(controlUpdateFlightRequest);
flightView.addHandlerFlights(controlSelectFlight);
reviewsView.addHandlerRenderReviews(controlRenderReviews);
galleryView.addHandlerRenderImages(controlFetchImages);
modalWindow.addHandlerBtn(controlModalWindow);
slider.addHandlerOpenModal(controlOpenModalWindow);

// controlCountrySearch();

// =====================================================

const btn = document.querySelector('.theme-toggle');
// const root = document.documentElement;
// root.toggleAttribute('data-theme');

btn.addEventListener('click', () => {
  document.querySelector('.top-destinations').scrollIntoView({
    behavior: 'smooth',
  });
  // // document.documentElement.setAttribute('data-theme', 'dark');
  // if (root.getAttribute('data-theme') === 'dark') {
  //   root.removeAttribute('data-theme'); // back to light
  // } else {
  //   root.setAttribute('data-theme', 'dark'); // switch to dark
  // }
});
