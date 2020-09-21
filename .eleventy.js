const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

module.exports = function (eleventyConfig) {
  // copy static assets
  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addPassthroughCopy({ 'public/**': '.' });
  eleventyConfig.addPassthroughCopy({
    'node_modules/normalize.css/normalize.css': 'assets/css/normalize.css'
  });

  // add dump for debugging
  eleventyConfig.addFilter('dump', function (value) {
    return util.inspect(value, { depth: 5 });
  });

  // format numbers
  eleventyConfig.addFilter('number_format', function (value) {
    return Number(value).toLocaleString();
  });

  // format date time
  eleventyConfig.addFilter('date', function (value, format = 'DD MMM YYYY') {
    return dayjs.utc(value).format(format);
  });

  // lodash groupBy
  eleventyConfig.addFilter('groupBy', function (collection, needle) {
    return _.groupBy(collection, needle);
  });

  // add 404
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware('*', (req, res) => {
          const content404 = fs.readFileSync('_site/404/index.html');
          res.write(content404);
          res.writeHead(404);
          res.end();
        });
      }
    }
  });
};
