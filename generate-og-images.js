const path = require('path');
const puppeteer = require('puppeteer');
const jimp = require('jimp');

const { toSlug } = require('./util');
const continents = require('./_data/continents.json');
const watermarkPath = path.resolve(__dirname, './assets/images/apple-touch-icon-200x200.png');

async function capture(url, file, page) {
  try {
    console.log(`- Visiting: ${url}`);
    await page.goto(url);
    await page.setViewport({ width: 1024, height: 576, deviceScaleFactor: 2 });
    await page.screenshot({ path: file });
    console.log(`- Captured: ${file}`);

    // const [img, watermark] = await Promise.all([jimp.read(file), jimp.read(watermarkPath)]);

    // const composedImage = await img.composite(watermark, img.bitmap.width - (watermark.bitmap.width + 10), 20, [
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
  } finally {
    process.exit(0);
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const c of continents) {
    await capture(
      `file://${path.resolve(__dirname, `_site/continents/${toSlug(c.continent)}/index.html`)}`,
      path.resolve(__dirname, `./assets/images/opengraph/continent-${toSlug(c.continent)}.png`),
      page
    );

    // c.countries.forEach((cc) => {
    //   console.log(toSlug(cc));
    // });
  }

  await browser.close();
  console.log('- Done');
})();
