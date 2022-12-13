/// <reference types="cypress" />
import { index } from "../../src"

describe('empty spec', () => {
  it('true', () => {
    expect('true').to.equal('true');
  })
  it('test', () => {
    expect(index).to.equal('test');
  })
  it('web', () => {
    cy.visit('http://localhost:999')
  })
})