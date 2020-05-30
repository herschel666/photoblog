describe('Photoblog', () => {
  it('should have a working album', async () => {
    const title = 'A Winter Night in Ottensen';

    await browser.url('/');

    const albumAnchor = await browser.$(`a=${title}`);
    await albumAnchor.click();

    const image = await browser.$('img:nth-child(2)');
    const imageAnchor = await image.$(function () {
      return this.closest('a');
    });
    await imageAnchor.click();

    const imageHeading = await browser.$('h1=Euler|Hermes Rear');
    expect(await imageHeading.isExisting()).toBeTrue();

    const backAnchor = await browser.$('a=back');
    await backAnchor.click();

    const albumHeading = await browser.$(`h1=${title}`);
    expect(await albumHeading.isExisting()).toBeTrue();
  });

  it('should have working Insta', async () => {
    await browser.url('/');

    const instaAnchor = await browser.$('a=View all images');
    await instaAnchor.click();

    const imageAnchor = await browser.$('//figure[2]/a');
    await imageAnchor.click();

    const imageHeading = await browser.$('h1');
    expect(await imageHeading.isExisting()).toBeTrue();

    const backAnchor = await browser.$('a=back');
    await backAnchor.click();

    const instaHeading = await browser.$('h1=Insta');
    expect(await instaHeading.isExisting()).toBeTrue();
  });

  it('should have an Imprint', async () => {
    await browser.url('/imprint/');

    const name = await browser.$('p*=Emanuel');
    const street = await browser.$('p*=Holländische Reihe 50');
    const city = await browser.$('p*=22765 Hamburg');

    expect(await name.isExisting()).toBeTrue();
    expect(await street.isExisting()).toBeTrue();
    expect(await city.isExisting()).toBeTrue();
  });
});
