const catalogo = require("./catalogo");
const { mejorSemanaBruta, mejorSemana, parMasCercano } = require("./analitica");

const ventasDiarias = [
  320, 410, 280, 390, 510, 620, 700, 300, 290, 450,
  480, 530, 610, 680, 350, 330, 420, 470, 560, 640,
  710, 380, 360, 440, 500, 590, 650, 720, 400, 370
];

console.log("=== MEJOR SEMANA (SEPTIEMBRE, k = 7) ===");
const resBrutaSep = mejorSemanaBruta(ventasDiarias, 7);
const resVentanaSep = mejorSemana(ventasDiarias, 7);
console.log("Fuerza bruta:", resBrutaSep);
console.log("Ventana deslizante:", resVentanaSep);
console.log("¿Coinciden?:", JSON.stringify(resBrutaSep) === JSON.stringify(resVentanaSep) ? "OK" : "DIFERENTE");
console.log("Caso borde k > días:", mejorSemana([100, 200], 7));

// Generar 100.000 días al azar y comparar tiempos
const dias100k = Array.from({ length: 100000 }, () => Math.floor(Math.random() * 600) + 200);

const t0 = performance.now();
const rBruta100k = mejorSemanaBruta(dias100k, 7);
const t1 = performance.now();

const t2 = performance.now();
const rVentana100k = mejorSemana(dias100k, 7);
const t3 = performance.now();

console.log("\n=== COMPARACIÓN 100.000 DÍAS (k = 7) ===");
console.log("¿Coinciden?:", JSON.stringify(rBruta100k) === JSON.stringify(rVentana100k) ? "OK" : "DIFERENTE");
console.log(`Tiempo fuerza bruta: ${(t1 - t0).toFixed(3)} ms`);
console.log(`Tiempo ventana deslizante: ${(t3 - t2).toFixed(3)} ms`);

console.log("\n=== PAR MÁS CERCANO (DOS PUNTEROS) ===");
console.log("Presupuesto 100.000:", parMasCercano(catalogo, 100000));
console.log("Presupuesto 140.000:", parMasCercano(catalogo, 140000));
console.log("Presupuesto 40.000 (sin solución):", parMasCercano(catalogo, 40000));