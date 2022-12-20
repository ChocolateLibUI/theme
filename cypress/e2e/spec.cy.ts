/// <reference types="cypress" />
import { touch, scale } from "../../src"

describe('Tests', async () => {
  it('touch mode', () => {
    touch.set = true;
    expect(touch.get).to.equal(true);
    expect(document.documentElement.classList.contains('touch')).to.equal(true);
    touch.set = false;
    expect(touch.get).to.equal(false);
    expect(document.documentElement.classList.contains('touch')).to.equal(false);
  })
  it('scaling', async () => {


  })
})