Cypress.Screenshot.defaults({
  screenshotOnRunFailure: process.env.CI === undefined,
});

const sets = {
  '/winter-hamburg-2018/': {
    title: 'A Winter Night in Ottensen',
    entry: 0,
  },
  '/random-hamburg-2015/': {
    title: 'Random Hamburg 2015',
    entry: 3,
  },
};

Object.entries(sets).forEach(([pathname, { title, entry }]) =>
  describe(title, () => {
    it('links to the set', () => {
      cy.visit('/');
      cy.contains(title).click();
      cy.location('pathname').should('eq', pathname);
    });

    it('has images', () => {
      cy.visit(pathname);
      cy.get('img').should('be.visible');
    });

    it('has a navigation between images & back to the set', () => {
      cy.visit(pathname);
      cy.get('img').should('be.visible');
      cy.get(`a[data-testid="img-link-${entry}"]`)
        .should('be.visible')
        .click();
      cy.get('a[data-testid="prev"]').click();
      cy.wait(100);
      cy.get('a[data-testid="next"]')
        .scrollIntoView()
        .click();
      cy.contains('back').click({ force: true });
      cy.location('pathname').should('eq', pathname);
    });
  })
);

describe('Insta', () => {
  it('should have images on the frontpage', () => {
    const imagesSelector = 'img:not([src^="data:image/jpeg"])';

    cy.visit('/');
    cy.get(imagesSelector).should('be.visible');
    cy.contains('View all images').click();
    cy.location('pathname').should('eq', '/insta/');
    cy.wait(100);
    cy.get(imagesSelector)
      .should('be.visible')
      .then(($$img) => {
        const [img] = $$img.eq(2);
        const anchor = img.closest('a');
        const imageId = anchor.pathname
          .split('/')
          .filter(Boolean)
          .pop();
        cy.wrap(anchor).click();
        cy.url().should('include', imageId);
        cy.contains('prev').click();
        cy.url().should('not.include', imageId);
      });
  });
});

describe('Imprint', () => {
  it('should have the legal data', () => {
    cy.visit('/imprint/');
    cy.contains('Emanuel', ($text) => {
      $text.should('contain', 'Holländische Reihe 50');
      $text.should('contain', '22765 Hamburg');
    });
  });
});
