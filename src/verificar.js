const ventas = require("./datos");
const {
  totalVendido,
  unidadesVendidas,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor
} = require("./analitica");

// Guardamos una copia de referencia de los IDs en su orden original
const ordenOriginalIds = ventas.map((v) => v.id);

function comparar(etiqueta, cicloVal, metodoVal) {
  const estado = cicloVal === metodoVal ? "OK" : "DIFERENTE";
  console.log(`${etiqueta}: ${estado} (ciclo: ${cicloVal} | método: ${metodoVal})`);
}

console.log("=== COMPARACIÓN CICLO VS MÉTODOS ===");
comparar("totalVendido (completo)", totalVendido(ventas), totalVendidoM(ventas));
comparar("totalVendido (vacío)", totalVendido([]), totalVendidoM([]));

comparar("unidadesVendidas (completo)", unidadesVendidas(ventas), unidadesVendidasM(ventas));
comparar("unidadesVendidas (vacío)", unidadesVendidas([]), unidadesVendidasM([]));

comparar(
  "ventasPorCiudad 'Medellín' (completo)",
  ventasPorCiudad(ventas, "Medellín"),
  ventasPorCiudadM(ventas, "Medellín")
);
comparar(
  "ventasPorCiudad 'Bogotá ' (completo)",
  ventasPorCiudad(ventas, "Bogotá "),
  ventasPorCiudadM(ventas, "Bogotá ")
);
comparar(
  "ventasPorCiudad 'Cali' (vacío)",
  ventasPorCiudad([], "Cali"),
  ventasPorCiudadM([], "Cali")
);

console.log("\n=== AGRUPACIONES Y RANKING ===");
const porCiudad = totalPorCiudad(ventas);
console.log("totalPorCiudad:", porCiudad);
console.log("Cantidad de ciudades:", Object.keys(porCiudad).length);

console.log("\nunidadesPorProducto:", unidadesPorProducto(ventas));

const top3 = topProductosPorValor(ventas, 3);
console.log("\ntopProductosPorValor(ventas, 3):", top3);

// Verificar inmutabilidad del arreglo original
const ordenActualIds = ventas.map((v) => v.id);
const sinMutacion = JSON.stringify(ordenOriginalIds) === JSON.stringify(ordenActualIds);
console.log("\n¿Arreglo ventas sin mutar?:", sinMutacion ? "OK" : "DIFERENTE");

