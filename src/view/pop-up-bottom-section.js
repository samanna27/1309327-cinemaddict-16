import AbstractView from './abstract-view';
import {BLANK_FILM} from '../const';

const createPopUpBottomSectionTemplate = (film) => {
  const {commentsIds} = film;

  return  `<div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsIds.length}</span></h3>
      </section>
   </div>`;
};

export default class PopUpBottomSectionView extends AbstractView {
  #film = null;

  constructor(film = BLANK_FILM) {
    super();
    this.#film=film;
  }

  get template() {
    return createPopUpBottomSectionTemplate(this.#film);
  }
}
