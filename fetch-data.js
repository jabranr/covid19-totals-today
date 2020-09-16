const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const axios = require("axios");

async function fetchData() {
  try {
    const response = await axios.get(`https://api.covid19api.com/summary`);
    const { Global, Countries, Date } = response.data;

    fs.writeFile(
      path.resolve(__dirname, "./index.json"),
      JSON.stringify(Global),
      (error) => {
        if (error) {
          console.error(error);
        }
      }
    );

    Countries.forEach(async (country) => {
      await mkdirp(path.resolve(__dirname, `./${country.Slug}`));

      fs.writeFile(
        path.resolve(__dirname, `./${country.Slug}/index.md`),
        `---
layout: layout.njk
title: COVID daily totals for ${country.Country}
---

<p>NewConfirmed {{ NewConfirmed }}</p>
<p>TotalConfirmed {{ TotalConfirmed }}</p>
<p>NewDeaths {{ NewDeaths }}</p>
<p>TotalDeaths {{ TotalDeaths }}</p>
<p>NewRecovered {{ NewRecovered }}</p>
<p>TotalRecovered {{ TotalRecovered }}</p>
`,
        (error) => {
          if (error) {
            console.error(error);
          }
        }
      );

      fs.writeFile(
        path.resolve(__dirname, `./${country.Slug}/index.json`),
        JSON.stringify(country),
        (error) => {
          if (error) {
            console.error(error);
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
}

fetchData();
