/// <reference types="cypress" />
import ThemeEngine from "../../src";

describe('Tests', async () => {
  it('inputmodes', async () => {
    cy.visit('http://localhost:999');
    cy.get('#ScaleBox').invoke('outerWidth').should('equal', 48);
    cy.get('#ScaleBox').invoke('outerHeight').should('equal', 32);
    cy.get('#ScaleBox').trigger('pointerdown', 10, 10, { pointerType: 'pen' });
    cy.get('#ScaleBox').invoke('outerWidth').should('equal', 57.59375);
    cy.get('#ScaleBox').invoke('outerHeight').should('equal', 38.390625);
    cy.get('#ScaleBox').trigger('pointerdown', 10, 10, { pointerType: 'touch' });
    cy.get('#ScaleBox').invoke('outerWidth').should('equal', 76.796875);
    cy.get('#ScaleBox').invoke('outerHeight').should('equal', 51.1875);
    cy.get('#ScaleBox').trigger('pointerdown', 10, 10, { pointerType: 'mouse' });
    cy.get('#ScaleBox').invoke('outerWidth').should('equal', 48);
    cy.get('#ScaleBox').invoke('outerHeight').should('equal', 32);

    //cy.get('body').then((body) => { (<ThemeEngine>(<any>body[0]).themeEngine).scale.set = 2; })
  })
  // it('text scaling', async () => {
  //   cy.visit('http://localhost:999');
  //   cy.get('#ScaleBox').invoke('outerWidth').should('equal', 48);
  //   cy.get('#ScaleBox').invoke('outerHeight').should('equal', 32);
  //   cy.get('body').then((body) => { (<ThemeEngine>(<any>body[0]).themeEngine).textScale.set = 2; })
  //   cy.get('#ScaleBox').invoke('outerWidth').should('equal', 96);
  //   cy.get('#ScaleBox').invoke('outerHeight').should('equal', 64);
  //   cy.reload()
  //   cy.get('#ScaleBox').invoke('outerWidth').should('equal', 96);
  //   cy.get('#ScaleBox').invoke('outerHeight').should('equal', 64);
  // })
})