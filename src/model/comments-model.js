import AbstractObservable from '../utils/abstract-observable';
import { UpdateType } from '../const';
import dayjs from 'dayjs';
import { adaptToClient } from '../utils/films';

const makeHumanDate = (date) => {
  let period = 0;
  const currentDate =new Date();
  if(dayjs(date).isAfter(dayjs(currentDate).subtract(5, 'minutes'))) {
    return 'now';
  } else if (dayjs(date).isAfter(dayjs().subtract(60, 'minutes'))) {
    return 'a few minutes ago';
  } else if (dayjs(date).isAfter(dayjs().subtract(24, 'hours'))) {
    period = Math.floor(dayjs().diff(dayjs(date), 'hour', true),0);
    return `${period} ${period === 1 ? 'hour' : 'hours'} ago`;
  } else if (dayjs(date).isAfter(dayjs().subtract(30, 'days'))) {
    period = Math.floor(dayjs().diff(dayjs(date), 'day', true),0);
    return `${period} ${period === 1 ? 'day' : 'days'} ago`;
  } else if (dayjs(date).isAfter(dayjs().subtract(12, 'months'))) {
    period = Math.floor(dayjs().diff(dayjs(date), 'month', true),0);
    return `${period} ${period === 1 ? 'month' : 'months'} ago`;
  } else if (dayjs(date).isAfter(dayjs().subtract(100, 'years'))) {
    period = Math.floor(dayjs().diff(dayjs(date), 'year', true),0);
    return `${period} ${period === 1 ? 'year' : 'years'} ago`;
  }
};

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
      date: makeHumanDate(dayjs(comment.date).format('YYYY/MM/DD HH:mm')),
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
    const commentIdIndex = update.commentsIds.findIndex((commentId) => commentId === update.commentToDelete.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(update.commentToDelete);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

      update.commentsIds = [
        ...update.commentsIds.slice(0,commentIdIndex),
        ...update.commentsIds.slice(commentIdIndex+1),
      ];

      update = {...update,...this.#comments};

      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }
}
