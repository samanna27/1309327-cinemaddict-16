import {createElement} from '../utils/render';

const createMenuStatisticsTemplate = () => (
  '<a href="#stats" class="main-navigation__additional">Stats</a>'
);

export default class MenuStatisticsView {
  #element = null

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMenuStatisticsTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
