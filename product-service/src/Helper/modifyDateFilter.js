const {
  startOfDayEndOfDayUTC,
  startOfDayEndOfDay,
} = require("../utility/getDateMonth");

const modifyDateFilter = (key, value) => {
  const { startOfDay, endOfDay } = startOfDayEndOfDayUTC(value);

  return {
    [key]: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  };
};

const modifyTwoDatesFilter = (key, value) => {
  const parsedValue = JSON.parse(value);
  const { startOfDay } = startOfDayEndOfDay(parsedValue.startDate);
  const { endOfDay } = startOfDayEndOfDay(parsedValue.endDate);
  // console.log("2 days filtering...");
  // console.log(`${key} :`, parsedValue.startDate);
  // console.log(`key`, parsedValue.endDate);
  return {
    ["date"]: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  };
};

module.exports = { modifyDateFilter, modifyTwoDatesFilter };
