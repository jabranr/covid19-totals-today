const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const _ = require('lodash');
const axios = require('axios');

const callback = (err) => {
  if (err) {
    console.error(err);
  }
};

(async () => {
  try {
    const response = await axios.get(`https://disease.sh/v3/covid-19/all?yesterday=true`);
    const continents = await axios.get(`https://disease.sh/v3/covid-19/continents?yesterday=true`);
    const countries = await axios.get(`https://disease.sh/v3/covid-19/countries?yesterday=true`);

    fs.writeFile(path.resolve(__dirname, './index.json'), JSON.stringify(response.data), callback);

    fs.writeFile(
      path.resolve(__dirname, './_data/continents.json'),
      JSON.stringify(_.sortBy(continents.data, 'continent')),
      callback
    );

    fs.writeFile(
      path.resolve(__dirname, './_data/countries.json'),
      JSON.stringify(_.sortBy(countries.data, 'country')),
      callback
    );
  } catch (err) {
    console.log(err);
  }
})();
