import FilmCardView from '../view/film-card';
import PopUpContainerView from '../view/pop-up-container';
import FilmDetailsView from '../view/film-details';
import PopUpBottomSectionView from '../view/pop-up-bottom-section';
import NewCommentView from '../view/new-comment';
import CommentsContainerView from '../view/comments-container';
import CommentView from '../view/comment';
import {isEscEvent} from '../utils/common';
import { siteFooterElement } from '../main';
import {render, renderPosition, remove, replace} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;
  #changeMode = null;

  #filmComponent = null;
  #popupComponent = null;
  #filmDetailsComponent = null;

  #film = null;
  #mode = Mode.DEFAULT;

  constructor(filmsListContainer, changeData, changeMode) {
    this.#filmListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(film) {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;
    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#popupComponent = new PopUpContainerView();
    this.#filmDetailsComponent = new FilmDetailsView(this.#film);

    this.#filmComponent.setFilmCardClickHandler(this.#handleFilmCardClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmComponent.setAddedToWatchlistClickHandler(this.#handleAddedToWatchlistClick);
    this.#filmDetailsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmDetailsComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmDetailsComponent.setAddedToWatchlistClickHandler(this.#handleAddedToWatchlistClick);

    if(prevFilmComponent === null || prevFilmDetailsComponent === null) {
      render(this.#filmListContainer, this.#filmComponent, renderPosition.BEFOREEND);
    }

    if(this.#mode === Mode.DEFAULT && prevFilmComponent !== null){
      replace(this.#filmComponent, prevFilmComponent);
      remove(prevFilmComponent);
    }

    if(this.#mode === Mode.POPUP) {
      replace(this.#filmDetailsComponent, prevFilmDetailsComponent);
      replace(this.#popupComponent, prevPopupComponent);
      this.#renderPopup();
      replace(this.#filmComponent, prevFilmComponent);
    }

    remove(prevFilmDetailsComponent);
    remove(prevPopupComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#popupComponent);
  }

  resetView = () => {
    if(this.#mode !== Mode.DEFAULT){
      this.#replacePopupToFilm();
    }
  }

  #renderPopup = () => {
    siteFooterElement.after(this.#popupComponent.element);

    const popupFormComponent = this.#popupComponent.element.querySelector('.film-details__inner');
    const popUpBottomSectionComponent = new PopUpBottomSectionView(this.#film);
    const commentsContainerComponent = popUpBottomSectionComponent.element.querySelector('.film-details__comments-wrap');
    const commentsListComponent = new CommentsContainerView();

    render(popupFormComponent, this.#filmDetailsComponent, renderPosition.BEFOREEND);
    render(popupFormComponent, popUpBottomSectionComponent, renderPosition.BEFOREEND);
    render(commentsContainerComponent, commentsListComponent, renderPosition.BEFOREEND);
    for ( const commentId of this.#film.commentsIds) {
      render(commentsListComponent, new CommentView(commentId), renderPosition.BEFOREEND);
    }
    render(commentsContainerComponent, new NewCommentView(), renderPosition.BEFOREEND);

    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.querySelector('body').classList.add('hide-overflow');
    this.#filmDetailsComponent.setPopupCloseHandler(this.#handlePopupClose);
    this.#filmDetailsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmDetailsComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmDetailsComponent.setAddedToWatchlistClickHandler(this.#handleAddedToWatchlistClick);

  }

  #replaceFilmToPopup = () => {
    this.#renderPopup();

    this.#changeMode();
    this.#mode = Mode.POPUP;
  }

  #replacePopupToFilm = () => {
    remove(this.#popupComponent);
    document.querySelector('body').classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleFilmCardClick = () => {
    this.#replaceFilmToPopup();
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  }

  #handleAlreadyWatchedClick = () => {
    this.#changeData({...this.#film, isAlreadyWatched: !this.#film.isAlreadyWatched});
  }

  #handleAddedToWatchlistClick = () => {
    this.#changeData({...this.#film, isAddedToWatchlist: !this.#film.isAddedToWatchlist});
  }

  #handlePopupClose = (film) => {
    this.#changeData(film);
    this.#replacePopupToFilm();
  }

  #escKeyDownHandler = (evt) => {
    if(isEscEvent(evt)) {
      evt.preventDefault();
      this.#replacePopupToFilm();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }
}
