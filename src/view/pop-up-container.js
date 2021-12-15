import AbstractView from './abstract-view';

const createPopUpContainerTemplate = () => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
    </form>
   </section>`
);

export default class PopUpContainerView extends AbstractView {
  get template() {
    return createPopUpContainerTemplate();
  }
}
