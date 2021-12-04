import {renderTemplate, renderPosition} from './utils/render.js';
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
import {FILM_CARD_COUNT_PER_STEP, TOP_COMMENTED_FILM_CARD_COUNT, FILM_CARD_MOCK_COUNT} from './const';
import {generateFilm} from './mock/film';
import {createPopUpContainerTemplate} from './view/pop-up-container';
import {createFilmDetailsTemplate} from './view/film-details';
import {createPopUpBottomSectionTemplate} from './view/pop-up-bottom-section';
import {createNewCommentTemplate} from './view/new-comment';
import {createCommentsContainerTemplate} from './view/comments-container';
import {createCommentTemplate} from './view/comment';
import {generateFilter} from './mock/filter';
import {handleFilterChange} from './utils/common';

const films = Array.from({length: FILM_CARD_MOCK_COUNT}, generateFilm);
const filters = generateFilter(films);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');

renderTemplate(siteHeaderElement, createUserProfileTemplate(), renderPosition.BEFOREEND);
renderTemplate(siteMainElement, createMenuContainerTemplate(), renderPosition.BEFOREEND);

const menuElement = siteMainElement.querySelector('.main-navigation');

renderTemplate(menuElement, createMenuFiltersTemplate(filters), renderPosition.BEFOREEND);

document.querySelectorAll('.main-navigation__item')
  .forEach((item) => item.addEventListener('click', handleFilterChange));

renderTemplate(menuElement, createMenuStatisticsTemplate(), renderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortFilmsTemplate(), renderPosition.BEFOREEND);
renderTemplate(siteMainElement, createBoardTemplate(), renderPosition.BEFOREEND);

const boardElement = siteMainElement.querySelector('.films');

renderTemplate(boardElement, createAllFilmsSectionTemplate(), renderPosition.BEFOREEND);

const allFilmsSectionElement = boardElement.querySelector('.films-list');

renderTemplate(allFilmsSectionElement, createFilmsContainerTemplate(), renderPosition.BEFOREEND);

const allFilmsListElement = allFilmsSectionElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_CARD_COUNT_PER_STEP); i++) {
  renderTemplate(allFilmsListElement, createFilmCardTemplate(films[i]), renderPosition.BEFOREEND);
}

if(films.length > FILM_CARD_COUNT_PER_STEP) {
  let renderedFilmsCount = FILM_CARD_COUNT_PER_STEP;

  renderTemplate(allFilmsSectionElement, createShowMoreButtonTemplate(), renderPosition.BEFOREEND);

  const showMoreButton = allFilmsSectionElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films.slice(renderedFilmsCount, renderedFilmsCount+FILM_CARD_COUNT_PER_STEP).forEach((film) =>
      renderTemplate(allFilmsListElement, createFilmCardTemplate(film), renderPosition.BEFOREEND));
    renderedFilmsCount += FILM_CARD_COUNT_PER_STEP;
    if(films.length<=renderedFilmsCount){
      showMoreButton.remove();
    }
  });
}

renderTemplate(boardElement, createTopFilmsSectionTemplate(), renderPosition.BEFOREEND);
renderTemplate(boardElement, createCommentedFilmsTemplate(), renderPosition.BEFOREEND);

const topFilmsContainerElement = boardElement.children[1];
const commentedFilmsContainerElement = boardElement.children[2];

renderTemplate(topFilmsContainerElement, createFilmsContainerTemplate(), renderPosition.BEFOREEND);
renderTemplate(commentedFilmsContainerElement, createFilmsContainerTemplate(), renderPosition.BEFOREEND);

const topFilmsListElement = topFilmsContainerElement.querySelector('.films-list__container');
const commentedFilmsListElement = commentedFilmsContainerElement.querySelector('.films-list__container');

films.slice(0,TOP_COMMENTED_FILM_CARD_COUNT).forEach((film)=>
  renderTemplate(topFilmsListElement, createFilmCardTemplate(film), renderPosition.BEFOREEND));

films.slice(0,TOP_COMMENTED_FILM_CARD_COUNT).forEach((film)=>
  renderTemplate(commentedFilmsListElement, createFilmCardTemplate(film), renderPosition.BEFOREEND));

renderTemplate(siteFooterStatisticsElement, createFooterStatisticsTemplate(), renderPosition.BEFOREEND);

// Pop-up section
renderTemplate(siteFooterElement, createPopUpContainerTemplate(), renderPosition.AFTEREND);

const popupFormElement = document.querySelector('.film-details__inner');

renderTemplate(popupFormElement, createFilmDetailsTemplate(films[0]), renderPosition.BEFOREEND);
renderTemplate(popupFormElement, createPopUpBottomSectionTemplate(films[0]), renderPosition.BEFOREEND);

const commentsSectionElement = popupFormElement.querySelector('.film-details__comments-wrap');

renderTemplate(commentsSectionElement, createCommentsContainerTemplate(), renderPosition.BEFOREEND);

const commentsListElement = commentsSectionElement.querySelector('.film-details__comments-list');

for ( const commentId of films[0].commentsIds) {
  renderTemplate(commentsListElement, createCommentTemplate(commentId), renderPosition.BEFOREEND);
}
renderTemplate(commentsSectionElement, createNewCommentTemplate(), renderPosition.BEFOREEND);
