const ventas = require("./datos");
const {
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia
} = require("./analitica");

function formatoCOP(valor) {
  return `${Number(valor).toLocaleString("es-CO")} COP`;
}

function imprimirLineaSeparadora(titulo) {
  console.log(`  ${titulo}`);
}

function imprimirResumenDia(resumen) {
  console.log(`Fecha: ${resumen.fecha}`);
  if (resumen.cantidadVentas === 0) {
    console.log("Estado: Sin ventas registradas en esta fecha.");
    console.log(`Total vendido: ${formatoCOP(0)} | Unidades: 0 | Ticket promedio: ${formatoCOP(0)}`);
    return;
  }

  console.log(`Ventas registradas: ${resumen.cantidadVentas}`);
  console.log(`Total vendido: ${formatoCOP(resumen.totalVendido)}`);
  console.log(`Unidades vendidas: ${resumen.unidadesVendidas}`);
  console.log(`Ticket promedio: ${formatoCOP(Math.round(resumen.ticketPromedio))}`);
}

console.log("CAFÉ ORIGEN — REPORTE DE ANALÍTICA DE VENTAS (v0.1)");

// 1. Resumen general
imprimirLineaSeparadora("1. RESUMEN GENERAL");
const mayor = ventaMayor(ventas);
console.log(`Total vendido:      ${formatoCOP(totalVendido(ventas))}`);
console.log(`Unidades vendidas:  ${unidadesVendidas(ventas)}`);
console.log(`Ticket promedio:    ${formatoCOP(Math.round(ticketPromedio(ventas)))}`);
if (mayor) {
  console.log(
    `Venta más grande:   #${mayor.id} — ${mayor.producto} (${mayor.ciudad}) por ${formatoCOP(
      mayor.cantidad * mayor.precio
    )}`
  );
} else {
  console.log("Venta más grande:   No disponible");
}

// 2. Ventas por ciudad
imprimirLineaSeparadora("2. VENTAS POR CIUDAD");
const porCiudad = totalPorCiudad(ventas);
const tablaCiudades = Object.entries(porCiudad).map(([ciudad, total]) => ({
  Ciudad: ciudad,
  "Total Vendido": formatoCOP(total)
}));
console.table(tablaCiudades);

// 3. Unidades por producto
imprimirLineaSeparadora("3. UNIDADES POR PRODUCTO");
const porProducto = unidadesPorProducto(ventas);
const tablaProductos = Object.entries(porProducto).map(([producto, unidades]) => ({
  Producto: producto,
  Unidades: unidades
}));
console.table(tablaProductos);

// 4. Top 3 de productos por valor
imprimirLineaSeparadora("4. TOP 3 PRODUCTOS POR VALOR GENERADO");
const top3 = topProductosPorValor(ventas, 3);
const tablaTop3 = top3.map((item, indice) => ({
  Puesto: indice + 1,
  Producto: item.producto,
  "Valor Generado": formatoCOP(item.totalValor)
}));
console.table(tablaTop3);

// 5. Consulta diaria (día con ventas y día sin ventas)
imprimirLineaSeparadora("5. RESUMEN POR DÍA (CON VENTAS Y SIN VENTAS)");
imprimirResumenDia(ventasDelDia(ventas, "2026-09-01"));
console.log("-----------------------------------------------------------------");
imprimirResumenDia(ventasDelDia(ventas, "2026-09-10"));