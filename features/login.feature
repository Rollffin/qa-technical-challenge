Feature: Autenticación de usuario
  Como usuario de Saucedemo
  Quiero poder iniciar sesión en la aplicación
  Para acceder al catálogo de productos

  Scenario: Inicio de sesión exitoso con credenciales válidas
    Given que el usuario está en la página de login
    When el usuario inicia sesión con credenciales válidas
    Then el usuario es redirigido a la página de productos

  Scenario: Intento de login con cuenta bloqueada
    Given que el usuario está en la página de login
    When el usuario inicia sesión con una cuenta bloqueada
    Then se muestra un mensaje de error que contiene "Sorry, this user has been locked out"
    And el usuario permanece en la página de login

  Scenario: Intento de login con credenciales inválidas
    Given que el usuario está en la página de login
    When el usuario inicia sesión con credenciales inválidas
    Then se muestra un mensaje de error que contiene "Username and password do not match"
    And el usuario permanece en la página de login
