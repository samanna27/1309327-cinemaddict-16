import {render, renderPosition, replace} from './utils/render.js';
import UserProfileView from './view/user-profile';
import MenuContainerView from './view/menu-container';
import MenuFiltersView from './view/menu-filters';
import MenuStatisticsView from './view/menu-statistics';
import NoFilmsMessageView from './view/no-films-message';
import FooterStatisticsView from './view/footer-statistics';
import {FILM_CARD_MOCK_COUNT, FilterType} from './const';
import {generateFilm} from './mock/film';
import {generateFilter} from './mock/filter';
import BoardPresemter from './presenter/board-presenter.js';
import {generateComment} from './mock/comments';

const films = Array.from({length: FILM_CARD_MOCK_COUNT}, generateFilm);

const filters = generateFilter(films);
const commentsIds = [];
films.forEach((film) => film.commentsIds.forEach((commentId) => commentsIds.push(commentId)));
const comments = [];
commentsIds.forEach((commentId) => comments.push(generateComment(commentId)));


const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

const menuComponent = new MenuContainerView();
const menuFiltersComponent = new MenuFiltersView(filters);
const boardPresenter = new BoardPresemter(siteMainElement);

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

boardPresenter.init(films);

render(siteFooterStatisticsElement, new FooterStatisticsView(films), renderPosition.BEFOREEND);

export {siteFooterElement, comments};
