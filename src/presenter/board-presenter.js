import NoFilmsMessageView from '../view/no-films-message';
import SortFilmsView from '../view/sort-films';
import BoardView from '../view/board';
import AllFilmsSectionView from '../view/all-films-section';
import FilmsContainerView from '../view/films-container';
import ShowMoreButtonView from '../view/show-more-button';
import TopFilmsSectionView from '../view/top-films-section';
import CommentedFilmsSectionView from '../view/commented-films-section';
import {FILM_CARD_COUNT_PER_STEP, TOP_COMMENTED_FILM_CARD_COUNT, SortType, UpdateType, UserAction, FilterType} from '../const';
import {render, renderPosition, remove} from '../utils/render.js';
import FilmPresenter from './film-presenter';
// import { updateItem } from '../utils/common';
import { sortFilmDateDown, sortFilmRatingDown } from '../utils/films';
import { filters } from '../utils/filter';

export default class BoardPresenter {

  #boardContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #boardComponent = new BoardView();
  #noFilmsMessageComponent = null;
  #allFilmsSectionComponent = new AllFilmsSectionView();
  #filmsContainerComponent = new FilmsContainerView();
  #topFilmsContainerComponent = new FilmsContainerView();
  #commentedFilmsContainerComponent = new FilmsContainerView();
  #sortFilmsComponent = null;
  #showMoreButtonComponent = null;
  #topFilmsSectionComponent = new TopFilmsSectionView();
  #commentedFilmsSectionComponent = new CommentedFilmsSectionView();
  #filterType = FilterType.ALL;

  // #boardFilms = [];
  #renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
  #allFilmPresenter = new Map();
  #topFilmPresenter = new Map();
  #commentedFilmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  // #sourceBoardFilms = [];

  constructor(boardContainer, moviesModel, commentsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filters[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE_DOWN:
        return filteredFilms.sort(sortFilmDateDown);
      case SortType.RATING_DOWN:
        return filteredFilms.sort(sortFilmRatingDown);
    }

    return filteredFilms;
  }

  init = () => {
    render(this.#boardContainer, this.#boardComponent, renderPosition.BEFOREEND);

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#allFilmPresenter.forEach((presenter) => presenter.resetView());
    this.#topFilmPresenter.forEach((presenter) => presenter.resetView());
    this.#commentedFilmPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        this.#filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if(this.#allFilmPresenter.has(data.id)) {
          this.#allFilmPresenter.get(data.id).init(data, this.#commentsModel);}
        if(this.#topFilmPresenter.has(data.id)) {
          this.#topFilmPresenter.get(data.id).init(data, this.#commentsModel);}
        if(this.#commentedFilmPresenter.has(data.id)) {
          this.#commentedFilmPresenter.get(data.id).init(data, this.#commentsModel);}
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmsCount: true, resetSortType: true});
        this.#renderBoard();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedFilmsCount: true});
    this.#renderBoard();
  }

  #renderSort = () => {
    this.#sortFilmsComponent = new SortFilmsView(this.#currentSortType);
    this.#sortFilmsComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#boardComponent, this.#sortFilmsComponent, renderPosition.BEFOREEND);
  }

  #renderFilm = (film, container) => {
    // const filmPresenter = new FilmPresenter(container, this.#handleFilmChange, this.#handleModeChange, this.#commentsModel);
    const filmPresenter = new FilmPresenter(container, this.#handleViewAction, this.#handleModeChange, this.#commentsModel);

    filmPresenter.init(film, this.#commentsModel);
    if(container === this.#filmsContainerComponent) {
      this.#allFilmPresenter.set(film.id, filmPresenter);
    } else if (container === this.#topFilmsContainerComponent){
      this.#topFilmPresenter.set(film.id, filmPresenter);
    } else {
      this.#commentedFilmPresenter.set(film.id, filmPresenter);
    }
  }

  #renderFilms = (films) => {
    films.forEach((film)=>this.#renderFilm(film, this.#filmsContainerComponent));
  }

  #renderNoFilmsMessage = () => {
    this.#noFilmsMessageComponent = new NoFilmsMessageView(this.#filterType);
    render(this.#boardComponent, this.#noFilmsMessageComponent, renderPosition.BEFOREEND);
  }

  #handleShowMoreButtonClick = () => {
    const filmsCount = this.films.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount + FILM_CARD_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmsCount, newRenderedFilmsCount);

    this.#renderFilms(films);
    this.#renderedFilmsCount = newRenderedFilmsCount;
    if(this.#renderedFilmsCount >= filmsCount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    render(this.#allFilmsSectionComponent, this.#showMoreButtonComponent, renderPosition.BEFOREEND);
  }

  #renderTopFilms =() => {
    render(this.#boardComponent, this.#topFilmsSectionComponent, renderPosition.BEFOREEND);
    render(this.#topFilmsSectionComponent, this.#topFilmsContainerComponent, renderPosition.BEFOREEND);

    this.films.slice(0, TOP_COMMENTED_FILM_CARD_COUNT).forEach((film) => this.#renderFilm(film, this.#topFilmsContainerComponent));
  }

  #renderCommentedFilms =() => {
    render(this.#boardComponent, this.#commentedFilmsSectionComponent, renderPosition.BEFOREEND);
    render(this.#commentedFilmsSectionComponent, this.#commentedFilmsContainerComponent, renderPosition.BEFOREEND);

    this.films.slice(0, TOP_COMMENTED_FILM_CARD_COUNT).forEach((film) => this.#renderFilm(film, this.#commentedFilmsContainerComponent));
  }

  #clearBoard = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {
    // const filmCount = this.films.length;

    this.#allFilmPresenter.forEach((presenter) => presenter.destroy());
    this.#allFilmPresenter.clear();
    this.#topFilmPresenter.forEach((presenter) => presenter.destroy());
    this.#topFilmPresenter.clear();
    this.#commentedFilmPresenter.forEach((presenter) => presenter.destroy());
    this.#commentedFilmPresenter.clear();

    remove(this.#sortFilmsComponent);
    remove(this.#noFilmsMessageComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#topFilmsSectionComponent);
    remove(this.#commentedFilmsSectionComponent);

    if(this.#noFilmsMessageComponent) {
      remove(this.#noFilmsMessageComponent);
    }

    if(resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
    }

    if(resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard = () => {
    const films = this.films;
    const filmsCount = films.length;

    if(filmsCount === 0) {
      this.#renderNoFilmsMessage();
      return;
    } else {
      this.#renderSort();
      render(this.#boardComponent, this.#allFilmsSectionComponent, renderPosition.BEFOREEND);
      render(this.#allFilmsSectionComponent, this.#filmsContainerComponent, renderPosition.BEFOREEND);

      this.#renderFilms(films.slice(0, Math.min(filmsCount, this.#renderedFilmsCount)));

      if(filmsCount > this.#renderedFilmsCount) {
        this.#renderShowMoreButton();
      }
    }

    this.#renderTopFilms();
    this.#renderCommentedFilms();
  }
}
