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

  setPopupCloseHandler = (callback) => {
    this._callback.popupClose = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#popupCloseHandler);
  }

  #popupCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupClose();
  }
}
