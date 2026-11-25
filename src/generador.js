const CATALOGO = [
  { producto: "Origen Huila 500 g", precio: 42000 },
  { producto: "Origen Nariño 250 g", precio: 26000 },
  { producto: "Prensa francesa", precio: 95000 },
  { producto: "Origen Sierra 500 g", precio: 45000 },
  { producto: "Molino manual", precio: 120000 }
];

const CIUDADES = ["Medellín", "Bogotá", "Cali", "Pereira"];

function aleatorioEntero(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generarVentas(n) {
  const cantidadRegistros = Math.max(0, Math.floor(n));
  const maxClientes = Math.max(1, Math.floor(cantidadRegistros / 3));
  const ventasGeneradas = [];

  for (let i = 0; i < cantidadRegistros; i++) {
    const item = CATALOGO[aleatorioEntero(0, CATALOGO.length - 1)];
    const ciudad = CIUDADES[aleatorioEntero(0, CIUDADES.length - 1)];
    const numCliente = aleatorioEntero(1, maxClientes);
    const cliente = `C${String(numCliente).padStart(2, "0")}`;
    const cantidad = aleatorioEntero(1, 5);
    const dia = String(aleatorioEntero(1, 28)).padStart(2, "0");

    ventasGeneradas.push({
      id: i + 1,
      fecha: `2026-09-${dia}`,
      cliente,
      producto: item.producto,
      ciudad,
      cantidad,
      precio: item.precio
    });
  }

  return ventasGeneradas;
}

module.exports = { generarVentas };