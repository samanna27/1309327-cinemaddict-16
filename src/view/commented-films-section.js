import {createElement} from '../utils/render';

const createCommentedFilmsSectionTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
   </section>`
);

export default class CommentedFilmsSectionView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createCommentedFilmsSectionTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
