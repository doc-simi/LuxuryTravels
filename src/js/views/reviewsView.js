import profile__1 from 'url:../../media/profile-1.jpg';
import profile__2 from 'url:../../media/profile-2.jpg';
import profile__3 from 'url:../../media/profile-3.jpg';

class reviewsView {
  _renderTo = document.querySelector('.reviews__body');
  _data;
  _images = [profile__1, profile__3, profile__2];

  render(data) {
    this._data = data;
    this._clear();
    const markup = this._generateMarkup();
    this._renderTo.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._renderTo.innerHTML = '';
  }

  _generateMarkup() {
    return this._data
      .map(
        (review, i) => `<div class="review">
                <div class="review__img-box">
                  <img
                    src="${this._images[i]}"
                    alt="profile pic"
                    class="review__img"
                  />
                </div>
                <div class="review__content-box">
                  <div class="review__content">
                    <h5 class="heading review__timestamp">
                      ${review.date}
                    </h5>
                    <p class="review__text">
                      ${review.comment}
                    </p>
                    <h4 class="heading review__user">&mdash; ${review.name}</h4>
                    <h6 class="review__rating-text">Level of satisfaction:</h6>
                    <div class="review__rating">
                      <div class="review__rate" style="width: ${
                        review.satisfaction * 10
                      }%"></div>
                    </div>
                  </div>
                </div>
              </div>`
      )
      .join('');
  }

  addHandlerRenderReviews(handler) {
    document.querySelector('.reviews__tab').addEventListener('click', () => {
      handler();
    });
  }
}

export default new reviewsView();
