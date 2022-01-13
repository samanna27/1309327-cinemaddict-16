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

export const sortFilmCommentsDown = (filmA, filmB) => {
  const weight = getWeightRatingDown(filmA.commentsIds.length, filmB.commentsIds.length);

  if (weight !== null) {
    return weight;
  }

  return (filmB.commentsIds.length-filmA.commentsIds.length);
};

export const isDatesEqual = (dateA, dateB) =>
  (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');

export const adaptToClient = (film) => {
  const adaptedFilm = {...film,
    'title': film.film_info.title,
    'originalTitle': film.film_info.alternative_title,
    'poster': film.film_info.poster,
    'ageConstraint': film.film_info.age_rating,
    'description': film.film_info.description,
    'rating': film.film_info.total_rating,
    'director': film.film_info.director,
    'actors': [...film.film_info.actors],
    'writers': [...film.film_info.writers],
    'releaseDate': film.film_info.release.date,
    'duration': film.film_info.runtime,
    'country': film.film_info.release.release_country,
    'genre': [...film.film_info.genre],
    'commentsIds': film.comments,
    'isAddedToWatchlist': film.user_details.watchlist,
    'isAlreadyWatched': film.user_details.already_watched,
    'isFavorite': film.user_details.favorite,
    'watchedDate': film.user_details.watching_date,
  };

  delete adaptedFilm['film_info'];
  delete adaptedFilm['comments'];
  delete adaptedFilm['user_details'];

  return adaptedFilm;
};
