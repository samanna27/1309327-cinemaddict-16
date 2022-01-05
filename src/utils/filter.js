import { FilterType } from '../const';

export const filters = {
  [FilterType.ALL]: (films) => films,
  [FilterType.FAVORITES]: (films) =>films.filter((film) => film.isFavorite),
  [FilterType.ADDED_TO_WATCHLIST]: (films) =>films.filter((film) => film.isAddedToWatchlist),
  [FilterType.ALREADY_WATCHED]: (films) =>films.filter((film) => film.isAlreadyWatched),
  [FilterType.STATS]: (films) => films,
};
