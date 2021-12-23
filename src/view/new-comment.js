import dayjs from 'dayjs';
import { BLANK_COMMENT } from '../const';
import SmartView from './smart-view';
import { isEnter } from '../utils/common';

const createNewCommentTemplate = (comment) => {
  const {emoji, text} = comment;
  const emojiTemplate = `<img src="${emoji}" width="55" height="55" alt="emoji-${emoji}" class="newComment"></img>`;

  return `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">${emoji === ''? '' : emojiTemplate}</div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${text}</textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </div>`;
};

export default class NewCommentView extends SmartView {
  constructor(data = BLANK_COMMENT) {
    super();
    this._data=data;

    this.restoreHandlers();
  }

  get template() {
    return createNewCommentTemplate(this._data);
  }

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    const emojiUpdate = evt.target.src.slice(35, -4);

    this.updateData({
      emoji: `./images/emoji/${emojiUpdate}.png`,
    });
  }

  restoreHandlers = () => {
    this.#setInnerHandler();
  }

  #setInnerHandler = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('click', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#textInputHandler);
  }

  #textInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      text: evt.target.value,
    }, true);
  }

  setCommentSubmitHandler = (callback) => {
    this._callback.commentSubmit = callback;
    document.addEventListener('keydown', this.#commentSubmitHandler);
  }

  #commentSubmitHandler = (evt) => {
    if(isEnter(evt) && evt.ctrlKey) {
      evt.preventDefault();
      this.updateData({
        date: dayjs().format('YYYY/MM/DD HH:MM'),
      }, true);
      this._callback.commentSubmit(this._data);
    }
  }
}
