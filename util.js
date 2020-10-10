const slugify = require('slugify');

exports.toSlug = function (val) {
  const cleaned = val.replace(/\//gi, '-');
  return slugify(cleaned, {
    lower: true,
    remove: /[\'\.\(\)\/]/gi
  });
};
