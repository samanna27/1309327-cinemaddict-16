import {createElement} from '../utils/render';

const createPopUpContainerTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
    </form>
   </section>`
);

export default class PopUpContainerView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPopUpContainerTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
