# language: es
Característica: Prevención de compra con carrito vacío
  Como QA engineer
  Quiero verificar que no se puede completar una compra con el carrito vacío
  Para asegurar que el sistema previene transacciones inválidas

  Escenario: El checkout con carrito vacío no debe resultar en una confirmación de orden
    Dado que el usuario ha iniciado sesión con credenciales válidas
    Y el carrito no contiene productos
    Cuando el usuario navega al carrito
    Y el usuario intenta completar el proceso de checkout
    Entonces la confirmación del pedido no debería mostrarse
