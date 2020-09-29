const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const util = require('util');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const { exit } = require('process');

dayjs.extend(utc);

const dotEnvPath = path.resolve(__dirname, './.env');
const dotenvFiles = [`${dotEnvPath}.${process.env.NODE_ENV}`, dotEnvPath].filter(Boolean);

dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile
      })
    );
  }
});

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

  // format date time
  eleventyConfig.addFilter('absoluteUrl', function (value) {
    if (!Boolean(value) || value === '/') {
      return process.env.APP_HOSTNAME;
    }

    const regulateSlash = value.startsWith('/') ? value : `'/'${value}`;
    return `${process.env.APP_HOSTNAME}${regulateSlash}`;
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
