import {createElement} from '../utils/render';
import {FilterType} from '../const.js';

const NoFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
  [FilterType.ADDED_TO_WATCHLIST]: 'There are no movies to watch now',
  [FilterType.ALREADY_WATCHED]: 'There are no watched movies now',
};

const createNoFilmsTemplate = (filterType) => {
  const noFilmTextValue = NoFilmsTextType[filterType];

  return (
    `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">${noFilmTextValue}</h2>
      </section>
      </section>`);
};

export default class NoFilmsMessageView {
  #element = null;
  #filterType = null;

  constructor(filterType) {
    // eslint-disable-next-line no-undef
    this.#filterType = filterType;
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return  createNoFilmsTemplate(this.#filterType);
  }

  removeElement() {
    this.#element = null;
  }
}
