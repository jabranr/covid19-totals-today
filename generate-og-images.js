const path = require('path');
const puppeteer = require('puppeteer');
const jimp = require('jimp');
const fs = require('fs');

const { toSlug } = require('./util');
const continents = require('./_data/continents.json');
const watermarkPath = path.resolve(__dirname, './assets/images/apple-touch-icon-512x512.png');

async function capture(url, file, page) {
  try {
    console.log(fs.readdirSync('.'));
    console.log('==============');
    console.log(fs.readdirSync('./_site'));
    console.log(`- Visiting: ${url}`);
    await page.goto(url);
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
    await page.screenshot({ path: file, type: 'png' });
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
  } catch (err) {
    console.log(err);
    process.exit(1);
  } finally {
    console.log(`======================`);
  }
}

(async () => {
  const generateOne = process.argv[2] === '--generate-one';
  const startTime = +new Date();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await capture(
    `file://${path.resolve(__dirname, `_site/index.html`)}`,
    `./_site/assets/images/opengraph/homepage.png`,
    page
  );

  if (!generateOne) {
    for (const c of continents) {
      await capture(
        `file://${path.resolve(__dirname, `_site/continents/${toSlug(c.continent)}/index.html`)}`,
        path.resolve(__dirname, `./_site/assets/images/opengraph/continents-${toSlug(c.continent)}.png`),
        page
      );

      for (const country of c.countries) {
        await capture(
          `file://${path.resolve(__dirname, `_site/countries/${toSlug(country)}/index.html`)}`,
          path.resolve(__dirname, `./_site/assets/images/opengraph/countries-${toSlug(country)}.png`),
          page
        );
      }
    }
  }

  browser.close();
  const totalTime = new Date(+new Date() - startTime).getSeconds();
  const timeTaken = totalTime / 60 >= 1 ? `${totalTime / 60}m` : `${totalTime}s`;
  console.log(`- Completed in ${timeTaken}`);
})();
