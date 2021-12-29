import MenuFiltersView from '../view/menu-filters.js';
import {render, renderPosition, replace, remove} from '../utils/render.js';
import {filters} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filters[FilterType.ALL](films).length,
      },
      {
        type: FilterType.ADDED_TO_WATCHLIST,
        name: 'Watchlist',
        count: filters[FilterType.ADDED_TO_WATCHLIST](films).length,
      },
      {
        type: FilterType.ALREADY_WATCHED,
        name: 'History',
        count: filters[FilterType.ALREADY_WATCHED](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filters[FilterType.FAVORITES](films).length,
      },
    ];
  }

  init = () => {
    const filmsFilters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new MenuFiltersView(filmsFilters, this.#filterModel.filter);
    this.#filterComponent.setFilterClickHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, renderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
