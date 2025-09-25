// FUNCTIONS CALLS

// =========================================
// Opens Option Box
const showOptions = function (parent, nav) {
  const selectOptionArrow = parent.querySelector('.select-option__arrow');

  selectOptionArrow.classList.add('select-option__arrow--active');
  // Display Option box
  nav.classList.add('option-box__active');
};

const toggleOptions = function (items, T, O) {
  items.forEach((el, i) => {
    setTimeout(() => {
      el.style.transform = T;
      el.style.opacity = O;
    }, i * 50);
  });
};

// Choose Option
const chooseOption = function (e) {
  const selectedOption = this.querySelector('.selected-option');
  const selectedValue = this.querySelector('input');

  selectedOption.textContent = e.target.textContent;
  selectedValue.value = e.target.dataset.value;
  console.log(selectedValue);
  console.log(e.target);
  closeOptions();
};

// Closes Option Box
const closeOptions = function () {
  const select = document.querySelectorAll('.flight__form--select');
  select.forEach(el => {
    // Select the nav
    const nav = el.querySelector('.option-box nav');

    // Select the arrows
    const selectOptionArrow = el.querySelector('.select-option__arrow');

    // Select the items
    const items = nav.querySelectorAll('.option-box__item');

    if (nav.classList.contains('option-box__active'))
      toggleOptions(items, '', '');

    selectOptionArrow.classList.remove('select-option__arrow--active');
    nav.classList.remove('option-box__active');
  });
};

// Control Select fields
const controlOptions = function () {
  // This 2 lines selects the nav box
  const parent = this.closest('.flight__form--select');
  const nav = parent.querySelector('.option-box nav');

  // Select the items
  const items = nav.querySelectorAll('.option-box__item');

  // if nav box is active, close it
  if (nav.classList.contains('option-box__active')) {
    closeOptions();
    // else open it
  } else {
    closeOptions(); // Close any existing nav box
    showOptions(parent, nav);
    toggleOptions(items, 'scale(1)', '1');

    // Add clicking listeners to options
    items.forEach(el => {
      el.addEventListener('click', chooseOption.bind(parent));
    });
  }
};

// SELECT ELEMENTS

//==================================
// Select the pop Window
const window = document.querySelector('.bookings');

// The select field
const select = document.querySelectorAll('.select-option');

// EVENT LISTENERS
select.forEach(s => s.addEventListener('click', controlOptions));
window.addEventListener('click', e => {
  const selectBoxClicked = e.target.closest('.flight__form--select');
  if (selectBoxClicked === null) closeOptions();
});
