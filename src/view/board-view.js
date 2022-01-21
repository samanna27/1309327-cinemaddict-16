import AbstractView from './abstract-view';

const createBoardTemplate = () => (
  `<section class="films">
   </section>`
);

export default class BoardView extends AbstractView {
  get template() {
    return createBoardTemplate();
  }
}
