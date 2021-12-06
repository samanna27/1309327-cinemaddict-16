import {createElement} from '../utils/render';
import {BLANK_FILM} from '../const';

const createPopUpBottomSectionTemplate = (film) => {
  const {commentsIds} = film;

  return  `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsIds.length}</span></h3>
      </section>
   </div>`;
};

export default class PopUpBottomSectionView {
  #element = null;
  #film = null;

  constructor(film = BLANK_FILM) {
    this.#film=film;
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPopUpBottomSectionTemplate(this.#film);
  }

  removeElement() {
    this.#element = null;
  }
}
