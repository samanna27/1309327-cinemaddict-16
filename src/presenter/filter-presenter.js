import MenuFiltersView from '../view/menu-filters-view.js';
import {render, renderPosition, replace, remove} from '../utils/render.js';
import {filters} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';
import MenuStatisticsView from '../view/menu-statistics-view';
import { switchScreen } from '../main.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;
  #statsComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
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
      {
        type: FilterType.STATS,
        name: 'Stats',
        count: filters[FilterType.STATS](films).length,
      },
    ];
  }

  init = () => {
    const filmsFilters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    const prevStatsComponent = this.#statsComponent;

    this.#filterComponent = new MenuFiltersView(filmsFilters, this.#filterModel.filter);
    this.#filterComponent.setFilterClickHandler(this.#handleFilterTypeChange);

    this.#statsComponent = new MenuStatisticsView(filmsFilters, this.#filterModel.filter);
    this.#statsComponent.setStatScreenCkickHandler(this.#handleFilterTypeChange);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, renderPosition.BEFOREEND);
      render(this.#filterContainer, this.#statsComponent, renderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    replace(this.#statsComponent, prevStatsComponent);
    remove(prevFilterComponent);
    remove(prevStatsComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
    switchScreen(filterType, this.#filmsModel.films);
  }
}
