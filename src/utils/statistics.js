const countFilmsWatched = (films) => films.filter((film) => (film.isAlreadyWatched === true)).length;
const countAccumulatedDurationFilmsWatched = (films) => {
  const filmsWatched = films.filter((film) => (film.isAlreadyWatched === true));
  let accumulatedDuration = 0;
  for(const film of filmsWatched) {
    accumulatedDuration += film.duration;
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

  const genresFilmsPairs = [];
  let count = 0;
  for(const genre of genres) {
    genresFilmsPairs.push({name: genre, count: filmsByGenre[count]});
    count ++;
  }
  const topGenre = [];
  for(const pair of genresFilmsPairs) {
    if(pair.count === topGenreFilmsNumber) {
      topGenre.push(pair.name);
    }
  }

  return [...topGenre];
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
