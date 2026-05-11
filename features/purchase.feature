Feature: Successful Purchase
  As a logged-in user
  I want to complete a purchase
  So that I can buy products from the store

  Scenario: Complete purchase of two products with order total validation
    Given the user is logged in with valid credentials
    When the user adds the Bolt T-Shirt and the Red T-Shirt to the cart
    And the user navigates to the cart
    And the user proceeds to checkout
    And the user fills in the shipping information
    And the order total matches item total plus tax
    And the user confirms the order
    Then the order confirmation message "Thank you for your order!" is displayed
