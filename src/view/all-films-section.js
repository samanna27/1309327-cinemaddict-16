import {createElement} from '../utils/render';

const createAllFilmsSectionTemplate = () => (
  `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
   </section>`
);

export default class AllFilmsSectionView {
  #element = null

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createAllFilmsSectionTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
