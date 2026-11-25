const ventasDia1 = require("./datos");
const { generarVentas } = require("./generador");
const {
  clientesRecurrentes,
  clientesRecurrentesSet,
  clientesRecurrentesDesdeMap
} = require("./analitica");

function mismosOrdenados(arrA, arrB) {
  const a = [...arrA].sort();
  const b = [...arrB].sort();
  return JSON.stringify(a) === JSON.stringify(b);
}

function verificarConjunto(nombre, lote) {
  const rOrig = clientesRecurrentes(lote);
  const rSet = clientesRecurrentesSet(lote);
  const rMap = clientesRecurrentesDesdeMap(lote);

  const okSet = mismosOrdenados(rOrig, rSet);
  const okMap = mismosOrdenados(rOrig, rMap);

  console.log(
    `[${nombre}] Set vs Original: ${okSet ? "OK" : "DIFERENTE"} | Map vs Original: ${
      okMap ? "OK" : "DIFERENTE"
    } (total recurrentes: ${rSet.length})`
  );
}

verificarConjunto("Día 1 (12 ventas)", ventasDia1);
const lote5k = generarVentas(5000);
verificarConjunto("5.000 ventas", lote5k);

console.log("\n=== MEDICIÓN DE TIEMPOS (1.000, 10.000 y 100.000) ===");
const tablaTiempos = [];

for (const n of [1000, 10000, 100000]) {
  const lote = generarVentas(n);

  let tiempoOrigStr = "Omitido (>10k)";
  if (n <= 10000) {
    const t0 = performance.now();
    clientesRecurrentes(lote);
    const t1 = performance.now();
    tiempoOrigStr = `${(t1 - t0).toFixed(2)} ms`;
  }

  const t2 = performance.now();
  clientesRecurrentesSet(lote);
  const t3 = performance.now();
  const tiempoSet = `${(t3 - t2).toFixed(2)} ms`;

  const t4 = performance.now();
  clientesRecurrentesDesdeMap(lote);
  const t5 = performance.now();
  const tiempoMap = `${(t5 - t4).toFixed(2)} ms`;

  console.log(`n=${n} -> Original: ${tiempoOrigStr} | Set: ${tiempoSet} | Map: ${tiempoMap}`);
  tablaTiempos.push({
    n,
    Original: tiempoOrigStr,
    Set: tiempoSet,
    Map: tiempoMap
  });
}

console.table(tablaTiempos);