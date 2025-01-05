const { default: mongoose } = require("mongoose");

const handleSpecialCondition = (field, value) => {
  if (field === "_id") {
    if (Array.isArray(value)) {
      const orArray = value.map((item) => ({
        [field]: new mongoose.Types.ObjectId(item),
      }));
      return { $or: orArray };
    } else {
      return { [field]: new mongoose.Types.ObjectId(value) };
    }
  }
  //   if(field === "date"){
  // const {startOfDay, endOfDay}= startOfDayEndOfDay(value)
  // return { [field]:  };
  //   }
  // Add more special conditions for other fields if needed
  // else if (field === "anotherField") {
  //   // handle another special condition
  // }
  // Default case: return a standard filter
  return { [field]: value };
};

const createDynamicFilter = (filtersData) => {
  if (Object.keys(filtersData).length) {
    const filter = Object.entries(filtersData).map(([field, value]) => {
      return handleSpecialCondition(field, value);
    });

    return filter;
  } else {
    // Return an empty filter if no filters are provided
    return [];
  }
};

exports.filteringHelper = {
  createDynamicFilter,
};
