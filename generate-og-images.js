const path = require('path');
const puppeteer = require('puppeteer');
const jimp = require('jimp');
const { exec } = require('child_process');

const { toSlug } = require('./util');
const continents = require('./_data/continents.json');
const watermarkPath = path.resolve(__dirname, './assets/images/apple-touch-icon-512x512.png');

async function capture(url, file, page) {
  try {
    console.log(`- Visiting: ${url}`);
    await page.goto(url);
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
    await page.screenshot({ path: file });
    console.log(`- Captured: ${file}`);

    // const [img, watermark] = await Promise.all([jimp.read(file), jimp.read(watermarkPath)]);
    // const composedImage = await img.composite(watermark, img.bitmap.width - (watermark.bitmap.width + 75), 75, [
    //   {
    //     mode: jimp.BLEND_SCREEN,
    //     opacitySource: 0.1,
    //     opacityDest: 1
    //   }
    // ]);

    // await composedImage.writeAsync(file);
    // console.log(`- Watermarked: ${file}`);
    console.log(`======================`);
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
}

(async () => {
  const startTime = +new Date();
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  exec('ls -la _site');
  exec('ls -la _site/assets/images/opengraph');

  await capture(
    `file://${path.resolve(__dirname, `_site/index.html`)}`,
    path.resolve(__dirname, `./_site/assets/images/opengraph/homepage.png`),
    page
  );

  // for (const c of continents) {
  //   await capture(
  //     `file://${path.resolve(__dirname, `_site/continents/${toSlug(c.continent)}/index.html`)}`,
  //     path.resolve(__dirname, `./_site/assets/images/opengraph/continents-${toSlug(c.continent)}.png`),
  //     page
  //   );

  //   for (const country of c.countries) {
  //     await capture(
  //       `file://${path.resolve(__dirname, `_site/countries/${toSlug(country)}/index.html`)}`,
  //       path.resolve(__dirname, `./_site/assets/images/opengraph/countries-${toSlug(country)}.png`),
  //       page
  //     );
  //   }
  // }

  browser.close();
  const totalTime = new Date(+new Date() - startTime).getSeconds();
  const timeTaken = totalTime / 60 >= 1 ? `${totalTime / 60}m` : `${totalTime}s`;
  console.log(`- Completed in ${timeTaken}`);
})();
