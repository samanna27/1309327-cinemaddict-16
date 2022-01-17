import AbstractObservable from '../utils/abstract-observable';
import { UpdateType } from '../const';

export default class MoviesModel extends AbstractObservable {
  #apiService = null;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);
    let notNotify = Boolean(update.newComment || update.commentToDelete);

    if(update.commentToDelete) {
      delete update.commentToDelete;
    }

    if(update.newComment) {
      delete update.newComment;
    }

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];
    } catch(err) {
      throw new Error('Can\'t update film');
    }

    if(!notNotify) {
      this._notify(updateType, update);
    }

    notNotify = false;
  }

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      'title': film.film_info.title,
      'originalTitle': film.film_info.alternative_title,
      'poster': film.film_info.poster,
      'ageConstraint': film.film_info.age_rating,
      'description': film.film_info.description,
      'rating': film.film_info.total_rating,
      'director': film.film_info.director,
      'actors': [...film.film_info.actors],
      'writers': [...film.film_info.writers],
      'releaseDate': film.film_info.release.date,
      'duration': film.film_info.runtime,
      'country': film.film_info.release.release_country,
      'genre': [...film.film_info.genre],
      'commentsIds': film.comments,
      'isAddedToWatchlist': film.user_details.watchlist,
      'isAlreadyWatched': film.user_details.already_watched,
      'isFavorite': film.user_details.favorite,
      'watchedDate': film.user_details.watching_date,
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['comments'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }
}
