import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import { getRandomInteger, transferMinutesToDurationString } from '../utils/common.js';
import { COMMENTS_QUANTITY, COMMENTS_IN_FILM, GENRES as genres } from '../const.js';

const SENTENCE_COUNT = 5;
const RATING_MIN=0;
const RATING_MAX=10;
const GENRES_ACTORS_WRITERS_MAX =3;
const GENRES_ACTORS_WRITERS_MIN =1;
const DIRECTOR_COUNTRY_COUNT = 1;

const generateTitle = () => {
  const titles = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The man with the golden arm',
    'Santa Claus conquers the Martians',
    'Popeye the Sailor meets Sindbad the Sailor',
  ];
  const randomIndex = getRandomInteger(0, titles.length - 1);
  return titles[randomIndex];
};

const generatePoster = () => {
  const posters = [
    './images/posters/made-for-each-other.png',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/the-dance-of-life.jpg',
    './images/posters/the-great-flamarion.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg',
  ];
  const randomIndex = getRandomInteger(0, posters.length - 1);
  return posters[randomIndex];
};

const descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  'Cras aliquet varius magna, non porta ligula feugiat eget. ',
  'Fusce tristique felis at fermentum pharetra. ',
  'Aliquam id orci ut lectus varius viverra. ',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
  'Sed sed nisi sed augue convallis suscipit in sed felis. ',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. ',
  'In rutrum ac purus sit amet tempus. ',
];

export const getRandomArrayElements = (elements, count) => {
  const elementsCopy=elements.slice();
  let result=[];
  for (let index=0; index < count; index++) {
    const randomIndex=getRandomInteger(0, elementsCopy.length - 1);
    const removed=elementsCopy.splice(randomIndex,1);
    result=result.concat(removed);
  }
  return result;
};

export const commentsIds = new Array(COMMENTS_QUANTITY).fill().map(nanoid);

const directorsActorsWriters = [
  'Anthony Mann',
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
  'Mary Beth Hughes',
  'Dan Duryea',
  'Erich von Stroheim',
];

const countries = [
  'Russia',
  'USA',
  'Chine',
];

const generateDate = () => {
  const maxDaysGap = 360;
  const daysGap = getRandomInteger(-maxDaysGap, 0);
  return dayjs().add(daysGap, 'day').toDate();
};

const MAX_DURATION = 150;
const MIN_DURATION = 20;
const AGE_LIMIT = 180;

export const generateFilm = () => {
  const date = generateDate();

  return {
    id: nanoid(),
    title: generateTitle(),
    originalTitle: generateTitle(),
    poster: generatePoster(),
    ageConstraint: getRandomInteger(0,AGE_LIMIT),
    description: getRandomArrayElements(descriptions, getRandomInteger(0, SENTENCE_COUNT)).join(''),
    rating: getRandomInteger(RATING_MIN, RATING_MAX),
    director: getRandomArrayElements(directorsActorsWriters, DIRECTOR_COUNTRY_COUNT),
    actors: getRandomArrayElements(directorsActorsWriters, getRandomInteger(GENRES_ACTORS_WRITERS_MIN, GENRES_ACTORS_WRITERS_MAX)).join(', '),
    writers: getRandomArrayElements(directorsActorsWriters, getRandomInteger(GENRES_ACTORS_WRITERS_MIN, GENRES_ACTORS_WRITERS_MAX)).join(', '),
    releaseDate: dayjs(date).format('D MMMM YYYY'),
    duration: transferMinutesToDurationString(getRandomInteger(MIN_DURATION, MAX_DURATION)),
    country: getRandomArrayElements(countries, DIRECTOR_COUNTRY_COUNT),
    genre: getRandomArrayElements(genres, getRandomInteger(GENRES_ACTORS_WRITERS_MIN, GENRES_ACTORS_WRITERS_MAX)),
    commentsIds: getRandomArrayElements(commentsIds, getRandomInteger(0, COMMENTS_IN_FILM)),
    isAddedToWatchlist: Boolean(getRandomInteger(0, 1)),
    isAlreadyWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    watchedDate: dayjs(date).format('D MMMM YYYY'),
  };
};
