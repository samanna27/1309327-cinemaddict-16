import SmartView from './smart-view';
import dayjs from 'dayjs';
import { Chart, registerables} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { countFilmsWatched, countAccumulatedDurationFilmsWatched, getUniqueGenresList, getFilmsByGenre, getTopGenre, periodFilterTypes } from '../utils/statistics';
import { DAYS_IN_MONTH, DAYS_IN_YEAR, ALL_TIME_YEARS } from '../const';

const renderStatsChart = (daysCtx, films) => {
  Chart.register(...registerables);
  const BAR_HEIGHT = 50;

  daysCtx.height = BAR_HEIGHT * 10;
  const uniqueGenresList = getUniqueGenresList(films);
  const filmsByGenre = getFilmsByGenre(films);
  Chart.defaults.plugins.legend.display = false;

  return new Chart(daysCtx, {
    plugins: [ChartDataLabels],
    type: 'bar',
    data: {
      labels: uniqueGenresList,
      datasets: [{
        data: filmsByGenre,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxis: {
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
        xAxes: {
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = (currentFilter, films) => {
  const duration = countAccumulatedDurationFilmsWatched(films);
  const topGenre = getTopGenre(films);
  const periodFilterItemsTamplate = periodFilterTypes.slice().map((filter) => (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filter.type}" value="${filter.type}" ${filter.name === currentFilter ? 'checked': ''}>
    <label for="statistic-${filter.type}" class="statistic__filters-label">${filter.name}</label>`)).join('');

  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">Movie buff</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
    ${periodFilterItemsTamplate}
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${countFilmsWatched(films)} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${duration.hours} <span class="statistic__item-description">h</span> ${duration.min} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${films.length === 0 ? '' : topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;
};

export default class StatisticsView extends SmartView {
  #daysChart = null;
  #currentPeriodFilter = null;

  constructor(films, currentFilterType) {
    super();
    this.#currentPeriodFilter = currentFilterType;

    this._data = {
      films,
      dateFrom: dayjs().subtract(ALL_TIME_YEARS, 'year').toDate(),
      dateTo: dayjs().toDate(),
    };

    this.#setCharts();
    this.#setPeriodClickHandler();
  }

  get template() {
    const filteredFilms = this.#filterFilms();
    return createStatisticsTemplate(this.#currentPeriodFilter, filteredFilms);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#daysChart) {
      this.#daysChart.destroy();
      this.#daysChart = null;
    }
  }


  restoreHandlers = () => {
    this.#setCharts();
    this.#setPeriodClickHandler();
  }

  #filterFilms = () => {
    const {films, dateFrom, dateTo} = this._data;
    const period = dayjs(dateTo).diff(dayjs(dateFrom), 'day', true);
    const isWatchedInPeriod = (film) => dayjs(film.watchedDate).isAfter(dayjs().subtract(period, 'days'));

    const filteredFilms = films.filter(isWatchedInPeriod);

    return filteredFilms;
  }

  #setPeriodClickHandler = () => {
    this.element.querySelectorAll('.statistic__filters-input').forEach((element) => element.addEventListener('click', this.#periodClickHandler));
  }

  #periodClickHandler = (evt) => {
    evt.preventDefault();
    this.#currentPeriodFilter = evt.target.value;
    switch(this.#currentPeriodFilter) {
      case ('week'):
        this.updateData({
          dateFrom: dayjs().subtract(6, 'day').toDate(),
        });
        break;
      case ('today'):
        this.updateData({
          dateFrom: dayjs().toDate(),
        });
        break;
      case ('month'):
        this.updateData({
          dateFrom: dayjs().subtract(DAYS_IN_MONTH, 'day').toDate(),
        });
        break;
      case ('year'):
        this.updateData({
          dateFrom: dayjs().subtract(DAYS_IN_YEAR, 'day').toDate(),
        });
        break;
      default:
        this.updateData({
          dateFrom: dayjs().subtract(ALL_TIME_YEARS, 'year').toDate(),
        });
        break;
    }
  }

  #setCharts = () => {
    const {dateFrom, dateTo} = this._data;

    const daysCtx = this.element.querySelector('.statistic__chart');
    this.#daysChart = renderStatsChart(daysCtx, this.#filterFilms(), dateFrom, dateTo);
  }
}
