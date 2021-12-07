import {render, renderPosition, replace, remove} from './utils/render.js';
import UserProfileView from './view/user-profile';
import MenuContainerView from './view/menu-container';
import MenuFiltersView from './view/menu-filters';
import MenuStatisticsView from './view/menu-statistics';
import NoFilmsMessageView from './view/no-films-message';
import SortFilmsView from './view/sort-films';
import BoardView from './view/board';
import AllFilmsSectionView from './view/all-films-section';
import FilmsContainerView from './view/films-container';
import FilmCardView from './view/film-card';
import ShowMoreButtonView from './view/show-more-button';
import TopFilmsSectionView from './view/top-films-section';
import CommentedFilmsSectionView from './view/commented-films-section';
import FooterStatisticsView from './view/footer-statistics';
import {FILM_CARD_COUNT_PER_STEP, TOP_COMMENTED_FILM_CARD_COUNT, FILM_CARD_MOCK_COUNT, FilterType} from './const';
import {generateFilm} from './mock/film';
import PopUpContainerView from './view/pop-up-container';
import FilmDetailsView from './view/film-details';
import PopUpBottomSectionView from './view/pop-up-bottom-section';
import NewCommentView from './view/new-comment';
import CommentsContainerView from './view/comments-container';
import CommentView from './view/comment';
import {generateFilter} from './mock/filter';
import {isEscEvent} from './utils/common';

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
    remove(popupComponent);
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

    render(popupFormComponent, new FilmDetailsView(film), renderPosition.BEFOREEND);
    render(popupFormComponent, popUpBottomSectionComponent, renderPosition.BEFOREEND);
    render(commentsContainerComponent, commentsListComponent, renderPosition.BEFOREEND);

    for ( const commentId of film.commentsIds) {
      render(commentsListComponent, new CommentView(commentId), renderPosition.BEFOREEND);
    }
    render(commentsContainerComponent, new NewCommentView(), renderPosition.BEFOREEND);

    popupComponent.setPopupCloseHandler(() => {
      replacePopupToFilm();
    });
    document.addEventListener('keydown', escKeyDownHandler);
    document.querySelector('body').classList.add('hide-overflow');
  };

  filmComponent.setFilmCardClickHandler(() => {
    replaceFilmToPopup();
  });

  render(filmListElement, filmComponent, renderPosition.BEFOREEND);
};

const menuComponent = new MenuContainerView();
const menuFiltersComponent = new MenuFiltersView(filters);

render(siteHeaderElement, new UserProfileView(), renderPosition.BEFOREEND);
render(siteMainElement, menuComponent, renderPosition.BEFOREEND);

render(menuComponent, menuFiltersComponent, renderPosition.BEFOREEND);

function filterChangeHandler(event){
  document.querySelectorAll('.main-navigation__item')
    .forEach((item) => item.classList.remove('main-navigation__item--active'));
  event.target.classList.add('main-navigation__item--active');
  if(films.length === 0) {
    const index = event.target.href.indexOf('#',0);
    const currentFilter = event.target.href.slice((index+1));
    const filterKey = Object.keys(FilterType).find((key)=>FilterType[key] === currentFilter);
    replace(new NoFilmsMessageView(FilterType[filterKey]), siteMainElement.lastChild);
  }
}

menuFiltersComponent.setFilterClickHandler(filterChangeHandler);

render(menuComponent, new MenuStatisticsView(), renderPosition.BEFOREEND);

if(films.length === 0) {
  render(siteMainElement, new NoFilmsMessageView(FilterType.ALL), renderPosition.BEFOREEND);
} else {
  render(siteMainElement, new SortFilmsView(), renderPosition.BEFOREEND);

  const boardComponent = new BoardView();
  const allFilmsSectionComponent = new AllFilmsSectionView();
  const allFilmsContainerComponent = new FilmsContainerView();

  render(siteMainElement, boardComponent, renderPosition.BEFOREEND);
  render(boardComponent, allFilmsSectionComponent, renderPosition.BEFOREEND);
  render(allFilmsSectionComponent, allFilmsContainerComponent, renderPosition.BEFOREEND);

  for (let i = 0; i < Math.min(films.length, FILM_CARD_COUNT_PER_STEP); i++) {
    renderFilm(allFilmsContainerComponent, films[i]);
  }

  if (films.length > FILM_CARD_COUNT_PER_STEP) {
    let renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;
    const showMoreButtonComponent = new ShowMoreButtonView();

    render(allFilmsSectionComponent, showMoreButtonComponent, renderPosition.BEFOREEND);

    showMoreButtonComponent.setClickHandler(() => {
      films.slice(renderedFilmsCount, renderedFilmsCount + FILM_CARD_COUNT_PER_STEP).forEach((film) =>
        renderFilm(allFilmsContainerComponent, film));
      renderedFilmsCount += FILM_CARD_COUNT_PER_STEP;
      if (films.length <= renderedFilmsCount) {
        remove(showMoreButtonComponent);
      }
    });
  }

  const topFilmsSectionComponent = new TopFilmsSectionView();
  const topFilmsContainerComponent = new FilmsContainerView();
  const commentedFilmsSectionComponent = new CommentedFilmsSectionView();
  const commentedFilmsContainerComponent = new FilmsContainerView();

  render(boardComponent, topFilmsSectionComponent, renderPosition.BEFOREEND);
  render(boardComponent, commentedFilmsSectionComponent, renderPosition.BEFOREEND);

  render(topFilmsSectionComponent, topFilmsContainerComponent, renderPosition.BEFOREEND);
  render(commentedFilmsSectionComponent, commentedFilmsContainerComponent, renderPosition.BEFOREEND);

  films.slice(0, TOP_COMMENTED_FILM_CARD_COUNT).forEach((film) =>
    renderFilm(topFilmsContainerComponent, film));

  films.slice(0, TOP_COMMENTED_FILM_CARD_COUNT).forEach((film) =>
    renderFilm(commentedFilmsContainerComponent, film));
}

render(siteFooterStatisticsElement, new FooterStatisticsView(films), renderPosition.BEFOREEND);
