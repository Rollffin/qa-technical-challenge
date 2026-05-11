Feature: Prevención de compra con carrito vacío
  Como QA engineer
  Quiero verificar que no se puede completar una compra con el carrito vacío
  Para asegurar que el sistema previene transacciones inválidas

  Scenario: El checkout con carrito vacío no debe resultar en una confirmación de orden
    Given que el usuario ha iniciado sesión con credenciales válidas
    And el carrito no contiene productos
    When el usuario navega al carrito
    And el usuario intenta completar el proceso de checkout
    Then la confirmación del pedido no debería mostrarse
