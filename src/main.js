import {renderTemplate, renderPosition} from './render.js';
import {createUserProfileTemplate} from './view/user-profile';
import {createMenuContainerTemplate} from './view/menu-container';
import {createMenuFiltersTemplate} from './view/menu-filters';
import {createMenuStatisticsTemplate} from './view/menu-statistics';
import {createSortFilmsTemplate} from './view/sort-films';
import {createBoardTemplate} from './view/board';
import {createAllFilmsSectionTemplate} from './view/all-films-section';
import {createFilmsContainerTemplate} from './view/films-container';
import {createFilmCardTemplate} from './view/film-card';
import {createShowMoreButtonTemplate} from './view/show-more-button';
import {createTopFilmsSectionTemplate} from './view/top-films-section';
import {createCommentedFilmsTemplate} from './view/commented-films-section';
import {createFooterStatisticsTemplate} from './view/footer-statistics';
import {FILM_CARD_COUNT_PER_STEP, TOP_COMMENTED_FILM_CARD_COUNT} from './const';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer__statistics');

renderTemplate(siteHeaderElement, createUserProfileTemplate(), renderPosition.BEFOREEND);
renderTemplate(siteMainElement, createMenuContainerTemplate(), renderPosition.BEFOREEND);

const menuElement = siteMainElement.querySelector('.main-navigation');

renderTemplate(menuElement, createMenuFiltersTemplate(), renderPosition.BEFOREEND);
renderTemplate(menuElement, createMenuStatisticsTemplate(), renderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortFilmsTemplate(), renderPosition.BEFOREEND);
renderTemplate(siteMainElement, createBoardTemplate(), renderPosition.BEFOREEND);

const boardElement = siteMainElement.querySelector('.films');

renderTemplate(boardElement, createAllFilmsSectionTemplate(), renderPosition.BEFOREEND);

const allFilmsSectionElement = boardElement.querySelector('.films-list');

renderTemplate(allFilmsSectionElement, createFilmsContainerTemplate(), renderPosition.BEFOREEND);
renderTemplate(allFilmsSectionElement, createShowMoreButtonTemplate(), renderPosition.BEFOREEND);

const allFilmsListElement = allFilmsSectionElement.querySelector('.films-list__container');

for (let i = 0; i < FILM_CARD_COUNT_PER_STEP; i++) {
  renderTemplate(allFilmsListElement, createFilmCardTemplate(), renderPosition.BEFOREEND);
}

renderTemplate(boardElement, createTopFilmsSectionTemplate(), renderPosition.BEFOREEND);
renderTemplate(boardElement, createCommentedFilmsTemplate(), renderPosition.BEFOREEND);

const topFilmsContainerElement = boardElement.children[1];
const commentedFilmsContainerElement = boardElement.children[2];

renderTemplate(topFilmsContainerElement, createFilmsContainerTemplate(), renderPosition.BEFOREEND);
renderTemplate(commentedFilmsContainerElement, createFilmsContainerTemplate(), renderPosition.BEFOREEND);

const topFilmsListElement = topFilmsContainerElement.querySelector('.films-list__container');
const commentedFilmsListElement = commentedFilmsContainerElement.querySelector('.films-list__container');

for (let i = 0; i < TOP_COMMENTED_FILM_CARD_COUNT; i++) {
  renderTemplate(topFilmsListElement, createFilmCardTemplate(), renderPosition.BEFOREEND);
}

for (let i = 0; i < TOP_COMMENTED_FILM_CARD_COUNT; i++) {
  renderTemplate(commentedFilmsListElement, createFilmCardTemplate(), renderPosition.BEFOREEND);
}

renderTemplate(siteFooterElement, createFooterStatisticsTemplate(), renderPosition.BEFOREEND);
