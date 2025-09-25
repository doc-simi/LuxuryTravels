import countries from './countries.json';
import airports from './airports.json';
import reviews from './reviews.json';
import slides from './destinations.json';

import {
  FETCH__COUNTRY__FLAG,
  FETCH__AIRPORTS,
  SEARCH__FLIGHTS,
  SEARCH__IMAGES,
  GET_SLIDE_PHOTO,
} from './helpers.js';

export const airportState = {
  results: [],
  selected: {
    code: '',
    coordinates: {
      lat: null,
      lon: null,
    },
    country_code: '',
    name: '',
  },
};

export const activeDestination = {};

export let formState = {};

export const countriesState = {
  getAll() {
    return countries;
  },

  find(query) {
    const matchedCountries = Array.from(countries).filter(i =>
      i.name.toLowerCase().includes(query.toLowerCase().trim())
    );

    const results = matchedCountries.map(i => ({
      country: i.name,
      code: i.code,
      currency: i.currency,
    }));

    if (results.length < 1)
      throw new Error('No results found for this keyword...');

    return results;
  },
};

export const findFlag = async function (code) {
  try {
    const data = await FETCH__COUNTRY__FLAG(code);
    return data[0].flags;
  } catch (error) {
    console.error(error);
  }
};

export const searchAirport = function (code) {
  const airportsList = airports
    .filter(
      airport =>
        airport.iata_type === 'airport' &&
        airport.flightable &&
        airport.country_code === code
    )
    .map(airport => airport)
    .sort((a, b) => a.name.localeCompare(b.name));
  airportState.results = airportsList;
  return airportsList;
};

export const selectAirport = function (code) {
  const selected = airportState.results.find(item => item.code === code);
  Object.assign(airportState.selected, {
    code: selected.code,
    coordinates: {
      lat: selected.coordinates.lat,
      lon: selected.coordinates.lon,
    },
    country_code: selected.country_code,
    name: selected.name,
  });
};

export const updateFormState = function (formData) {
  formState = formData;
  formState.departure_id = airportState.selected.code;
};

export const searchFlights = async function (params) {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`http://localhost:3000/flights?${query}`);

    if (!response.ok) throw new Error('Failed to fetch flights');

    const data = await response.json();
    // console.log('✈️ Flight Data:', data);
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
};

export const fetchReviews = function () {
  const index = Array.from({ length: 3 }, () => Math.floor(Math.random() * 20));
  return index.map(i => reviews[i]);
};

export const fetchImages = async function (query) {
  try {
    const data = await SEARCH__IMAGES(query);
    return data.results.slice(1, 8);
  } catch (error) {
    throw error;
  }
};

export const fetchSlides = function () {
  return slides;
};
