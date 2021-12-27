import NoFilmsMessageView from '../view/no-films-message';
import SortFilmsView from '../view/sort-films';
import BoardView from '../view/board';
import AllFilmsSectionView from '../view/all-films-section';
import FilmsContainerView from '../view/films-container';
import ShowMoreButtonView from '../view/show-more-button';
import TopFilmsSectionView from '../view/top-films-section';
import CommentedFilmsSectionView from '../view/commented-films-section';
import {FILM_CARD_COUNT_PER_STEP, TOP_COMMENTED_FILM_CARD_COUNT, SortType} from '../const';
import {render, renderPosition, remove} from '../utils/render.js';
import FilmPresenter from './film-presenter';
// import { updateItem } from '../utils/common';
import { sortFilmDateDown, sortFilmRatingDown } from '../utils/films';

export default class BoardPresenter {

  #boardContainer = null;
  #filmsModel = null;

  #boardComponent = new BoardView();
  #sortFilmsComponent = new SortFilmsView();
  #noFilmsMessageComponent = new NoFilmsMessageView();
  #allFilmsSectionComponent = new AllFilmsSectionView();
  #filmsContainerComponent = new FilmsContainerView();
  #topFilmsContainerComponent = new FilmsContainerView();
  #commentedFilmsContainerComponent = new FilmsContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #topFilmsSectionComponent = new TopFilmsSectionView();
  #commentedFilmsSectionComponent = new CommentedFilmsSectionView();

  // #boardFilms = [];
  #renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
  #allFilmPresenter = new Map();
  #topFilmPresenter = new Map();
  #commentedFilmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  // #sourceBoardFilms = [];

  constructor(boardContainer, moviesModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = moviesModel;
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.DATE_DOWN:
        return [...this.#filmsModel.films].sort(sortFilmDateDown);
      case SortType.RATING_DOWN:
        return [...this.#filmsModel.films].sort(sortFilmRatingDown);
    }

    return this.#filmsModel.films;
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

  #handleFilmChange = (updatedFilm) => {

    if(this.#allFilmPresenter.has(updatedFilm.id)) {
      this.#allFilmPresenter.get(updatedFilm.id).init(updatedFilm);}
    if(this.#topFilmPresenter.has(updatedFilm.id)) {
      this.#topFilmPresenter.get(updatedFilm.id).init(updatedFilm);}
    if(this.#commentedFilmPresenter.has(updatedFilm.id)) {
      this.#commentedFilmPresenter.get(updatedFilm.id).init(updatedFilm);}
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmsList();
    this.#renderFilmsList();
  }

  #renderSort = () => {
    render(this.#boardComponent, this.#sortFilmsComponent, renderPosition.BEFOREEND);
    this.#sortFilmsComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #clearFilmsList = () => {
    this.#allFilmPresenter.forEach((presenter) => presenter.destroy());
    this.#allFilmPresenter.clear();
    this.#renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);

  }

  #renderFilmsList = () => {
    const filmsCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmsCount, FILM_CARD_COUNT_PER_STEP));

    this.#renderFilms(films);

    if (filmsCount > FILM_CARD_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange, this.#handleModeChange);

    filmPresenter.init(film);
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
    render(this.#allFilmsSectionComponent, this.#showMoreButtonComponent, renderPosition.BEFOREEND);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
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

  #renderBoard = () => {
    if(this.films.length === 0) {
      this.#renderNoFilmsMessage();
    } else {
      this.#renderSort();
      render(this.#boardComponent, this.#allFilmsSectionComponent, renderPosition.BEFOREEND);
      render(this.#allFilmsSectionComponent, this.#filmsContainerComponent, renderPosition.BEFOREEND);

      this.#renderFilmsList();
    }

    this.#renderTopFilms();
    this.#renderCommentedFilms();
  }
}
