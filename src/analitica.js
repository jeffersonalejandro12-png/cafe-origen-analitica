function valorVenta(venta) {
  return venta.cantidad * venta.precio;
}

// --- MiniReto 2 (ciclos for...of) ---

function totalVendido(ventas) {
  let total = 0;
  for (const venta of ventas) {
    total += valorVenta(venta);
  }
  return total;
}

function unidadesVendidas(ventas) {
  let unidades = 0;
  for (const venta of ventas) {
    unidades += venta.cantidad;
  }
  return unidades;
}

function ventaMayor(ventas) {
  let mayor = null;
  for (const venta of ventas) {
    if (mayor === null || valorVenta(venta) > valorVenta(mayor)) {
      mayor = venta;
    }
  }
  return mayor;
}

function ticketPromedio(ventas) {
  let total = 0;
  let ventasValidas = 0;

  for (const venta of ventas) {
    if (venta.cantidad > 0) {
      total += valorVenta(venta);
      ventasValidas += 1;
    }
  }

  if (ventasValidas === 0) {
    return 0;
  }

  return total / ventasValidas;
}

function ventasPorCiudad(ventas, ciudad) {
  const objetivo = String(ciudad).trim().toLowerCase();
  let totalCiudad = 0;

  for (const venta of ventas) {
    const ciudadVenta = String(venta.ciudad).trim().toLowerCase();
    if (ciudadVenta === objetivo) {
      totalCiudad += valorVenta(venta);
    }
  }

  return totalCiudad;
}

// --- Helper de normalización para nombres ---

function normalizarNombre(texto) {
  const limpio = String(texto).trim().toLowerCase();
  return limpio
    .split(/\s+/)
    .map((palabra) => {
      if (palabra === "de" || palabra === "del" || palabra === "la" || palabra === "el") {
        return palabra;
      }
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(" ");
}

// --- MiniReto 3 (métodos de arreglo, agrupaciones y ranking) ---

function totalVendidoM(ventas) {
  return ventas
    .map((venta) => valorVenta(venta))
    .reduce((acumulado, monto) => acumulado + monto, 0);
}

function unidadesVendidasM(ventas) {
  return ventas
    .map((venta) => venta.cantidad)
    .reduce((acumulado, cantidad) => acumulado + cantidad, 0);
}

function ventasPorCiudadM(ventas, ciudad) {
  const objetivo = String(ciudad).trim().toLowerCase();
  return ventas
    .filter((venta) => String(venta.ciudad).trim().toLowerCase() === objetivo)
    .reduce((acumulado, venta) => acumulado + valorVenta(venta), 0);
}

function totalPorCiudad(ventas) {
  return ventas.reduce((diccionario, venta) => {
    const ciudadNormalizada = normalizarNombre(venta.ciudad);
    if (!Object.prototype.hasOwnProperty.call(diccionario, ciudadNormalizada)) {
      diccionario[ciudadNormalizada] = 0;
    }
    diccionario[ciudadNormalizada] += valorVenta(venta);
    return diccionario;
  }, {});
}

function unidadesPorProducto(ventas) {
  return ventas.reduce((diccionario, venta) => {
    const productoNormalizado = String(venta.producto).trim();
    if (!Object.prototype.hasOwnProperty.call(diccionario, productoNormalizado)) {
      diccionario[productoNormalizado] = 0;
    }
    diccionario[productoNormalizado] += venta.cantidad;
    return diccionario;
  }, {});
}

function topProductosPorValor(ventas, k) {
  const valorPorProducto = ventas.reduce((diccionario, venta) => {
    const productoNormalizado = String(venta.producto).trim();
    if (!Object.prototype.hasOwnProperty.call(diccionario, productoNormalizado)) {
      diccionario[productoNormalizado] = 0;
    }
    diccionario[productoNormalizado] += valorVenta(venta);
    return diccionario;
  }, {});

  const entradas = Object.entries(valorPorProducto);
  const copiaOrdenada = [...entradas].sort((a, b) => b[1] - a[1]);

  return copiaOrdenada.slice(0, k).map(([producto, total]) => ({
    producto,
    totalValor: total
  }));
}

function ventasDelDia(ventas, fecha) {
  const fechaObjetivo = String(fecha).trim();
  const registros = ventas.filter((venta) => String(venta.fecha).trim() === fechaObjetivo);

  return {
    fecha: fechaObjetivo,
    registros,
    cantidadVentas: registros.length,
    totalVendido: totalVendido(registros),
    unidadesVendidas: unidadesVendidas(registros),
    ticketPromedio: ticketPromedio(registros)
  };
}
function primeraVenta(ventas, contador = { ops: 0 }) {
  contador.ops += 1;
  return ventas.length > 0 ? ventas[0] : null;
}

function totalVendidoInst(ventas, contador) {
  let total = 0;
  for (const venta of ventas) {
    contador.ops += 1; // visita/procesa un elemento
    total += valorVenta(venta);
  }
  return total;
}

function ventaMayorInst(ventas, contador) {
  let mayor = null;
  for (const venta of ventas) {
    contador.ops += 1; // visita un elemento
    if (mayor === null) {
      contador.ops += 1; // comparación inicial
      mayor = venta;
    } else {
      contador.ops += 1; // comparación entre valores
      if (valorVenta(venta) > valorVenta(mayor)) {
        mayor = venta;
      }
    }
  }
  return mayor;
}

function totalPorCiudadInst(ventas, contador) {
  const diccionario = {};
  for (const venta of ventas) {
    contador.ops += 1; // visita un elemento
    const ciudadNormalizada = normalizarNombre(venta.ciudad);
    contador.ops += 1; // consulta/actualización en diccionario
    if (!Object.prototype.hasOwnProperty.call(diccionario, ciudadNormalizada)) {
      diccionario[ciudadNormalizada] = 0;
    }
    diccionario[ciudadNormalizada] += valorVenta(venta);
  }
  return diccionario;
}

function clientesRecurrentes(ventas) {
  const recurrentes = [];
  for (let i = 0; i < ventas.length; i++) {
    for (let j = i + 1; j < ventas.length; j++) {
      if (
        ventas[i].cliente === ventas[j].cliente &&
        !recurrentes.includes(ventas[i].cliente)
      ) {
        recurrentes.push(ventas[i].cliente);
      }
    }
  }
  return recurrentes;
}

function totalCiudadCadena(ventas, ciudad) {
  const objetivo = String(ciudad).trim().toLowerCase();

  return ventas
    .map((venta) => ({
      ...venta,
      ciudadNormalizada: String(venta.ciudad).trim().toLowerCase()
    }))
    .filter((venta) => venta.ciudadNormalizada === objetivo)
    .map((venta) => valorVenta(venta))
    .reduce((acumulado, monto) => acumulado + monto, 0);
}

function totalCiudadUnaPasada(ventas, ciudad) {
  const objetivo = String(ciudad).trim().toLowerCase();
  let total = 0;

  for (const venta of ventas) {
    if (String(venta.ciudad).trim().toLowerCase() === objetivo) {
      total += valorVenta(venta);
    }
  }

  return total;
}

module.exports = {
  valorVenta,
  totalVendido,
  unidadesVendidas,
  ventaMayor,
  ticketPromedio,
  ventasPorCiudad,
  totalVendidoM,
  unidadesVendidasM,
  ventasPorCiudadM,
  totalPorCiudad,
  unidadesPorProducto,
  topProductosPorValor,
  ventasDelDia,
  primeraVenta,
  totalVendidoInst,
  ventaMayorInst,
  totalPorCiudadInst,
  clientesRecurrentes,
  totalCiudadCadena,
  totalCiudadUnaPasada
};