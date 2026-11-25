const { generarVentas } = require("./generador");
const {
  primeraVenta,
  totalVendidoInst,
  ventaMayorInst,
  totalPorCiudadInst
} = require("./analitica");

const tamanos = [100, 1000, 10000, 100000];
const resultados = [];

for (const n of tamanos) {
  const lote = generarVentas(n);

  const cConstante = { ops: 0 };
  primeraVenta(lote, cConstante);

  const cTotal = { ops: 0 };
  totalVendidoInst(lote, cTotal);

  const cMayor = { ops: 0 };
  ventaMayorInst(lote, cMayor);

  const cCiudad = { ops: 0 };
  totalPorCiudadInst(lote, cCiudad);

  resultados.push({
    n,
    primeraVenta: cConstante.ops,
    totalVendido: cTotal.ops,
    ventaMayor: cMayor.ops,
    totalPorCiudad: cCiudad.ops
  });
}

console.table(resultados);