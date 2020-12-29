const fs = require('fs');
const path = require('path');
const util = require('util');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

const { toSlug } = require('./util');

dayjs.extend(utc);

const dotenvFile = path.resolve(__dirname, `./.env.${process.env.NODE_ENV}`);

if (fs.existsSync(dotenvFile)) {
  require('dotenv-expand')(
    require('dotenv').config({
      path: dotenvFile
    })
  );
}

const config = require('./_data/config');

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

  // customize slugify
  eleventyConfig.addFilter('slug', function (value) {
    return toSlug(value);
  });

  // format numbers
  eleventyConfig.addFilter('number_format', function (value) {
    if (Number(value) === 0) {
      return 'N/A';
    }

    return Number(value).toLocaleString();
  });

  // format date time
  eleventyConfig.addFilter('date', function (value, format = 'DD MMM YYYY') {
    if (format === 'unix') {
      return +dayjs.utc();
    }

    if (value === undefined) {
      return dayjs.utc().format(format);
    }

    return dayjs.utc(Number(value)).format(format);
  });

  // manipulate date time
  eleventyConfig.addFilter('addDate', function (value, duration, type) {
    if (Boolean(duration) && Boolean(type)) {
      return dayjs.utc(Number(value)).add(duration, type);
    }

    return dayjs.utc(Number(value));
  });

  // format date time
  eleventyConfig.addFilter('absoluteUrl', function (value) {
    if (!Boolean(value) || value === '/') {
      return config.env.APP_HOSTNAME;
    }

    const regulateSlash = value.startsWith('/') ? value : `'/'${value}`;
    return `${config.env.APP_HOSTNAME}${regulateSlash}`;
  });

  // add 404
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware('*', (req, res) => {
          const content404 = fs.readFileSync('_site/404.html');
          res.write(content404);
          res.writeHead(404);
          res.end();
        });
      }
    }
  });
};
