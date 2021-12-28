import AbstractObservable from '../utils/abstract-observable';

export default class MoviesModel extends AbstractObservable {
  #films = [];

  set films(films) {
    this.#films = [...films];
  }

  get films() {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
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

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    if(!notNotify) {
      this._notify(updateType, update);
    }

    notNotify = false;
  }
}
