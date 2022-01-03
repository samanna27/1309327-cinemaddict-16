const countFilmsWatched = (films) => films.filter((film) => (film.isAlreadyWatched === true)).length;
const countAccumulatedDurationFilmsWatched = (films) => {
  const filmsWatched = films.filter((film) => (film.isAlreadyWatched === true));
  let accumulatedDuration = 0;
  for(const film of filmsWatched) {
    const hourIndex = film.duration.indexOf('h', 0);
    const minIndex = film.duration.indexOf('m', 0);
    const hoursInFilm = film.duration.slice(0, hourIndex);
    const minInFilm = film.duration.slice(hourIndex+2, minIndex);
    accumulatedDuration += (hoursInFilm * 60 + minInFilm*1);
  }
  const hours = Math.floor(accumulatedDuration / 60, 0);
  const min = accumulatedDuration % 60;
  const duration = new Object();
  duration.hours = hours;
  duration.min = min;

  return duration;
};

const getUniqueGenresList = (films) => {
  const genres = new Set();
  for(const film of films) {
    genres.add(...film.genre.map((genre) => genre));
  }

  return [...genres];
};

const getFilmsByGenre = (films) => {
  const genres = getUniqueGenresList(films);
  const filmsByGenre = new Array();
  genres.forEach((genre) => {
    const filmsCount = films.slice().filter((film) => film.genre.includes(genre)).length;
    filmsByGenre.push(filmsCount);
  });

  return filmsByGenre;
};

const getTopGenre = (films) => {
  const genres = getUniqueGenresList(films);
  const filmsByGenre = getFilmsByGenre(films);
  const topGenreFilmsNumber = Math.max(...filmsByGenre);
  const isTopGenreIndex = (element) => element === topGenreFilmsNumber;

  const topGenreIndex = filmsByGenre.findIndex(isTopGenreIndex);
  const topGenre = [...genres][topGenreIndex];

  return topGenre;
};

const periodFilterTypes = [{
  type: 'all-time',
  name: 'All time',
},
{
  type: 'today',
  name: 'Today',
},
{
  type: 'week',
  name: 'Week',
},
{
  type: 'month',
  name: 'Month',
},
{
  type: 'year',
  name: 'Year',
}];

export {countFilmsWatched, countAccumulatedDurationFilmsWatched, getUniqueGenresList, getFilmsByGenre, getTopGenre, periodFilterTypes};
