import NoFilmsMessageView from '../view/no-films-message';
import LoadingView from '../view/loading-view';
import SortFilmsView from '../view/sort-films';
import BoardView from '../view/board';
import AllFilmsSectionView from '../view/all-films-section';
import FilmsContainerView from '../view/films-container';
import ShowMoreButtonView from '../view/show-more-button';
import TopFilmsSectionView from '../view/top-films-section';
import CommentedFilmsSectionView from '../view/commented-films-section';
import {FILM_CARD_COUNT_PER_STEP, TOP_COMMENTED_FILM_CARD_COUNT, SortType, UpdateType, UserAction, FilterType} from '../const';
import {render, renderPosition, remove} from '../utils/render.js';
import FilmPresenter, {State as FilmPresenterViewState} from './film-presenter';
import { sortFilmDateDown, sortFilmRatingDown, sortFilmCommentsDown } from '../utils/films';
import { filters } from '../utils/filter';
import { renderFooterStatistic } from '../main';

export default class BoardPresenter {

  #boardContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #boardComponent = new BoardView();
  #noFilmsMessageComponent = null;
  #allFilmsSectionComponent = new AllFilmsSectionView();
  #loadingComponent = new LoadingView();
  #filmsContainerComponent = new FilmsContainerView();
  #topFilmsContainerComponent = new FilmsContainerView();
  #commentedFilmsContainerComponent = new FilmsContainerView();
  #sortFilmsComponent = null;
  #showMoreButtonComponent = null;
  #topFilmsSectionComponent = new TopFilmsSectionView();
  #commentedFilmsSectionComponent = new CommentedFilmsSectionView();
  #filterType = FilterType.ALL;
  #isLoading = true;

  #renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
  #allFilmPresenter = new Map();
  #topFilmPresenter = new Map();
  #commentedFilmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(boardContainer, moviesModel, commentsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
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

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  }

  destroy = () => {
    this.#clearBoard({resetRenderedFilmsCount: true, resetSortType: true});

    remove(this.#sortFilmsComponent);
    remove(this.#allFilmsSectionComponent);
    remove(this.#topFilmsSectionComponent);
    remove(this.#commentedFilmsSectionComponent);
    remove(this.#boardComponent);

    this.#filmsModel.deleteObserver(this.#handleModelEvent);
    this.#commentsModel.deleteObserver(this.#handleModelEvent);
    this.#filterModel.deleteObserver(this.#handleModelEvent);
  }

  #handleModeChange = () => {
    this.#allFilmPresenter.forEach((presenter) => presenter.resetView());
    this.#topFilmPresenter.forEach((presenter) => presenter.resetView());
    this.#commentedFilmPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        if(this.#allFilmPresenter.has(update.id)) {
          this.#allFilmPresenter.get(update.id).setSaving();}
        if(this.#topFilmPresenter.has(update.id)) {
          this.#topFilmPresenter.get(update.id).setSaving();}
        if(this.#commentedFilmPresenter.has(update.id)) {
          this.#commentedFilmPresenter.get(update.id).setSaving();}
        try {
          await this.#commentsModel.addComment(updateType, update);
          this.#filmsModel.updateFilm(updateType, update);
        } catch(err) {
          if(this.#allFilmPresenter.has(update.id)) {
            this.#allFilmPresenter.get(update.id).setAborting(FilmPresenterViewState.ABORTING);}
          if(this.#topFilmPresenter.has(update.id)) {
            this.#topFilmPresenter.get(update.id).setAborting(FilmPresenterViewState.ABORTING);}
          if(this.#commentedFilmPresenter.has(update.id)) {
            this.#commentedFilmPresenter.get(update.id).setAborting(FilmPresenterViewState.ABORTING);}
        }
        break;
      case UserAction.DELETE_COMMENT:
        if(this.#allFilmPresenter.has(update.id)) {
          this.#allFilmPresenter.get(update.id).setDeletion(update);}
        if(this.#topFilmPresenter.has(update.id)) {
          this.#topFilmPresenter.get(update.id).setDeletion(update);}
        if(this.#commentedFilmPresenter.has(update.id)) {
          this.#commentedFilmPresenter.get(update.id).setDeletion(update);}
        try {
          await this.#commentsModel.deleteComment(updateType, update);
          this.#filmsModel.updateFilm(updateType, update);
        } catch (err) {
          if(this.#allFilmPresenter.has(update.id)) {
            this.#allFilmPresenter.get(update.id).setCommentToDeleteAborting(FilmPresenterViewState.ABORTING);}
          if(this.#topFilmPresenter.has(update.id)) {
            this.#topFilmPresenter.get(update.id).setCommentToDeleteAborting(FilmPresenterViewState.ABORTING);}
          if(this.#commentedFilmPresenter.has(update.id)) {
            this.#commentedFilmPresenter.get(update.id).setCommentToDeleteAborting(FilmPresenterViewState.ABORTING);}
        }
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        renderFooterStatistic(this.#filmsModel.films);
        break;
      case UpdateType.INIT_COMMENTS:
        if(this.#allFilmPresenter.has(data.id)) {
          this.#allFilmPresenter.get(data.id).updateCommentsList(data);}
        if(this.#topFilmPresenter.has(data.id)) {
          this.#topFilmPresenter.get(data.id).updateCommentsList(data);}
        if(this.#commentedFilmPresenter.has(data.id)) {
          this.#commentedFilmPresenter.get(data.id).updateCommentsList(data);}
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
    render(this.#boardComponent, this.#sortFilmsComponent, renderPosition.BEFOREBEGIN);
  }

  #renderFilm = (film, container) => {
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

  #renderLoading = () => {
    render(this.#boardComponent, this.#loadingComponent, renderPosition.AFTERBEGIN);
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
    const zeroRatingFilmIndex = this.films.sort(sortFilmRatingDown).findIndex((film) => film.rating === 0);

    if(zeroRatingFilmIndex === -1){
      this.films.slice().sort(sortFilmRatingDown).slice(0, TOP_COMMENTED_FILM_CARD_COUNT).forEach((film) => this.#renderFilm(film, this.#topFilmsContainerComponent));
      return;
    }
    this.films.slice().sort(sortFilmRatingDown).slice(0,zeroRatingFilmIndex).slice(0, TOP_COMMENTED_FILM_CARD_COUNT).forEach((film) => this.#renderFilm(film, this.#topFilmsContainerComponent));
  }

  #renderCommentedFilms =() => {
    render(this.#boardComponent, this.#commentedFilmsSectionComponent, renderPosition.BEFOREEND);
    render(this.#commentedFilmsSectionComponent, this.#commentedFilmsContainerComponent, renderPosition.BEFOREEND);
    const zeroCommentsFilmIndex = this.films.sort(sortFilmRatingDown).findIndex((film) => film.commentsIds.length === 0);

    if(zeroCommentsFilmIndex === -1){
      this.films.slice().sort(sortFilmCommentsDown).slice(0, TOP_COMMENTED_FILM_CARD_COUNT).forEach((film) => this.#renderFilm(film, this.#commentedFilmsContainerComponent));
      return;
    }
    this.films.slice().sort(sortFilmCommentsDown).slice(0,zeroCommentsFilmIndex).slice(0, TOP_COMMENTED_FILM_CARD_COUNT+1).forEach((film) => this.#renderFilm(film, this.#commentedFilmsContainerComponent));
  }

  rerenderCommentedFilmsComponent = () => {
    remove(this.#commentedFilmsContainerComponent);
    this.#renderCommentedFilms();
  }

  #clearBoard = ({resetRenderedFilmsCount = false, resetSortType = false} = {}) => {

    this.#allFilmPresenter.forEach((presenter) => presenter.destroy());
    this.#allFilmPresenter.clear();
    this.#topFilmPresenter.forEach((presenter) => presenter.destroy());
    this.#topFilmPresenter.clear();
    this.#commentedFilmPresenter.forEach((presenter) => presenter.destroy());
    this.#commentedFilmPresenter.clear();

    remove(this.#sortFilmsComponent);
    remove(this.#loadingComponent);
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
      if (this.#isLoading) {
        this.#renderLoading();
        return;
      }

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
