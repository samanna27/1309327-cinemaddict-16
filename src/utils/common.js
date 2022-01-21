import dayjs from 'dayjs';
import { MIN_IN_HOUR, HOURS_IN_DAY, DAYS_IN_MONTH, MONTHS_IN_YEAR, ALL_TIME_YEARS } from '../const';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const transferMinutesToDurationString = (minutes) => {
  const hours = minutes / MIN_IN_HOUR;
  const min = minutes % MIN_IN_HOUR;

  return `${hours.toFixed(0)}h ${min}m`;
};

export const formatDescription = (fullDescription) => {
  const descriptionLength = fullDescription.length;
  let description;
  if (descriptionLength>=140) {
    description = `${fullDescription.slice(0, 139)}...`;
  } else {
    description = fullDescription;
  }
  return description;
};

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const isEnter = (evt) => evt.key === 'Enter';

export const makeHumanDate = (date) => {
  let period = 0;
  const currentDate =new Date();
  if(dayjs(date).isAfter(dayjs(currentDate).subtract(5, 'minutes'))) {
    return 'now';
  } else if (dayjs(date).isAfter(dayjs().subtract(MIN_IN_HOUR, 'minutes'))) {
    return 'a few minutes ago';
  } else if (dayjs(date).isAfter(dayjs().subtract(HOURS_IN_DAY, 'hours'))) {
    period = Math.floor(dayjs().diff(dayjs(date), 'hour', true),0);
    return `${period} ${period === 1 ? 'hour' : 'hours'} ago`;
  } else if (dayjs(date).isAfter(dayjs().subtract(DAYS_IN_MONTH, 'days'))) {
    period = Math.floor(dayjs().diff(dayjs(date), 'day', true),0);
    return `${period} ${period === 1 ? 'day' : 'days'} ago`;
  } else if (dayjs(date).isAfter(dayjs().subtract(MONTHS_IN_YEAR, 'months'))) {
    period = Math.floor(dayjs().diff(dayjs(date), 'month', true),0);
    return `${period} ${period === 1 ? 'month' : 'months'} ago`;
  } else if (dayjs(date).isAfter(dayjs().subtract(ALL_TIME_YEARS, 'years'))) {
    period = Math.floor(dayjs().diff(dayjs(date), 'year', true),0);
    return `${period} ${period === 1 ? 'year' : 'years'} ago`;
  }
};
