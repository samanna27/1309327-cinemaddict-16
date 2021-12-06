const filmsToFilterMap = {
  'All movies': (films) => films.length,
  'Favorites': (films) =>films.filter((film) => film.isFavorite).length,
  'ToWatchlist': (films) =>films.filter((film) => film.isAddedToWatchlist).length,
  'History': (films) =>films.filter((film) => film.isAlreadyWatched).length,
};

export const generateFilter = (films) => Object.entries(filmsToFilterMap).map(
  ([filterName, countFilms]) =>({
    name: filterName,
    count: countFilms(films),
  }),
);
