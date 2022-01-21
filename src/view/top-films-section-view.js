import AbstractView from './abstract-view';

const createTopFilmsSectionTemplate = () => (
  `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
   </section>`
);

export default class TopFilmsSectionView extends AbstractView {
  get template() {
    return createTopFilmsSectionTemplate();
  }
}
