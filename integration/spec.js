/** @typedef {import('webdriverio').BrowserObject} BrowserObject */

describe('Photoblog', () => {
  it('should have a working album', async () => {
    const title = 'A Winter Night in Ottensen';

    await browser.url('/');

    const albumAnchor = await browser.$(`h3=${title}`);
    await albumAnchor.click();

    const image = await browser.$('img:nth-child(2)');
    await image.waitForDisplayed();
    const imageAnchor = await image.$(function () {
      return this.closest('a');
    });
    await imageAnchor.click();

    const firstImageHeading = await browser.$('h1=Euler|Hermes Rear');
    await firstImageHeading.waitForDisplayed();
    expect(await firstImageHeading.isExisting()).toBeTrue();

    const backAnchor = await browser.$('a=back');
    await backAnchor.click();

    const albumHeading = await browser.$(`h1=${title}`);
    await albumHeading.waitForDisplayed();
    expect(await albumHeading.isExisting()).toBeTrue();
  });

  it('should have working Insta', async () => {
    await browser.url('/');

    const instaAnchor = await browser.$('a=View all images');
    await instaAnchor.click();

    const imageAnchor = await browser.$('//figure[2]/a');
    await imageAnchor.waitForDisplayed();
    await imageAnchor.click();

    const imageHeading = await browser.$('h1');
    await imageHeading.waitForDisplayed();
    expect(await imageHeading.isExisting()).toBeTrue();

    const backAnchor = await browser.$('a=back');
    await backAnchor.click();

    const instaHeading = await browser.$('h1=Insta');
    await instaHeading.waitForDisplayed();
    expect(await instaHeading.isExisting()).toBeTrue();
  });

  it('should have an Imprint', async () => {
    await browser.url('/imprint/');

    const name = await browser.$('p*=Emanuel');
    const street = await browser.$('p*=Eduard-Duckesz-Straße 1a');
    const city = await browser.$('p*=22765 Hamburg');

    expect(await name.isExisting()).toBeTrue();
    expect(await street.isExisting()).toBeTrue();
    expect(await city.isExisting()).toBeTrue();
  });
});
