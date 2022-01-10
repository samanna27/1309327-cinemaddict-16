export const FILM_CARD_COUNT_PER_STEP = 5;
export const TOP_COMMENTED_FILM_CARD_COUNT = 30;
export const FILM_CARD_MOCK_COUNT = 20;
export const COMMENTS_QUANTITY = 100;
export const COMMENTS_IN_FILM = 5;
export const GENRES = [
  'Comedy',
  'Drama',
  'Western',
  'Musical',
  'Cartoon',
  'Mystery',
];

export const BLANK_FILM = {
  id: '',
  title: '',
  originalTitle: '',
  poster: null,
  ageConstraint: 0,
  description: [],
  rating: 0,
  director: [],
  actors: [],
  writers: [],
  releaseDate: '',
  duration: '',
  country: [],
  genre: '',
  commentsIds: [],
  isAddedToWatchlist:  false,
  isAlreadyWatched: false,
  isFavorite: false,
  watchedDate: '',
};

export const FilterType = {
  ALL: 'All',
  ADDED_TO_WATCHLIST: 'toWatchlist',
  ALREADY_WATCHED: 'history',
  FAVORITES: 'favorites',
  STATS: 'stats',
};

export const BLANK_COMMENT = {
  id: '',
  emoji: '',
  text: '',
  date: '',
};

export const SortType = {
  DEFAULT: 'default',
  DATE_DOWN: 'date-down',
  RATING_DOWN: 'rating-down',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  INIT_COMMENTS: 'INIT_COMMENTS',
};
