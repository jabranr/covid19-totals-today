const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const axios = require('axios');

const callback = (err) => {
  if (err) {
    console.error(err);
  }
};

async function fetchData() {
  try {
    const response = await axios.get(`https://api.covid19api.com/summary`);
    const { Global, Countries, Date } = response.data;

    fs.writeFile(path.resolve(__dirname, './index.json'), JSON.stringify(Global), callback);
    fs.writeFile(path.resolve(__dirname, './_data/countries.json'), JSON.stringify(Countries), callback);
  } catch (err) {
    console.log(err);
  }
}

fetchData();
