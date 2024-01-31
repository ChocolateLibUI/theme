/// <reference types="cypress" />
import DocumentHandler from "@chocolatelibui/document";
import { ThemeEngine } from "../../src";

describe("Tests", async () => {
  it("inputmodes", async () => {
    cy.visit("http://localhost:999");
    cy.get("#ScaleBox").invoke("outerWidth").should("equal", 48);
    cy.get("#ScaleBox").invoke("outerHeight").should("equal", 32);
    cy.get("body").then((body) => {
      ((body[0] as any).theme as any).scale.write(200);
    });
    cy.get("#ScaleBox").invoke("outerWidth").should("equal", 96);
    cy.get("#ScaleBox").invoke("outerHeight").should("equal", 64);
    cy.get("body").then((body) => {
      ((body[0] as any).theme as any).scale.write(50);
    });
    cy.get("#ScaleBox").invoke("outerWidth").should("equal", 24);
    cy.get("#ScaleBox").invoke("outerHeight").should("equal", 16);
  });
});
