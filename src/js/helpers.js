import {
  COUNTRIES__API,
  FLAGS_API,
  UNPLASH_API_SEARCH,
  UNPLASH_API_GET,
  UNSPLASH_KEY,
} from './config.js';

export const FETCH__COUNTRIES = async function () {
  try {
    const countries = await fetch(COUNTRIES__API);
    const res = countries.json();
    return res;
  } catch (error) {
    throw error;
  }
};

export const FETCH__COUNTRY__FLAG = async function (code) {
  try {
    const country = await fetch(`${FLAGS_API}${code}`);
    return country.json();
  } catch (error) {
    throw new error();
  }
};

export const FETCH__AIRPORTS = async function (code) {
  try {
    // const airports = await fetch(`${AIRPORTS_API}${code}/airports`);
    const airports = await fetch(
      `http://api.travelpayouts.com/data/en/airports.json`
    );
    return airports.json();
  } catch (error) {
    throw new error();
  }
};

export const GENERATE_URL = function (request) {
  return;
};

export const SEARCH__FLIGHTS = async function () {
  try {
    const res = await fetch('http://localhost:3000/flights'); // wait for response
    const data = await res.json(); // wait for JSON parsing
    return data;
  } catch (err) {
    throw err;
  }
};

export const SEARCH__IMAGES = async function (query) {
  try {
    const res = await fetch(`${UNPLASH_API_SEARCH}&query=${query}`);
    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export const GET_SLIDE_PHOTO = async function (photo_id) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/${photo_id}?client_id=${UNSPLASH_KEY}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const convertTime = function (totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}hr ${minutes}min`;
  } else if (hours > 0) {
    return `${hours}hr`;
  } else {
    return `${minutes}min`;
  }
};

export const formatToWeekday = function (dateTimeStr) {
  const [datePart, timePart] = dateTimeStr.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour24, minute] = timePart.split(':').map(Number);

  // Create Date object to get weekday
  const dateObj = new Date(year, month - 1, day);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // prettier-ignore
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const weekday = weekdays[dateObj.getDay()];
  const monthName = months[month - 1];

  // Formatted date like "Sun, Sep 28"
  const formattedDate = `${weekday}, ${monthName} ${day}`;

  // Convert 24-hour to 12-hour format with AM/PM
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12; // convert 0 → 12 for midnight
  const formattedTime = `${hour12}:${minute
    .toString()
    .padStart(2, '0')} ${ampm}`;

  return { date: formattedDate, time: formattedTime };
};
