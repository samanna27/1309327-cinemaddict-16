import AbstractView from './abstract-view';

const createAllFilmsSectionTemplate = () => (
  `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
   </section>`
);

export default class AllFilmsSectionView extends AbstractView {
  get template() {
    return createAllFilmsSectionTemplate();
  }
}
