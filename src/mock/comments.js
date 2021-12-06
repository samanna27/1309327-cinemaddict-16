import dayjs from 'dayjs';
import { getRandomInteger } from '../utils/common.js';

const EMOJI_AUTHOR_COUNT = 1;

const getRandomArrayElements = (elements, count) => {
  const elementsCopy=elements.slice();
  let result=[];
  for (let index=0; index < count; index++) {
    const randomIndex=getRandomInteger(0, elementsCopy.length - 1);
    const removed=elementsCopy.splice(randomIndex,1);
    result=result.concat(removed);
  }
  return result;
};

const generateDate = () => {
  const maxYearsGap = 120;
  const yearsGap = getRandomInteger(-maxYearsGap, 0);
  return dayjs().add(yearsGap, 'year').toDate();
};

const emoji = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const authors = [
  'Tim Macoveev',
  'John Doe',
  'Stepashka',
  'Karkusha',
];

const commentsText = [
  'heeh',
  'hooh',
  'haah',
  'hyhh',
];

export const generateComment = (id) => {
  const date = generateDate();

  return {
    id: id,
    emoji: `./images/emoji/${getRandomArrayElements(emoji, EMOJI_AUTHOR_COUNT)}.png`,
    date: dayjs(date).format('YYYY/MM/DD HH:MM'),
    author: getRandomArrayElements(authors, EMOJI_AUTHOR_COUNT),
    text: getRandomArrayElements(commentsText, EMOJI_AUTHOR_COUNT),
  };
};
