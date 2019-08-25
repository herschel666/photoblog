Cypress.Screenshot.defaults({
  screenshotOnRunFailure: false,
});

const sets = {
  '/winter-hamburg-2018/': {
    title: 'A Winter Night in Ottensen',
    photos: ['Euler|Hermes Front', 'Euler|Hermes Rear'],
    entry: 0,
  },
  '/random-hamburg-2015/': {
    title: 'Random Hamburg 2015',
    photos: ['Pier', 'Landing stages'],
    entry: 3,
  },
};

Object.entries(sets).forEach(([pathname, { title, photos, entry }]) =>
  describe(title, () => {
    it('links to the set', () => {
      cy.visit('/');
      cy.contains(title).click();
      cy.url().should('include', pathname);
    });

    it('has images', () => {
      cy.visit(pathname);
      cy.get('img').should(($$img) =>
        expect($$img.length).to.be.greaterThan(1)
      );
    });

    it('has a navigation between images & back to the set', () => {
      const [img1, img2] = photos;

      cy.visit(pathname);
      cy.get(`a[data-testid="img-link-${entry}"]`).then(($link) => {
        $link.click();
        cy.contains(img1).click();
        cy.contains(img2).click();
        cy.contains('back').click({ force: true });
        cy.url().should('include', pathname);
      });
    });
  })
);

describe('Imprint', () => {
  it('should have the legal data', () => {
    cy.visit('/imprint/');
    cy.contains('Emanuel', ($text) => {
      $text.should('contain', 'Holländische Reihe 50');
      $text.should('contain', '22765 Hamburg');
    });
  });
});
