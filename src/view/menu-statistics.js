import AbstractView from './abstract-view';

const createMenuStatisticsTemplate = () => (
  '<a href="#stats" class="main-navigation__additional">Stats</a>'
);

export default class MenuStatisticsView extends AbstractView {
  get template() {
    return createMenuStatisticsTemplate();
  }
}
