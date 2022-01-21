import AbstractView from './abstract-view';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a href="#${name.toString()[0].toLowerCase()+name.toString().slice(1)}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    ${count === 0 ? 'disabled' : ''}
    id="${type}">
    ${name}
    <span class="main-navigation__item-count">${count}</span>
    </a>`);
};

const createMenuFiltersTemplate = (filters, currentFilterType) => {
  const {type, name, count} = filters[0];
  const filterItemsTemplate = filters.slice(0,-1).map((filter) => createFilterItemTemplate(filter, currentFilterType)).slice(1).join('');

  return (
    `<div class="main-navigation__items">
      <a href="#All"
      class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
      ${count === 0 ? 'disabled' : ''}
      id="${type}">
      ${name}
      </a>
      ${filterItemsTemplate}
    </div>`
  );
};

export default class MenuFiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createMenuFiltersTemplate(this.#filters, this.#currentFilter);
  }

  setFilterClickHandler = (callback) => {
    this._callback.filterClick = callback;
    this.element.querySelectorAll('.main-navigation__item')
      .forEach( (item) => item.addEventListener('click', this.#filterClickHandler));
  }

  #filterClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterClick(evt.target.id);
  }
}
