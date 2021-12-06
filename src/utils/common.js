import NoFilmsMessageView from '../view/no-films-message';
import {FilterType} from '../const';
import {siteMainElement} from '../main';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const transferMinutesToDurationString = (minutes) => {
  const hours = minutes / 60;
  const min = minutes % 60;

  return `${hours.toFixed(0)}h ${min}m`;
};

export const formatDescription = (fullDescription) => {
  const descriptionLength = fullDescription.length;
  let description;
  if (descriptionLength>=140) {
    description = `${fullDescription.slice(0, 139)}...`;
  } else {
    description = fullDescription;
    return description;
  }
};

export function filterChangeHandler(event){
  document.querySelectorAll('.main-navigation__item')
    .forEach((item) => item.classList.remove('main-navigation__item--active'));
  event.target.classList.add('main-navigation__item--active');
  const index = event.target.href.indexOf('#',0);
  const currentFilter = event.target.href.slice((index+1));
  const filterKey = Object.keys(FilterType).find((key)=>FilterType[key] === currentFilter);
  siteMainElement.replaceChild(new NoFilmsMessageView(FilterType[filterKey]).element, siteMainElement.lastChild);
}

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
