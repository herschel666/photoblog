describe('Photoblog', () => {
  it('should have a working album', async () => {
    await browser.url('/');
    const title = await browser.getTitle();
    expect(title).toContain('ek|photos');
    //   cy.get('img').should('be.visible');
    //   cy.get('img')
    //     .eq(0)
    //     .click();
    //   cy.waitForRouteChange();
    //   cy.location('pathname').should('eq', '/winter-hamburg-2018/');
    //   cy.get('img').should('be.visible');
    //   cy.get('img')
    //     .eq(1)
    //     .closest('a')
    //     .click();
    //   cy.waitForRouteChange();
    //   cy.location('pathname').should('contain', '/winter-hamburg-2018/');
    //   cy.contains('back').click();
    //   cy.waitForRouteChange();
    //   cy.contains('A few days ago something rare happened in Hamburg:');
    // });

    // it('should have working Insta', () => {
    //   cy.visit('/');
    //   cy.contains('View all images').click();
    //   cy.waitForRouteChange();
    //   cy.location('pathname').should('eq', '/insta/');
    //   cy.get('img')
    //     .eq(1)
    //     .closest('a')
    //     .click();
    //   cy.waitForRouteChange();
    //   cy.contains('Sky');
    //   cy.contains('back').click();
    //   cy.waitForRouteChange();
    //   cy.contains('Insta');
    // });

    // it('should have an Imprint', () => {
    //   cy.visit('/imprint/');
    //   cy.waitForRouteChange();
    //   cy.contains('Emanuel');
    //   cy.contains('Holländische Reihe 50');
    //   cy.contains('22765 Hamburg');
  });
});
