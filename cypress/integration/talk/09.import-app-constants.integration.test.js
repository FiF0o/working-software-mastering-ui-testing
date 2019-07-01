/// <reference types="Cypress" />

import { AUTHENTICATE_API_URL } from "../../../src/constants";
import {
  LOGIN_BUTTON,
  PASSWORD_PLACEHOLDER,
  SUCCESS_FEEDBACK,
  USERNAME_PLACEHOLDER
} from "../../../src/strings";

context("Authentication", () => {
  const username = "stefano@conio.com";
  const password = "mysupersecretpassword";

  it("should work with the right credentials", () => {
    cy.server();
    cy.route({
      method: "POST",

      url: `**${AUTHENTICATE_API_URL}`,

      response: "fixture:authentication/success.json"
    }).as("auth-xhr");

    cy.viewport(300, 600);
    cy.visit("/");

    cy.getByPlaceholderText(USERNAME_PLACEHOLDER)
      .should("be.visible")
      .type(username);

    cy.getByPlaceholderText(PASSWORD_PLACEHOLDER)
      .should("be.visible")
      .type(password);

    cy.getByText(LOGIN_BUTTON)
      .should("be.visible")
      .click();

    cy.wait("@auth-xhr").then(xhr => {
      expect(xhr.request.body).to.have.property("username", username);
      expect(xhr.request.body).to.have.property("password", password);
    });

    cy.getByText(SUCCESS_FEEDBACK).should("be.visible");
  });
});
