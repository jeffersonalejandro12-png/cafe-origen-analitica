const ventasDia1 = require("./datos");
const catalogo = require("./catalogo");
const {
  comboRegaloFuerzaBruta,
  comboRegalo,
  productoEstrellaPorCiudad,
  primerClienteUnico
} = require("./analitica");

console.log("=== COMBO REGALO ===");
console.log("Valor 87.000 (optimizado):", comboRegalo(catalogo, 87000));
console.log("Valor 87.000 (fuerza bruta):", comboRegaloFuerzaBruta(catalogo, 87000));
console.log("Valor 61.000 (optimizado):", comboRegalo(catalogo, 61000));
console.log("Valor 500.000 sin combinación:", comboRegalo(catalogo, 500000));
console.log("Catálogo vacío:", comboRegalo([], 87000));

console.log("\n=== PRODUCTO ESTRELLA POR CIUDAD ===");
console.log(productoEstrellaPorCiudad(ventasDia1));
console.log("Ventas vacías:", productoEstrellaPorCiudad([]));

console.log("\n=== PRIMER CLIENTE ÚNICO ===");
console.log("Día 1 (esperado C04):", primerClienteUnico(ventasDia1));
console.log("Ventas vacías (esperado null):", primerClienteUnico([]));