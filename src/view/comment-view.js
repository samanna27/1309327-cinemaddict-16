import SmartView from './smart-view';

const createCommentTemplate = (comment) => {
  const {emoji, text, author, date, isDisabled, isDeleting} = comment;

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${date}</span>
        <button class="film-details__comment-delete" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'deleting...' : 'delete'}</button>
      </p>
    </div>
   </li>`;
};

export default class CommentView extends SmartView {
  _data = null
  #element = null;

  constructor(comment = '') {
    super();
    this._data=CommentView.parseCommentToData(comment);
  }

  get template() {
    return createCommentTemplate(this._data);
  }

  restoreHandlers = () => {
    this.setCommentDeleteHandler();
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
    const commentToDelete = this._data;
    this._callback.deleteComment(CommentView.parseDataToComment(commentToDelete));
  }

  static parseCommentToData = (comment) => ({...comment,
    isDisabled: false,
    isDeleting: false,
  });

  static parseDataToComment = (data) => {
    const commentToDelete = {...data};

    delete commentToDelete.isDisabled;
    delete commentToDelete.isDeleting;

    return commentToDelete;
  }
}
