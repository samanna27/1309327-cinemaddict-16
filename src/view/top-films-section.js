import {createElement} from '../utils/render';

const createTopFilmsSectionTemplate = () => (
  `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
   </section>`
);

export default class TopFilmsSectionView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createTopFilmsSectionTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
