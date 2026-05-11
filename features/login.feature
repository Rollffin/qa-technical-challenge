Feature: User Authentication
  As a user of Saucedemo
  I want to be able to log in to the application
  So that I can access the product catalog

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user logs in with valid credentials
    Then the user is redirected to the products page

  Scenario: Login attempt with a locked account
    Given the user is on the login page
    When the user logs in with locked account credentials
    Then an error message containing "Sorry, this user has been locked out" is displayed
    And the user remains on the login page

  Scenario: Login attempt with invalid credentials
    Given the user is on the login page
    When the user logs in with invalid credentials
    Then an error message containing "Username and password do not match" is displayed
    And the user remains on the login page
