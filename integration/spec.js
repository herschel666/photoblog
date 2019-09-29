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
      cy.get('a[data-testid="next"]').click();
      cy.contains('back').click({ force: true });
      cy.location('pathname').should('eq', pathname);
    });
  })
);

describe('Insta', () => {
  it('should have images on the frontpage', () => {
    const imageId = '278cft3dEP4tl0t1YvgUCM';

    cy.visit('/');
    cy.get('img').should('be.visible');
    cy.wait(1000);
    cy.contains('View all images').click();
    cy.location('pathname').should('eq', '/insta/');
    cy.get('img').should('be.visible');
    cy.wait(1000);
    cy.get(`a[href="/insta/${imageId}/"]`).click();
    cy.url().should('include', imageId);
    cy.contains('prev').click();
    cy.url().should('not.include', imageId);
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
