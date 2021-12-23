import {comments} from '../main.js';
import AbstractView from './abstract-view';

const createCommentTemplate = (commentId) => {
  const requiredComment = (element) => {
    if(element.id === commentId) {
      return element;
    }
    return false;
  };

  const comment = comments.find(requiredComment);
  const {emoji, text, author, date} = comment;

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src=${emoji} width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${date}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
   </li>`;
};

export default class CommentView extends AbstractView {
  #commentId = null;

  constructor(commentId = '') {
    super();
    this.#commentId=commentId;
  }

  get template() {
    return createCommentTemplate(this.#commentId);
  }

  setCommentDeleteHandler = (callback) => {
    this._callback.deleteComment = callback;
    if(this.element !== null){
      this.element
        .querySelector('.film-details__comment-delete')
        .addEventListener('click', this.deleteCommentHandler);
    }
  }

  deleteCommentHandler = (evt) => {
    evt.preventDefault();
    const commentToDeleteId = this.#commentId;
    this._callback.deleteComment(commentToDeleteId);
  }
}
