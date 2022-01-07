import AbstractView from './abstract-view';
import {BLANK_FILM} from '../const';
import dayjs from 'dayjs';
import { transferMinutesToDurationString } from '../utils/common.js';

const createFilmDetailsTemplate = (film) => {
  const {poster, title, originalTitle, ageConstraint, rating, director, actors, writers, releaseDate, duration, country, genre, description, isAddedToWatchlist, isAlreadyWatched, isFavorite} = film;

  return `<div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src=${poster} alt=${title}>

          <p class="film-details__age">${ageConstraint}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(releaseDate).format('D MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${transferMinutesToDurationString(duration)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${genre.slice().map((item)=>`<span class="film-details__genre">${item}</span>`).join(' ')}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${isAddedToWatchlist? 'film-details__control-button--active': ''}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${isAlreadyWatched? 'film-details__control-button--active': ''}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${isFavorite? 'film-details__control-button--active': ''}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>`;
};

export default class FilmDetailsView extends AbstractView {
  #film = null;

  constructor(film = BLANK_FILM) {
    super();
    this.#film=film;
  }

  get template() {
    return createFilmDetailsTemplate(this.#film);
  }

  setPopupCloseHandler = (callback) => {
    this._callback.popupClose = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#popupCloseHandler);
  }

  #popupCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupClose(this.#film);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  }

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  }

  setAddedToWatchlistClickHandler = (callback) => {
    this._callback.addedToWatchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#addedToWatchlistClickHandler);
  }

  #addedToWatchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addedToWatchlistClick();
  }
}
