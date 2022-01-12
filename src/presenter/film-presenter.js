import FilmCardView from '../view/film-card';
import PopUpContainerView from '../view/pop-up-container';
import FilmDetailsView from '../view/film-details';
import PopUpBottomSectionView from '../view/pop-up-bottom-section';
import NewCommentView from '../view/new-comment';
import CommentsContainerView from '../view/comments-container';
import CommentView from '../view/comment';
import LoadingView from '../view/loading-view';
import {isEscEvent} from '../utils/common';
import {siteFooterElement} from '../main';
import {render, renderPosition, remove, replace} from '../utils/render.js';
import { nanoid } from 'nanoid';
import { UserAction, UpdateType } from '../const';

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
  #loadingComponent = new LoadingView();

  #film = null;
  #comments = null;
  #mode = Mode.DEFAULT;

  constructor(filmsListContainer, changeData, changeMode) {
    this.#filmListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(film, filmCommentsModel) {
    this.#film = film;
    this.#comments = filmCommentsModel;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;
    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#filmComponent = new FilmCardView(this.#film);
    this.#popupComponent = new PopUpContainerView();
    this.#filmDetailsComponent = new FilmDetailsView(this.#film);
    this._popUpBottomSectionComponent = new PopUpBottomSectionView(this.#film);

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
    this.#comments.init(this.#film);
    siteFooterElement.after(this.#popupComponent.element);

    const popupFormComponent = this.#popupComponent.element.querySelector('.film-details__inner');
    const commentsContainerComponent = this._popUpBottomSectionComponent.element.querySelector('.film-details__comments-wrap');
    this._newCommentComponent = new NewCommentView();

    render(popupFormComponent, this.#filmDetailsComponent, renderPosition.BEFOREEND);
    render(popupFormComponent, this._popUpBottomSectionComponent, renderPosition.BEFOREEND);
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

    for ( const commentId of this.#film.commentsIds) {
      const requiredComment = (element) => {
        if(element.id === commentId) {
          return element;
        }
        return false;
      };

      if (this.#comments.comments.length === 0 || !this.#film.commentsIds.includes(this.#comments.comments[0].id)) {
        render(commentsListComponent, this.#loadingComponent, renderPosition.AFTERBEGIN);
        return;
      }
      const comment = this.#comments.comments.find(requiredComment);
      const commentComponent = new CommentView(comment);

      render(commentsListComponent, commentComponent, renderPosition.BEFOREEND);
      commentComponent.setCommentDeleteHandler(this.deleteCommentHandler);
    }
  }

  updateCommentsList = (film) => {
    remove(this.#loadingComponent);
    const prevPopupBottonSectionComponent = this._popUpBottomSectionComponent;
    this._popUpBottomSectionComponent = new PopUpBottomSectionView(film);
    const commentsContainerComponent = this._popUpBottomSectionComponent.element.querySelector('.film-details__comments-wrap');
    this._newCommentComponent = new NewCommentView();
    replace(this._popUpBottomSectionComponent, prevPopupBottonSectionComponent);

    this.#renderCommentsList(commentsContainerComponent);
    render(commentsContainerComponent, this._newCommentComponent, renderPosition.BEFOREEND);
    this._newCommentComponent.setCommentSubmitHandler(this.createNewCommentHandler);
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
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, isFavorite: !this.#film.isFavorite},
    );
  }

  #handleAlreadyWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, isAlreadyWatched: !this.#film.isAlreadyWatched});
  }

  #handleAddedToWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, isAddedToWatchlist: !this.#film.isAddedToWatchlist});
  }


  createNewCommentHandler = (newComment) => {
    newComment.id = nanoid();
    this.#film.commentsIds.push(newComment.id);
    this.#comments.comments.push(newComment);

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {...this.#film, newComment},
    );
  }

  deleteCommentHandler = (commentToDelete) => {
    const commentIndex = this.#film.commentsIds.findIndex((commentId) => commentId === commentToDelete.id);

    this.#film.commentsIds.splice(commentIndex,1);

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {...this.#film, commentToDelete},
    );
  }

  #handlePopupClose = () => {
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
