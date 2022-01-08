const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getFilmComments = async (film) => {
    const response = await this.#load({
      url: `comments/${film.id}`,
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  addComment = async (comment, film) => {
    const response = await this.#load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(this.#adaptCommentToServer(comment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  deleteComment = async (comment) => {
    const response = await this.#load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (film) => {
    const adaptedFilm = {...film,
      'film_info': {
        'title': film.title,
        'alternative_title': film.originalTitle,
        'poster': film.poster,
        'age_rating': film.ageConstraint,
        'description': film.description,
        'total_rating': film.rating,
        'director': film.director,
        'actors': [...film.actors],
        'writers': [...film.writers],
        'release': {
          'date': film.releaseDate,
          'release_country': film.country,
        },
        'runtime': film.duration,
        'genre': [...film.genre],
      },
      'comments': film.commentsIds,
      'user_details': {
        'already_watched': film.isAlreadyWatched,
        'favorite': film.isFavorite,
        'watching_date': film.watchedDate,
        'watchlist': film.isAddedToWatchlist,
      },
    };

    delete adaptedFilm.title;
    delete adaptedFilm.originalTitle;
    delete adaptedFilm.poster;
    delete adaptedFilm.ageConstraint;
    delete adaptedFilm.description;
    delete adaptedFilm.rating;
    delete adaptedFilm.director;
    delete adaptedFilm.actors;
    delete adaptedFilm.writers;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.duration;
    delete adaptedFilm.country;
    delete adaptedFilm.genre;
    delete adaptedFilm.commentsIds;
    delete adaptedFilm.isAlreadyWatched;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.isAddedToWatchlist;
    delete adaptedFilm.watchedDate;

    return adaptedFilm;
  }

  #adaptCommentToServer = (comment) => {
    const adaptedComment = {...comment,
      'comment': comment.text,
      'emotion': comment.emoji,
    };

    delete adaptedComment.text;
    delete adaptedComment.emoji;
    delete adaptedComment.date;
    delete adaptedComment.id;

    return adaptedComment;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
