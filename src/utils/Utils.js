import moment from 'moment';
const calDateAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} years ago`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months ago`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} days ago`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours ago`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes ago`;
  }
  return `${Math.floor(seconds)} seconds ago`;
};

const toCamel = (o) => {
  // var newO, origKey, newKey, value;
  // if (o instanceof Array) {
  //   return o.map((value) => {
  //     if (typeof value === 'object') {
  //       value = toCamel(value);
  //     }
  //     return value;
  //   });
  // } else {
  //   newO = {};
  //   for (origKey in o) {
  //     if (o.hasOwnProperty(origKey)) {
  //       newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
  //       value = o[origKey];
  //       if (value instanceof Array || (value !== null && value.constructor === Object)) {
  //         value = toCamel(value);
  //       }
  //       newO[newKey] = value;
  //     }
  //   }
  // }
  // return newO;
  let newO = Array.isArray(o) ? [] : {};
  let origKey, newKey, value;
  for (origKey in o) {
    if (o.hasOwnProperty(origKey)) {
      newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
      value = o[origKey];
      if (value !== null && typeof value === 'object') {
        value = toCamel(value);
      }
      newO[newKey] = value;
    }
  }
  return newO;
};

const dateToTicks = (date) => {
  const epochOffset = 62_135_596_800_000;
  const ticksPerMillisecond = 10_000;

  const ticks = epochOffset + date.getTime() * ticksPerMillisecond;

  return Math.floor(ticks + Math.random() * 100_000);
};

const addDays = (date, days) => {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const minusDays = (date, days) => {
  let result = new Date(date);
  result.setDate(result.getDate() - days);

  return result;
};

const getCurrentWeek = () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(days / 7);
  return weekNumber;
};

const isNumber = (input) => {
  if (!input) return false;
  return isFinite(input);
};

const delayDuration = (delay) => {
  return new Promise((res) => setTimeout(res, delay));
};

export { calDateAgo, toCamel, dateToTicks, addDays, minusDays, getCurrentWeek, isNumber, delayDuration };
