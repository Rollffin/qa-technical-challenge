# language: es
Característica: Autenticación de usuario
  Como usuario de Saucedemo
  Quiero poder iniciar sesión en la aplicación
  Para acceder al catálogo de productos

  Escenario: Inicio de sesión exitoso con credenciales válidas
    Dado que el usuario está en la página de login
    Cuando el usuario inicia sesión con credenciales válidas
    Entonces el usuario es redirigido a la página de productos

  Escenario: Intento de login con cuenta bloqueada
    Dado que el usuario está en la página de login
    Cuando el usuario inicia sesión con una cuenta bloqueada
    Entonces se muestra un mensaje de error que contiene "Sorry, this user has been locked out"
    Y el usuario permanece en la página de login

  Escenario: Intento de login con credenciales inválidas
    Dado que el usuario está en la página de login
    Cuando el usuario inicia sesión con credenciales inválidas
    Entonces se muestra un mensaje de error que contiene "Username and password do not match"
    Y el usuario permanece en la página de login
