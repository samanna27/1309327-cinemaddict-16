import AbstractObservable from '../utils/abstract-observable';
import { UpdateType } from '../const';
import dayjs from 'dayjs';

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
      emoji: `./images/emoji/${comment.emotion}.png`,
      date: dayjs(comment.date).format('YYYY/MM/DD HH:MM'),
      text: comment.comment,
    };

    delete adaptedComment['emotion'];
    delete adaptedComment['comment'];

    return adaptedComment;
  }

  addComment = (updateType, update) => {
    this.#comments = [
      update.newComment,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  }

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.commentToDelete.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
