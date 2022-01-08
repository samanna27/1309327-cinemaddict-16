import AbstractObservable from '../utils/abstract-observable';
import { UpdateType } from '../const';
import dayjs from 'dayjs';
import { adaptToClient } from '../utils/films';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #comments = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (film) => {
    try {
      const comments = await this.#apiService.getFilmComments(film);
      this.#comments = comments.map(this.#adaptToClient);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT_COMMENTS, film);
  }

  #adaptToClient = (comment) => {
    const adaptedComment = {...comment,
      emoji: comment.emotion,
      date: dayjs(comment.date).format('YYYY/MM/DD HH:MM'),
      text: comment.comment,
    };

    delete adaptedComment['emotion'];
    delete adaptedComment['comment'];

    return adaptedComment;
  }

  addComment = async (updateType, update) => {
    try {
      const response = await this.#apiService.addComment(update.newComment, update);
      this.#comments = response.comments.map(this.#adaptToClient);
      const adaptedFilm = adaptToClient(response.movie);
      update = {...adaptedFilm, ...this.#comments};
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.commentToDelete.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    // this.#comments = [
    //   ...this.#comments.slice(0, index),
    //   ...this.#comments.slice(index + 1),
    // ];

    // this._notify(updateType, update);
    try {
      // Обратите внимание, метод удаления задачи на сервере
      // ничего не возвращает. Это и верно,
      // ведь что можно вернуть при удалении задачи?
      await this.#apiService.deleteComment(update.commentToDelete);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

      update = {...update,...this.#comments};

      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }
}
