import dayjs from 'dayjs';
import { BLANK_COMMENT } from '../const';
import SmartView from './smart-view';
import { isEnter } from '../utils/common';
import he from 'he';

const createNewCommentTemplate = (data) => {
  const {emoji, text, isDisabled} = data;
  const emojiTemplate = `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}" class="newComment"></img>`;

  return `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">${emoji === ''? '' : emojiTemplate}</div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}>${he.encode(text)}</textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${isDisabled ? 'disabled' : ''}>
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${isDisabled ? 'disabled' : ''}>
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${isDisabled ? 'disabled' : ''}>
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${isDisabled ? 'disabled' : ''}>
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </div>`;
};

export default class NewCommentView extends SmartView {
  _data = {};

  constructor(comment = BLANK_COMMENT) {
    super();
    this._data=NewCommentView.parseCommentToData(comment);

    this.restoreHandlers();
  }

  get template() {
    return createNewCommentTemplate(this._data);
  }

  #emojiClickHandler = (evt) => {
    evt.preventDefault();

    this.updateData({
      emoji: evt.target.value,
    });
  }

  restoreHandlers = () => {
    this.#setInnerHandler();
  }

  #setInnerHandler = () => {
    this.element.querySelectorAll('.film-details__emoji-item').forEach((element) => element.addEventListener('click', this.#emojiClickHandler));
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
      const elementToCheck = this.element.querySelector('.film-details__comment-input');
      if(this._data.emoji === '' || this._data.text === '') {
        elementToCheck.setCustomValidity('Смайлик и текст комментария - обязательные поля');
      } else {
        elementToCheck.setCustomValidity('');
        this.updateData({
          date: dayjs().format('YYYY/MM/DD HH:mm'),
        }, true);
        this._callback.commentSubmit(NewCommentView.parseDataToComment(this._data));
        document.removeEventListener('keydown', this.#commentSubmitHandler);
      }
      elementToCheck.reportValidity();
    }
  }

  static parseCommentToData = (comment) => ({...comment,
    isDisabled: false,
  });

  static parseDataToComment = (data) => {
    const comment = {...data};

    delete comment.isDisabled;

    return comment;
  }
}
