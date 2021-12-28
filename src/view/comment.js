import AbstractView from './abstract-view';

const createCommentTemplate = (comment) => {
  const {emoji, text, author, date} = comment;
  console.log(emoji);

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
  #comment = null;

  constructor(comment = '') {
    super();
    this.#comment=comment;
  }

  get template() {
    return createCommentTemplate(this.#comment);
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
    const commentToDelete = this.#comment;
    this._callback.deleteComment(commentToDelete);
  }
}
