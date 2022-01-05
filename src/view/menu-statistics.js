import AbstractView from './abstract-view';

const createMenuStatisticsTemplate = (filters, currentFilterType) => {
  const {type, name} = filters[filters.length-1];

  return (
    `<a href="#stats"
    class="main-navigation__additional ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    id=${type}>
    ${name}
    </a>`);
};

export default class MenuStatisticsView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createMenuStatisticsTemplate(this.#filters, this.#currentFilter);
  }

  setStatScreenCkickHandler = (callback) => {
    this._callback.statScreenClick = callback;
    this.element.addEventListener('click', this.#statScreenClickHandler);
  }

  #statScreenClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.statScreenClick(evt.target.id);
  }
}
