class SliderViews {
  _data;
  _renderSlides = document.querySelector('.slides');
  _renderToDots = document.querySelector('.top-destinations__indicators');
  _renderThumb = document.querySelector('.destination__nextSlide');
  _nextBtnSelector = document.querySelector('#nextSlide');
  _prevBtnSelector = document.querySelector('#previousSlide');
  _currentSlide = 0;
  _openedSlide = false;
  _destinationItems =
    '.destination__title, .destination__name, .destination__details, .destination__button, .destination__description'; // Children elements class names of each slide
  _sliderInterval = null; // Set Interval value

  // set values at init
  _maxSlide;
  _slides = []; // Select all render slides
  _dots;
  _btns;

  // --- PRIVATE HELPERS ---
  _removeContents(slide) {
    slide.querySelectorAll(this._destinationItems).forEach(el => {
      el.style.transition = 'none';
      el.classList.remove('active');
      void el.offsetWidth; // force reflow
      el.style.transition = '';
    });
  }

  _addContents(slide) {
    slide.querySelectorAll(this._destinationItems).forEach(el => {
      el.classList.add('active');
    });
  }

  _goToSlide(slideIndex) {
    this._slides.forEach(s => this._removeContents(s));
    this._dots.forEach(dot => dot.classList.remove('active'));

    this._slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slideIndex)}%)`;
    });

    this._renderNextThumb(slideIndex + 1);

    const activeDot = document.querySelector(`.dot--${slideIndex}`);
    activeDot.classList.add('active');

    this._slides.forEach(s => this._addContents(s));
  }

  _renderNextThumb(index) {
    index = index === this._maxSlide ? 0 : index;
    const img = document.createElement('img');
    img.src = this._data[index].thumb;
    img.alt = `thumbnail ${index}`;
    img.classList.add('destination__nextSlide--img');
    img.style.animation = 'popUp .7s';
    this._renderThumb.innerHTML = '';
    this._renderThumb.insertAdjacentElement('afterbegin', img);
  }

  _reset() {
    this._slides.forEach(s => s.classList.toggle('destination__transition'));
  }

  // --- SLIDING METHODS ---
  _autoSlide = () => {
    if (this._currentSlide === this._maxSlide - 1) {
      this._reset();
      this._currentSlide = 0;
      this._goToSlide(this._currentSlide);
      void this._slides[0].offsetWidth;
      this._reset();
    } else {
      this._currentSlide++;
      this._goToSlide(this._currentSlide);
    }
  };

  startSliding() {
    if (this._openedSlide) return; // If modal window is opened, do not start sliding
    if (this._sliderInterval) clearInterval(this._sliderInterval); // Clear any previous intervals
    this._sliderInterval = setInterval(this._autoSlide, 3500); // Resume sliding
  }

  stopSliding() {
    if (this._sliderInterval) {
      clearInterval(this._sliderInterval);
      this._sliderInterval = null; // Set it to null so that startSliding will return
    }
  }

  _nextSlide = () => {
    // If currentSlide = 2:
    // (2 + 1) % 5 = 3 → move to slide index 3
    // If currentSlide = 4: --- last slide
    // (4 + 1) % 5 = 0
    this._currentSlide = (this._currentSlide + 1) % this._slides.length;
    this._goToSlide(this._currentSlide);

    // Restart the auto-sliding: i.e Seting new intervals
    this.startSliding();
  };

  _previousSlide = () => {
    // If currentSlide = 2:
    // 2 - 1 = 1 → move to slide index 1
    this._currentSlide--;
    // If currentSlide = 0 (first slide):
    // 0 - 1 = -1 → invalid, so wrap to 4 (last slide)
    if (this._currentSlide < 0) this._currentSlide = this._slides.length - 1;
    this._goToSlide(this._currentSlide);

    // Restart the auto-sliding: i.e Seting new intervals
    this.startSliding();
  };

  setSlideStatus(state) {
    this._openedSlide = state;
  }

  addHandlerOpenModal(handler) {
    this._btns.forEach(el => {
      el.addEventListener('click', e => {
        const code = e.target.closest('.destination__button').dataset.code;
        const name = e.target
          .closest('.destination__contents')
          .querySelector('.destination__name')
          .textContent.trim('');
        document.querySelector('.top-destinations').scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

        document.querySelector('body').classList.add('active');
        // console.log(code);
        handler(code, name);
      });
      el.addEventListener('mouseenter', () => this.stopSliding());
      el.addEventListener('mouseleave', () => this.startSliding());
    });
  }

  _clear() {
    this._renderSlides.innerHTML = '';
    this._renderToDots.innerHTML = '';
  }

  // --- RENDER & INIT ---
  render(images) {
    this._data = images;
    this._clear();
    const markup = images.map(img => this._generateMarkup(img)).join('');
    this._renderSlides.innerHTML = markup;

    this._init();
    this._renderDots();

    this._goToSlide(0);
    this.startSliding();
  }

  _renderDots() {
    const dots = this._generateDots();
    this._renderToDots.innerHTML = dots;

    this._dots = document.querySelectorAll('.top-destinations__dot');
  }

  _init() {
    this._slides = document.querySelectorAll('.slide');
    this._maxSlide = this._slides.length;

    this._btns = document.querySelectorAll('.destination__btn');

    this._nextBtnSelector.addEventListener('click', this._nextSlide);
    this._prevBtnSelector.addEventListener('click', this._previousSlide);
  }

  _generateMarkup(slide) {
    return `
      <div class="destination slide destination__transition">
        <div class="destination__overlay"></div>
        <img
          src="${slide.img}"
          alt="${slide.alt_description}"
          class="destination__img"
        />
        <div class="destination__contents">
          <div class="destination__text">
            <h1 class="destination__title">
              ${slide.location}
            </h1>
            <h1 class="destination__name">
              ${slide.name}
            </h1>
          </div>
          <p class="destination__description">
            ${slide.description}
          </p>
          <div class="destination__details">
            <div class="destination__bookmark">
              <i class="fa-regular fa-bookmark"></i>
            </div>
            <h3 class="destination__price-range">${slide.priceRange}</h3>
          </div>
          <div class="destination__button" data-code="${slide.airportCode}">
            <button class="destination__btn btn">explore location</button>
          </div>
        </div>
      </div>`;
  }

  _generateDots() {
    const markup = Array.from({ length: this._maxSlide }, (_, i) => {
      return `<span class="top-destinations__dot dot--${i}" data-slide="${i}"></span>`;
    }).join('');
    return markup;
  }
}

export default new SliderViews();
