const util = require('util');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addPassthroughCopy({ 'public/**': '.' });

  eleventyConfig.addFilter('dump', function (value) {
    return util.inspect(value, { depth: 5 });
  });
};
