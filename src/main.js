import {render, renderPosition} from './utils/render.js';
import UserProfileView from './view/user-profile';
import MenuContainerView from './view/menu-container';
import MenuFiltersView from './view/menu-filters';
import MenuStatisticsView from './view/menu-statistics';
import SortFilmsView from './view/sort-films';
import BoardView from './view/board';
import AllFilmsSectionView from './view/all-films-section';
import FilmsContainerView from './view/films-container';
import FilmCardView from './view/film-card';
import ShowMoreButtonView from './view/show-more-button';
import TopFilmsSectionView from './view/top-films-section';
import CommentedFilmsSectionView from './view/commented-films-section';
import FooterStatisticsView from './view/footer-statistics';
import {FILM_CARD_COUNT_PER_STEP, TOP_COMMENTED_FILM_CARD_COUNT, FILM_CARD_MOCK_COUNT} from './const';
import {generateFilm} from './mock/film';
import PopUpContainerView from './view/pop-up-container';
import FilmDetailsView from './view/film-details';
import PopUpBottomSectionView from './view/pop-up-bottom-section';
import NewCommentView from './view/new-comment';
import CommentsContainerView from './view/comments-container';
import CommentView from './view/comment';
import {generateFilter} from './mock/filter';
import {filterChangeHandler, isEscEvent} from './utils/common';

const films = Array.from({length: FILM_CARD_MOCK_COUNT}, generateFilm);
const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmCardView(film);
  const popupComponent = new PopUpContainerView();
  const popupFormComponent = popupComponent.element.querySelector('.film-details__inner');

  const replacePopupToFilm = () => {
    popupComponent.element.remove();
    popupComponent.removeElement();
    document.querySelector('body').classList.remove('hide-overflow');
  };

  const escKeyDownHandler = (evt) => {
    if(isEscEvent(evt)) {
      evt.preventDefault();
      replacePopupToFilm();
      document.removeEventListener('keydown', escKeyDownHandler);
    }
  };

  const replaceFilmToPopup = () => {
    siteFooterElement.after(popupComponent.element);
    const popUpBottomSectionComponent = new PopUpBottomSectionView(film);
    const commentsContainerComponent = popUpBottomSectionComponent.element.querySelector('.film-details__comments-wrap');
    const commentsListComponent = new CommentsContainerView();

    render(popupFormComponent, new FilmDetailsView(film).element, renderPosition.BEFOREEND);
    render(popupFormComponent, popUpBottomSectionComponent.element, renderPosition.BEFOREEND);
    render(commentsContainerComponent, commentsListComponent.element, renderPosition.BEFOREEND);

    for ( const commentId of film.commentsIds) {
      render(commentsListComponent.element, new CommentView(commentId).element, renderPosition.BEFOREEND);
    }
    render(commentsContainerComponent, new NewCommentView().element, renderPosition.BEFOREEND);

    popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      replacePopupToFilm();
    });
    document.addEventListener('keydown', escKeyDownHandler);
    document.querySelector('body').classList.add('hide-overflow');
  };

  filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
    replaceFilmToPopup();
  });

  render(filmListElement, filmComponent.element, renderPosition.BEFOREEND);
};

const menuComponent = new MenuContainerView();

render(siteHeaderElement, new UserProfileView().element, renderPosition.BEFOREEND);
render(siteMainElement, menuComponent.element, renderPosition.BEFOREEND);

render(menuComponent.element, new MenuFiltersView(filters).element, renderPosition.BEFOREEND);

document.querySelectorAll('.main-navigation__item')
  .forEach((item) => item.addEventListener('click', filterChangeHandler));

render(menuComponent.element, new MenuStatisticsView().element, renderPosition.BEFOREEND);
render(siteMainElement, new SortFilmsView().element, renderPosition.BEFOREEND);

const boardComponent = new BoardView();
const allFilmsSectionComponent = new AllFilmsSectionView();
const allFilmsContainerComponent = new FilmsContainerView();

render(siteMainElement, boardComponent.element, renderPosition.BEFOREEND);
render(boardComponent.element, allFilmsSectionComponent.element, renderPosition.BEFOREEND);
render(allFilmsSectionComponent.element, allFilmsContainerComponent.element, renderPosition.BEFOREEND);

for (let i = 0; i < Math.min(films.length, FILM_CARD_COUNT_PER_STEP); i++) {
  renderFilm(allFilmsContainerComponent.element, films[i]);
}

if(films.length > FILM_CARD_COUNT_PER_STEP) {
  let renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
  const showMoreButtonComponent = new ShowMoreButtonView();

  render(allFilmsSectionComponent.element, showMoreButtonComponent.element, renderPosition.BEFOREEND);

  showMoreButtonComponent.element.addEventListener('click', (evt) => {
    evt.preventDefault();
    films.slice(renderedFilmsCount, renderedFilmsCount+FILM_CARD_COUNT_PER_STEP).forEach((film) =>
      render(allFilmsContainerComponent.element, new FilmCardView(film).element, renderPosition.BEFOREEND));
    renderedFilmsCount += FILM_CARD_COUNT_PER_STEP;
    if(films.length<=renderedFilmsCount){
      showMoreButtonComponent.element.remove();
      showMoreButtonComponent.removeElement();
    }
  });
}

const topFilmsSectionComponent = new TopFilmsSectionView();
const topFilmsContainerComponent = new FilmsContainerView();
const commentedFilmsSectionComponent = new CommentedFilmsSectionView();
const commentedFilmsContainerComponent = new FilmsContainerView();

render(boardComponent.element, topFilmsSectionComponent.element, renderPosition.BEFOREEND);
render(boardComponent.element, commentedFilmsSectionComponent.element, renderPosition.BEFOREEND);

render(topFilmsSectionComponent.element, topFilmsContainerComponent.element, renderPosition.BEFOREEND);
render(commentedFilmsSectionComponent.element, commentedFilmsContainerComponent.element, renderPosition.BEFOREEND);

films.slice(0,TOP_COMMENTED_FILM_CARD_COUNT).forEach((film)=>
  renderFilm(topFilmsContainerComponent.element, film));

films.slice(0,TOP_COMMENTED_FILM_CARD_COUNT).forEach((film)=>
  renderFilm(commentedFilmsContainerComponent.element, film));

render(siteFooterStatisticsElement, new FooterStatisticsView().element, renderPosition.BEFOREEND);
