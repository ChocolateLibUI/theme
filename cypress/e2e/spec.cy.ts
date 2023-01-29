/// <reference types="cypress" />

describe('Tests', async () => {
  it('touch mode', () => {
    cy.visit('http://localhost:999');
    cy.get('#TouchBox').invoke('outerWidth').should('equal', 48);
    cy.get('#TouchBox').invoke('outerHeight').should('equal', 32);
    cy.get('#TouchBox').click();
    cy.get('#TouchBox').invoke('outerWidth').should('equal', 64);
    cy.get('#TouchBox').invoke('outerHeight').should('equal', 48);
  })
  it('scaling', async () => {
    cy.visit('http://localhost:999');
    cy.get('#ScaleBox').invoke('outerWidth').should('equal', 48);
    cy.get('#ScaleBox').invoke('outerHeight').should('equal', 32);
    cy.get('#ScaleBox').click();
    cy.get('#ScaleBox').invoke('outerWidth').should('equal', 96);
    cy.get('#ScaleBox').invoke('outerHeight').should('equal', 64);
    cy.reload()
    cy.get('#ScaleBox').invoke('outerWidth').should('equal', 96);
    cy.get('#ScaleBox').invoke('outerHeight').should('equal', 64);
  })
})