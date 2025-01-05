/* eslint-disable node/no-unsupported-features/es-syntax */
const {
  modifyDateFilter,
  modifyTwoDatesFilter,
} = require("./modifyDateFilter");

// const processFilters = (filters, fieldsToModify) => {
//   console.log("filters :", filters);
//   return filters?.map((filter) => {
//     const [key, value] = Object.entries(filter)[0];
//     if (shouldModifyFilter(key, fieldsToModify)) {
//       return modifyFilter(key, value);
//     }
//     return filter;
//   });
// };

const processFilters = (filters, fieldsToModify) => {
 
  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (shouldModifyFilter(key, fieldsToModify)) {
      return { ...acc, ...modifyFilter(key, value) };
    }
    return { ...acc, [key]: value };
  }, {});
};
const shouldModifyFilter = (key, fieldsToModify) => {
  return fieldsToModify.some(
    (field) => key.toLowerCase() === field.toLowerCase()
  );
};

const modifyFilter = (key, value) => {
  switch (key.toLowerCase()) {
    case "date":
      return modifyDateFilter(key, value);
    case "daterange":
      return modifyTwoDatesFilter(key, value);

    default:
      return { [key]: value };
  }
};

module.exports = { processFilters };
