# language: es
Característica: Compra exitosa
  Como usuario autenticado
  Quiero completar una compra
  Para adquirir productos de la tienda

  Escenario: Compra completa de dos productos con validación del total del pedido
    Dado que el usuario ha iniciado sesión con credenciales válidas
    Cuando el usuario agrega el Bolt T-Shirt y el Red T-Shirt al carrito
    Y el usuario navega al carrito
    Y el usuario procede al checkout
    Y el usuario completa los datos de envío
    Y el total del pedido coincide con el subtotal más el impuesto
    Y el usuario confirma el pedido
    Entonces se muestra el mensaje de confirmación "Thank you for your order!"
