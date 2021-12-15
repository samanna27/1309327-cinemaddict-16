export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const transferMinutesToDurationString = (minutes) => {
  const hours = minutes / 60;
  const min = minutes % 60;

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

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
