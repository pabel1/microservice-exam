const slugify = require("slugify");

const generateSlug = (text) => {
  console.log(text);
  return text ? slugify(text, { lower: true, trim: true }) : null;
};

module.exports = generateSlug;
