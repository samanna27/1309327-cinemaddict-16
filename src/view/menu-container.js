import {createElement} from '../utils/render';

const createMenuContainerTemplate = () => (
  `<nav class="main-navigation">
   </nav>`
);

export default class MenuContainerView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createMenuContainerTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
