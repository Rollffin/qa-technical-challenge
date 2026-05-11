Feature: Compra exitosa
  Como usuario autenticado
  Quiero completar una compra
  Para adquirir productos de la tienda

  Scenario: Compra completa de dos productos con validación del total del pedido
    Given que el usuario ha iniciado sesión con credenciales válidas
    When el usuario agrega el Bolt T-Shirt y el Red T-Shirt al carrito
    And el usuario navega al carrito
    And el usuario procede al checkout
    And el usuario completa los datos de envío
    And el total del pedido coincide con el subtotal más el impuesto
    And el usuario confirma el pedido
    Then se muestra el mensaje de confirmación "Thank you for your order!"
