import {render, renderPosition} from './utils/render.js';
import UserProfileView from './view/user-profile';
import MenuContainerView from './view/menu-container';
import MenuStatisticsView from './view/menu-statistics';
import FooterStatisticsView from './view/footer-statistics';
import {FILM_CARD_MOCK_COUNT} from './const';
import {generateFilm} from './mock/film';
import BoardPresemter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import {generateComment} from './mock/comments';

const films = Array.from({length: FILM_CARD_MOCK_COUNT}, generateFilm);

const commentsIds = [];
films.forEach((film) => film.commentsIds.forEach((commentId) => commentsIds.push(commentId)));
const comments = [];
commentsIds.forEach((commentId) => comments.push(generateComment(commentId)));


const moviesModel = new MoviesModel();
moviesModel.films = films;

const commentsModel = new CommentsModel();
commentsModel.comments = comments;

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

const menuComponent = new MenuContainerView();

const boardPresenter = new BoardPresemter(siteMainElement, moviesModel, commentsModel, filterModel);

render(siteHeaderElement, new UserProfileView(), renderPosition.BEFOREEND);
render(siteMainElement, menuComponent, renderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(menuComponent, filterModel, moviesModel);

filterPresenter.init();

render(menuComponent, new MenuStatisticsView(), renderPosition.BEFOREEND);

boardPresenter.init();

render(siteFooterStatisticsElement, new FooterStatisticsView(films), renderPosition.BEFOREEND);

export {siteFooterElement, comments};
