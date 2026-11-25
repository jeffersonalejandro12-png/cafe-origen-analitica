const ventasDia1 = require("./datos");
const catalogo = require("./catalogo");
const { generarVentas } = require("./generador");
const {
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  totalPorCiudad,
  totalCiudadUnaPasada,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  clientesRecurrentesSet,
  productoEstrellaPorCiudad,
  comboRegalo,
  primerClienteUnico,
  mejorSemana
} = require("./analitica");

function formatoCOP(valor) {
  return `${Number(valor).toLocaleString("es-CO")} COP`;
}

function imprimirSeccion(titulo) {
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

const argumentoN = process.argv[2];
let ventas;
let origenDatos;
let ventasDiariasParaSemana;

if (argumentoN !== undefined) {
  const n = Number(argumentoN);
  if (!Number.isFinite(n) || n <= 0) {
    console.error("Uso: node src/reporte.js [cantidad_de_ventas] (ej. node src/reporte.js 100000)");
    process.exit(1);
  }
  const cantidad = Math.floor(n);
  ventas = generarVentas(cantidad);
  origenDatos = `Generado (${cantidad.toLocaleString("es-CO")} ventas)`;
  ventasDiariasParaSemana = Array.from({ length: Math.max(30, cantidad) }, (_, idx) => {
    const base = ventas[idx % ventas.length];
    return Math.round((base.cantidad * base.precio) / 1000);
  });
} else {
  ventas = ventasDia1;
  origenDatos = `Datos reales Día 1 (${ventasDia1.length} ventas)`;
  ventasDiariasParaSemana = [
    320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
    480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
    710, 380, 360, 440, 500, 590, 650, 720, 400, 370
  ];
}

const tInicio = performance.now();

console.log("CAFÉ ORIGEN — REPORTE DE ANALÍTICA DE VENTAS (v1.0)");
console.log(`Fuente de datos: ${origenDatos}`);

imprimirSeccion("1. RESUMEN GENERAL");
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

imprimirSeccion("2. VENTAS POR CIUDAD");
const porCiudad = totalPorCiudad(ventas);
const tablaCiudades = Object.entries(porCiudad).map(([ciudad, total]) => ({
  Ciudad: ciudad,
  "Total Vendido": formatoCOP(total),
  "Verificación (1 pasada)": formatoCOP(totalCiudadUnaPasada(ventas, ciudad))
}));
console.table(tablaCiudades);

imprimirSeccion("3. UNIDADES POR PRODUCTO");
const porProducto = unidadesPorProducto(ventas);
const tablaProductos = Object.entries(porProducto).map(([producto, unidades]) => ({
  Producto: producto,
  Unidades: unidades
}));
console.table(tablaProductos);

imprimirSeccion("4. TOP 3 PRODUCTOS POR VALOR GENERADO");
const top3 = topProductosPorValor(ventas, 3);
const tablaTop3 = top3.map((item, indice) => ({
  Puesto: indice + 1,
  Producto: item.producto,
  "Valor Generado": formatoCOP(item.totalValor)
}));
console.table(tablaTop3);

imprimirSeccion("5. RESUMEN POR DÍA (CON VENTAS Y SIN VENTAS)");
const fechaConVentas = ventas[0] ? ventas[0].fecha : "2026-09-01";
imprimirResumenDia(ventasDelDia(ventas, fechaConVentas));
console.log("---------------------------------------------------------------------");
imprimirResumenDia(ventasDelDia(ventas, "2026-09-10"));

imprimirSeccion("6. CLIENTES RECURRENTES Y CUPÓN DE REGRESO");
const recurrentes = clientesRecurrentesSet(ventas);
const primerUnico = primerClienteUnico(ventas);
console.log(`Clientes recurrentes (${recurrentes.length}): ${recurrentes.join(", ") || "Ninguno"}`);
console.log(`Primer cliente único para cupón: ${primerUnico || "No disponible"}`);

imprimirSeccion("7. PRODUCTO ESTRELLA POR CIUDAD");
const estrellas = productoEstrellaPorCiudad(ventas);
const tablaEstrellas = Object.entries(estrellas).map(([ciudad, info]) => ({
  Ciudad: ciudad,
  "Producto Estrella": info.producto,
  Apariciones: info.apariciones
}));
console.table(tablaEstrellas);

imprimirSeccion("8. COMBO DE REGALO SUGERIDO ($87.000)");
const combo87k = comboRegalo(catalogo, 87000);
if (combo87k) {
  console.log(
    `Sugerencia ($87.000): ${combo87k[0].producto} (${formatoCOP(combo87k[0].precio)}) + ${
      combo87k[1].producto
    } (${formatoCOP(combo87k[1].precio)})`
  );
} else {
  console.log("Sugerencia ($87.000): No existe combinación exacta.");
}

imprimirSeccion("9. MEJOR SEMANA CONSECUTIVA (k = 7)");
const semanaOptima = mejorSemana(ventasDiariasParaSemana, 7);
if (semanaOptima) {
  console.log(
    `Inicio en día/posición: ${semanaOptima.diaInicio} | Total acumulado: ${semanaOptima.total.toLocaleString(
      "es-CO"
    )} (miles COP)`
  );
} else {
  console.log("No hay suficientes días para evaluar una semana de k días.");
}

const tFin = performance.now();
console.log(`\nTiempo total de ejecución del reporte: ${(tFin - tInicio).toFixed(2)} ms`);