import AbstractView from './abstract-view';

const createCommentsContainerTemplate = () => (
  `<ul class="film-details__comments-list">
   </ul>`
);

export default class CommentsContainerView extends AbstractView {
  get template() {
    return createCommentsContainerTemplate();
  }
}
