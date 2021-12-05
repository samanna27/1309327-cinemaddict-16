import {createElement} from '../utils/render';

const createCommentsContainerTemplate = () => (
  `<ul class="film-details__comments-list">
   </ul>`
);

export default class CommentsContainerView {
  #element = null

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createCommentsContainerTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
