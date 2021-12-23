import dayjs from 'dayjs';

const getWeightRatingDown = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortFilmDateDown = (filmA, filmB) => {
  const weight = getWeightRatingDown(filmA.releaseDate, filmB.releaseDate);

  if (weight !== null) {
    return weight;
  }

  return dayjs(filmB.releaseDate).diff(dayjs(filmA.releaseDate));
};

export const sortFilmRatingDown = (filmA, filmB) => {
  const weight = getWeightRatingDown(filmA.rating, filmB.rating);

  if (weight !== null) {
    return weight;
  }

  return (filmB.rating-filmA.rating);
};

export const isDatesEqual = (dateA, dateB) =>
  (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');
