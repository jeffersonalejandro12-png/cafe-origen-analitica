const { generarVentas } = require("./generador");
const { totalCiudadCadena, totalCiudadUnaPasada } = require("./analitica");

const lote10k = generarVentas(10000);
const ciudadesPrueba = ["Medellín", "Bogotá ", "Cali", "Pereira"];

for (const ciudad of ciudadesPrueba) {
  const resCadena = totalCiudadCadena(lote10k, ciudad);
  const resUnaPasada = totalCiudadUnaPasada(lote10k, ciudad);
  const coinciden = resCadena === resUnaPasada;

  console.log(
    `Ciudad "${ciudad}": ${coinciden ? "OK" : "DIFERENTE"} -> cadena=${resCadena} | unaPasada=${resUnaPasada}`
  );
}