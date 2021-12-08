import AbstractView from './abstract-view';

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;

  return (
    `<a href="#${name.toString()[0].toLowerCase()+name.toString().slice(1)}"
    class="main-navigation__item"
    ${count === 0 ? 'disabled' : ''}>
    ${name}
    <span class="main-navigation__item-count">${count}</span>
    </a>`);
};

const createMenuFiltersTemplate = (filters) => {
  const {name, count} = filters[0];
  const filterItemsTemplate = filters.map((filter) => createFilterItemTemplate(filter)).slice(1).join('');

  return (
    `<div class="main-navigation__items">
      <a href="#All"
      class="main-navigation__item main-navigation__item--active"
      ${count === 0 ? 'disabled' : ''}>
      ${name}
      </a>
      ${filterItemsTemplate}
    </div>`
  );
};

export default class MenuFiltersView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createMenuFiltersTemplate(this.#filters);
  }

  setFilterClickHandler = (callback) => {
    this._callback.filterClick = callback;
    this.element.querySelectorAll('.main-navigation__item')
      .forEach( (item) => item.addEventListener('click', this.#filterClickHandler));
  }

  #filterClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterClick(evt);
  }
}
