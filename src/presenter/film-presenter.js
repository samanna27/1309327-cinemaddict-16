import FilmCardView from '../view/film-card-view';
import PopUpContainerView from '../view/pop-up-container-view';
import FilmDetailsView from '../view/film-details-view';
import PopUpBottomSectionView from '../view/pop-up-bottom-section-view';
import NewCommentView from '../view/new-comment-view';
import CommentsContainerView from '../view/comments-container-view';
import CommentView from '../view/comment-view';
import LoadingView from '../view/loading-view';
import {isEscEvent} from '../utils/common';
import {siteFooterElement, boardPresenter} from '../main';
import {render, renderPosition, remove, replace} from '../utils/render.js';
import { UserAction, UpdateType } from '../const';
import dayjs from 'dayjs';

export const State = {
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;
  #changeMode = null;
  #yScroll = 0;

  #filmComponent = null;
  #popupComponent = null;
  #filmDetailsComponent = null;
  _popUpBottomSectionComponent = null;
  _newCommentComponent = null;
  #loadingComponent = new LoadingView();
  #allCommentsComponents = new Map();
  #commentToDeleteComponent = null;
  #isCommentsChanged = false;

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
    this.#popupComponent.element.addEventListener('scroll', this.#popupScrollHandler);

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
    this.#popupComponent.element.scrollTo(0, this.#yScroll);
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
      const getRequiredComment = (element) => {
        if(element.id === commentId) {
          return element;
        }
        return false;
      };

      if (this.#comments.comments.length === 0 || !this.#film.commentsIds.includes(this.#comments.comments[0].id)) {
        render(commentsListComponent, this.#loadingComponent, renderPosition.AFTERBEGIN);
        return;
      }
      const comment = this.#comments.comments.find(getRequiredComment);
      const commentComponent = new CommentView(comment);
      this.#allCommentsComponents.set(comment.id, commentComponent);

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
      {...this.#film,
        isAlreadyWatched: !this.#film.isAlreadyWatched,
        watchedDate: this.#film.isAlreadyWatched === false ? dayjs().toDate(): null,
      });
  }

  #handleAddedToWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      {...this.#film, isAddedToWatchlist: !this.#film.isAddedToWatchlist});
  }

  #popupScrollHandler = (evt) => {
    this.#yScroll = evt.target.scrollTop;
  }

  setSaving = () => {
    this._newCommentComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setDeletion = (update) => {
    this.#commentToDeleteComponent = this.#allCommentsComponents.get(update.commentToDelete.id);
    this.#commentToDeleteComponent.updateData ({
      isDisabled: true,
      isDeleting: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this._newCommentComponent.updateData({
        isDisabled: false,
      });
      this._newCommentComponent.setCommentSubmitHandler(this.createNewCommentHandler);
    };

    this._newCommentComponent.shake(resetFormState);
  }

  setCommentToDeleteAborting = () => {
    const resetFormState = () => {
      this.#commentToDeleteComponent.updateData({
        isDisabled: false,
        isDeleting: false,
      });
      this.#commentToDeleteComponent.setCommentDeleteHandler(this.deleteCommentHandler);
    };

    this.#commentToDeleteComponent.shake(resetFormState);
  }

  createNewCommentHandler = (newComment) => {
    this.#isCommentsChanged = true;

    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {...this.#film, newComment, ...this.#isCommentsChanged},
    );
  }

  deleteCommentHandler = (commentToDelete) => {
    this.#isCommentsChanged = true;

    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {...this.#film, commentToDelete, ...this.#isCommentsChanged},
    );
  }

  #handlePopupClose = () => {
    this.#replacePopupToFilm();
    if(this.#isCommentsChanged === true) {
      boardPresenter.rerenderCommentedFilmsComponent();
    }
    this.#yScroll = 0;
  }

  #escKeyDownHandler = (evt) => {
    if(isEscEvent(evt)) {
      evt.preventDefault();
      this.#replacePopupToFilm();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      if(this.#isCommentsChanged === true) {
        boardPresenter.rerenderCommentedFilmsComponent();
      }
      this.#yScroll = 0;
    }
  }
}
