import {remove, render, renderPosition, replace} from './utils/render.js';
import UserProfileView from './view/user-profile-view';
import MenuContainerView from './view/menu-container-view';
import FooterStatisticsView from './view/footer-statistics-view';
import StatisticsView from './view/statistics-view';
import {FilterType} from './const';
import BoardPresemter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';
import FilterModel from './model/filter-model.js';
import { periodFilterTypes } from './utils/statistics.js';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic slrugc3tquix2ry43qy6egt';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

const moviesModel = new MoviesModel(new ApiService(END_POINT, AUTHORIZATION));
moviesModel.init();

const commentsModel = new CommentsModel(new ApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const menuComponent = new MenuContainerView();
let footerStatisticsComponent = new FooterStatisticsView(moviesModel.films);
let statisticsComponent = null;

const boardPresenter = new BoardPresemter(siteMainElement, moviesModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(menuComponent, filterModel, moviesModel);

render(siteHeaderElement, new UserProfileView(), renderPosition.BEFOREEND);
render(siteMainElement, menuComponent, renderPosition.BEFOREEND);

filterPresenter.init();
boardPresenter.init();

const switchScreen = (filterType, films) => {
  switch(filterType) {
    case FilterType.STATS:
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(films, periodFilterTypes[0].name);
      render(siteMainElement, statisticsComponent, renderPosition.BEFOREEND);
      break;
    default:
      remove(statisticsComponent);
      boardPresenter.destroy();
      boardPresenter.init();
      break;
  }

};

render(siteFooterStatisticsElement, footerStatisticsComponent, renderPosition.BEFOREEND);

const renderFooterStatistic = (films) => {
  const prevFooterStatisticComponent = footerStatisticsComponent;
  footerStatisticsComponent = new FooterStatisticsView(films);
  if(prevFooterStatisticComponent === footerStatisticsComponent) {
    return;
  }
  replace(footerStatisticsComponent, prevFooterStatisticComponent);
};

export {siteFooterElement, switchScreen, renderFooterStatistic, boardPresenter};
