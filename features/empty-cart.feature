Feature: Empty Cart Checkout Prevention
  As a QA engineer
  I want to verify that completing a purchase with an empty cart is not possible
  So that invalid transactions are prevented

  Scenario: Checkout with empty cart should not result in an order confirmation
    Given the user is logged in with valid credentials
    And the cart contains no items
    When the user navigates to the cart
    And the user attempts to complete the checkout process
    Then the order confirmation should not be displayed
