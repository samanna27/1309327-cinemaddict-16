import FilmCardView from '../view/film-card';
import PopUpContainerView from '../view/pop-up-container';
import FilmDetailsView from '../view/film-details';
import PopUpBottomSectionView from '../view/pop-up-bottom-section';
import NewCommentView from '../view/new-comment';
import CommentsContainerView from '../view/comments-container';
import CommentView from '../view/comment';
import {isEscEvent} from '../utils/common';
import { comments, siteFooterElement } from '../main';
import {render, renderPosition, remove, replace} from '../utils/render.js';
import { nanoid } from 'nanoid';

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
  _popUpBottomSectionComponent = null;
  _newCommentComponent = null;

  _film = null;
  #mode = Mode.DEFAULT;

  constructor(filmsListContainer, changeData, changeMode) {
    this.#filmListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;
    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmComponent = new FilmCardView(this._film);
    this.#popupComponent = new PopUpContainerView();
    this.#filmDetailsComponent = new FilmDetailsView(this._film);
    this._popUpBottomSectionComponent = new PopUpBottomSectionView(this._film);

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
    const popUpBottomSectionComponent = new PopUpBottomSectionView(this._film);
    const commentsContainerComponent = popUpBottomSectionComponent.element.querySelector('.film-details__comments-wrap');
    this._newCommentComponent = new NewCommentView();

    render(popupFormComponent, this.#filmDetailsComponent, renderPosition.BEFOREEND);
    render(popupFormComponent, popUpBottomSectionComponent, renderPosition.BEFOREEND);
    this.#renderCommentsList(commentsContainerComponent);
    render(commentsContainerComponent, this._newCommentComponent, renderPosition.BEFOREEND);

    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.querySelector('body').classList.add('hide-overflow');
    this.#filmDetailsComponent.setPopupCloseHandler(this.#handlePopupClose);
    this.#filmDetailsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmDetailsComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#filmDetailsComponent.setAddedToWatchlistClickHandler(this.#handleAddedToWatchlistClick);
    this._newCommentComponent.setCommentSubmitHandler(this.createNewCommentHandler);
  }

  #renderCommentsList = (container) => {
    const commentsListComponent = new CommentsContainerView();
    render(container, commentsListComponent, renderPosition.BEFOREEND);

    for ( const commentId of this._film.commentsIds) {
      const commentComponent = new CommentView(commentId);
      render(commentsListComponent, commentComponent, renderPosition.BEFOREEND);
      commentComponent.setCommentDeleteHandler(this.deleteCommentHandler);
    }
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
    this.#changeData({...this._film, isFavorite: !this._film.isFavorite});
  }

  #handleAlreadyWatchedClick = () => {
    this.#changeData({...this._film, isAlreadyWatched: !this._film.isAlreadyWatched});
  }

  #handleAddedToWatchlistClick = () => {
    this.#changeData({...this._film, isAddedToWatchlist: !this._film.isAddedToWatchlist});
  }


  createNewCommentHandler = (newComment) => {
    newComment.id = nanoid();
    this._film.commentsIds.push(newComment.id);
    comments.push(newComment);

    this.#changeData({...this._film});
  }

  deleteCommentHandler = (commentToDeleteId) => {
    const commentIndex = this._film.commentsIds.findIndex((commentId) => commentId === commentToDeleteId);

    this._film.commentsIds.splice(commentIndex,1);

    this.#changeData({...this._film});
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
