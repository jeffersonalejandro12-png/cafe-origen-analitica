const ventasDia1 = require("./datos");
const { generarVentas } = require("./generador");
const { clientesRecurrentes } = require("./analitica");

console.log("Verificación Día 1 (esperado C01, C02, C03):", clientesRecurrentes(ventasDia1));

const tamanos = [1000, 2000, 4000, 8000, 16000];
const mediciones = [];

for (const n of tamanos) {
  const lote = generarVentas(n);
  const etiqueta = `n=${n}`;

  const inicio = performance.now();
  console.time(etiqueta);
  const res = clientesRecurrentes(lote);
  console.timeEnd(etiqueta);
  const fin = performance.now();

  mediciones.push({
    n,
    tiempoMs: Number((fin - inicio).toFixed(3)),
    recurrentesEncontrados: res.length
  });
}

console.table(mediciones);

// Estimación basada en la última medición (n = 16.000) usando crecimiento cuadrático: (n_obj / n_base)^2 * t_base
const base = mediciones[mediciones.length - 1];
const estimarMs = (nObjetivo) => {
  const factor = nObjetivo / base.n;
  return base.tiempoMs * factor * factor;
};

const est100kMs = estimarMs(100000);
const est1mMs = estimarMs(1000000);

console.log("\nESTIMACIONES BASADAS EN MEDICIÓN REAL");
console.log(`Base: n=${base.n} -> ${base.tiempoMs} ms`);
console.log(
  `Estimación n=100.000: ${est100kMs.toFixed(1)} ms (${(est100kMs / 1000).toFixed(2)} s)`
);
console.log(
  `Estimación n=1.000.000: ${est1mMs.toFixed(1)} ms (${(est1mMs / 1000).toFixed(2)} s / ${(est1mMs / 60000).toFixed(2)} min)`
);

if (est100kMs < 120000) {
  const lote100k = generarVentas(100000);
  const t0 = performance.now();
  clientesRecurrentes(lote100k);
  const t1 = performance.now();
  console.log(`Ejecución real n=100.000: ${(t1 - t0).toFixed(1)} ms`);
} else {
  console.log("Se omite ejecutar n=100.000 porque la estimación supera los 2 minutos.");
}