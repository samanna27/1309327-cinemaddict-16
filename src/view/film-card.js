import dayjs from 'dayjs';
import {formatDescription} from '../utils/common';
import AbstractView from './abstract-view';
import {BLANK_FILM} from '../const';
import { transferMinutesToDurationString } from '../utils/common.js';

const createFilmCardTemplate = (film) => {
  const {title, rating, releaseDate, duration, genre, poster, description, commentsIds, isAddedToWatchlist, isAlreadyWatched, isFavorite} = film;

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${dayjs(releaseDate).format('YYYY')}</span>
        <span class="film-card__duration">${transferMinutesToDurationString(duration)}</span>
        <span class="film-card__genre">${genre.join(' ')}</span>
      </p>
      <img src=${poster} alt="" class="film-card__poster">
      <p class="film-card__description">${formatDescription(description)}</p>
      <span class="film-card__comments">${commentsIds.length} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${isAddedToWatchlist? 'film-card__controls-item--active': ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${isAlreadyWatched? 'film-card__controls-item--active': ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${isFavorite? 'film-card__controls-item--active': ''}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film = BLANK_FILM) {
    super();
    this.#film=film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setFilmCardClickHandler = (callback) => {
    this._callback.filmCardClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#filmCardClickHandler);
  }

  #filmCardClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filmCardClick();
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  }

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  }

  setAddedToWatchlistClickHandler = (callback) => {
    this._callback.addedToWatchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addedToWatchlistClickHandler);
  }

  #addedToWatchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addedToWatchlistClick();
  }
}
