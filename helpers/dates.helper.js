const moment = require('moment');

/**
 * Get date in specific range
 * @param {Date} start 
 * @param {Date} end 
 * @param {Integer} interval : interval for in date range. default 1
 * @param {*} unit : unit for interval in date range. default "day"
 */
const GetDates = (start, end, interval, unit = "day") => {
  let dates = [];
  let currentdate = start;
  while (moment(currentdate).isSameOrBefore(moment(end))) {
    dates.push(moment(currentdate).format('YYYYMM'));
    currentdate = moment(currentdate).add(interval, unit).format();
  }
  return dates;
}

/**
 * check date range valid 
 * @param {Date} start 
 * @param {Date} end 
 */
const IsDateRangeValid = (paramStart, paramEnd) => {
  const start = moment(paramStart).format();
  const end = moment(paramEnd).format();

  // check date format invalid or not
  if (!moment(start).isValid() || !moment(end).isValid()) {
    return {
      status: false,
      message: 'invalid date format'
    };
  }
  if (moment(start).isAfter(end)) {
    return {
      status: false,
      message: 'overlap date'
    };
  }

  return {
    status: true,
    message: 'OK'
  };
}

module.exports = {
  GetDates,
  IsDateRangeValid
};
