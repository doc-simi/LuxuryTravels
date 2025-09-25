class GalleryView {
  _data;

  render(data) {
    this._data = data;
    this._data.forEach((image, i) => {
      this._generateElement(image, i).then(img => {
        const parentEl = document.querySelector(`.gallery__item--${i + 1}`);
        parentEl.style.animation = 'none';
        parentEl.innerHTML = ''; // remove loader
        parentEl.insertAdjacentElement('afterbegin', img);
      });
    });
  }

  reset() {
    const images = document.querySelectorAll('.gallery__item');
    images.forEach(img => {
      img.innerHTML = '';
      img.style.animation = '';
    });
  }

  _generateElement(image, i) {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.classList.add('gallery__img', `gallery__img--${i + 1}`);
      img.src = image.urls.regular;
      img.alt = image.alt_description || `Gallery image ${i + 1}`;

      // Wait until image is fully loaded
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image failed to load'));
    });
  }

  addHandlerRenderImages(handler) {
    document.querySelector('.gallery__tab').addEventListener('click', () => {
      handler();
    });
  }
}

export default new GalleryView();
